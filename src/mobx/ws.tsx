import { notification } from 'antd'
import { action, configure, makeObservable, observable, toJS } from 'mobx'

import { stores } from '@/context/mobxProvider'
import ENV from '@/env'
import { formaOrderList } from '@/services/api/tradeCore/order'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import { getCurrentQuote } from '@/utils/wsUtil'

import klineStore from './kline'
import trade from './trade'
import { IDepth, IQuoteItem, ITradeType, MessagePopupInfo, WorkerType } from './ws.types'

// WebSocket 的四个状态
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
export type IReadyState =
  /**0 WebSocket 连接正在进行中 */
  | 'CONNECTING'
  /**1 WebSocket 连接已经建立并且可以进行通信 */
  | 'OPEN'
  /**2 WebSocket 连接正在关闭过程中。此时，客户端或服务器已经开始关闭连接，但连接还没有完全关闭，双方还可以继续发送和接收消息 */
  | 'CLOSEING'
  /**3 WebSocket 连接已经关闭，连接断开，无法再发送或接收消息 */
  | 'CLOSED'

// 禁用 MobX 严格模式
configure({ enforceActions: 'never' })

class WSStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  initConnectTimer: any = null
  reconnectTimer: any = null
  worker: Worker | null = null
  @observable readyState = 0 // ws连接状态
  @observable socket: any = null
  @observable quotes = new Map<string, IQuoteItem>() // 当前行情
  @observable depth = new Map<string, IDepth>() // 当前行情
  @observable symbols = {} // 储存品种请求列表
  @observable websocketUrl = ENV.ws

  // ========== 连接相关 start ==========
  @action
  async connect() {
    const token = await STORAGE_GET_TOKEN()
    const userInfo = (await STORAGE_GET_USER_INFO()) as User.UserInfo
    if (!token) return

    this.initWorker()

    // 向worker线程发送连接指令
    this.initConnectTimer = setTimeout(() => {
      this.sendWorkerMessage({
        type: 'INIT_CONNECT',
        data: {
          token,
          userInfo,
          websocketUrl: this.websocketUrl
        }
      })
    }, 300)
  }

  @action
  close = () => {
    this.sendWorkerMessage({
      type: 'CLOSE'
    })
    if (this.initConnectTimer) clearTimeout(this.initConnectTimer)
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
  }

  // 关闭worker线程
  closeWorker = () => {
    if (this.worker) {
      // 在主线程中关闭worker，避免资源浪费
      this.worker.terminate()
      this.worker = null
    }
  }

  // 中断连接再重连
  @action
  reconnect() {
    this.close()
    // 重新连接
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, 1000)
  }

  // 初始化worker线程
  initWorker() {
    this.worker = this.worker || new Worker(new URL('./ws.worker.ts', import.meta.url))
    this.worker.onmessage = this.handleWorkerMessage
  }

  // 接收worker线程消息
  handleWorkerMessage = (event: MessageEvent) => {
    const { data } = event.data
    const type = event.data?.type as WorkerType

    switch (type) {
      case 'CONNECT_SUCCESS':
        this.handleOpenCallback()
        this.readyState = data?.readyState
        break
      case 'SYMBOL_RES':
        // 更新行情
        this.quotes = data
        // 更新k线数据
        klineStore.updateKlineData(this.quotes)
        break
      case 'DEPTH_RES':
        // 更新深度
        this.depth = data
        break
      case 'TRADE_RES':
        // 更新交易信息
        this.receiveTradeMessage(data)
        break
      case 'MESSAGE_RES':
        // 更新消息通知
        const info = data as MessagePopupInfo
        notification.info({
          message: <span className="text-primary font-medium">{info?.title}</span>,
          description: <span className="text-secondary">{info?.content}</span>,
          placement: 'bottomLeft',
          style: {
            background: 'var(--dropdown-bg)'
          }
        })
        // 刷新消息列表
        stores.global.getUnreadMessageCount()
        console.log('消息通知', data)
        break
      // 同步计算的结果返回
      case 'SYNC_CALCA_RES':
        stores.trade.accountBalanceInfo = data?.accountBalanceInfo
        stores.trade.positionListSymbolCalcInfo = data?.positionListSymbolCalcInfo
        stores.trade.rightWidgetSelectMarginInfo = data?.rightWidgetSelectMarginInfo
        stores.trade.expectedMargin = data?.expectedMargin
        stores.trade.maxOpenVolume = data?.maxOpenVolume
        // console.log('同步计算的结果返回', data)
        break
      case 'CLOSE':
        break
    }
  }

  // 向worker线程发送消息
  sendWorkerMessage = ({ type, data }: { type: WorkerType; data?: any }) => {
    if (this.worker) {
      // console.log('向worker线程发送消息', type, data)
      this.worker.postMessage({
        type,
        data
      })
    }
  }

  // 连接socket成功回调
  handleOpenCallback = () => {
    this.batchSubscribeSymbol()
    this.subscribeTrade()
    this.subscribeDepth()
    this.subscribeMessage()
  }

  // ========== 连接相关 end ===============

  // ============ 订阅相关 start ============

  // 批量订阅行情(查询symbol列表后)
  batchSubscribeSymbol = ({
    cancel = false,
    list = []
  }: {
    cancel?: boolean
    needAccountGroupId?: boolean
    list?: Array<{ accountGroupId?: any; symbol: string; dataSourceCode?: any }>
  } = {}) => {
    const symbolList = toJS(list?.length ? list : trade.symbolListAll)
    if (!symbolList.length) return
    this.sendWorkerMessage({
      type: 'SUBSCRIBE_QUOTE',
      data: {
        cancel,
        list: symbolList
      }
    })
  }

  // 动态订阅汇率品种行情
  subscribeExchangeRateQuote = (symbolConf?: Symbol.SymbolConf) => {
    const quote = getCurrentQuote()
    // 如果不传，使用当前激活的品种配置
    const conf = symbolConf || quote?.symbolConf
    if (!conf) return

    const allSimpleSymbolsMap = trade.allSimpleSymbolsMap
    const unit = conf?.profitCurrency // 货币单位
    // 乘法
    const divName = ('USD' + unit).toUpperCase() // 如 USDNZD
    // 除法
    const mulName = (unit + 'USD').toUpperCase() // 如 NZDUSD

    const symbolInfo = allSimpleSymbolsMap[divName] || allSimpleSymbolsMap[mulName]

    if (!symbolInfo) return

    this.batchSubscribeSymbol({
      list: [
        {
          accountGroupId: trade.currentAccountInfo.accountGroupId,
          symbol: symbolInfo.symbol
        }
      ]
    })
  }

  // 订阅当前打开的品种深度报价
  subscribeDepth = (cancel?: boolean) => {
    const symbolInfo = trade.getActiveSymbolInfo()
    if (!symbolInfo?.symbol) return

    this.sendWorkerMessage({
      type: 'SUBSCRIBE_DEPTH',
      data: {
        cancel,
        symbolInfo: toJS(symbolInfo)
      }
    })
  }

  // 订阅持仓记录、挂单记录、账户余额信息
  subscribeTrade = (cancel?: boolean) => {
    const currentAccountInfo = trade.currentAccountInfo
    const accountId = currentAccountInfo?.id
    if (!accountId) return
    this.sendWorkerMessage({
      type: 'SUBSCRIBE_TRADE',
      data: {
        topic: `/000000/trade/${accountId}`,
        cancel
      }
    })
  }

  // 订阅消息
  subscribeMessage = async (cancel?: boolean) => {
    this.sendWorkerMessage({
      type: 'SUBSCRIBE_MESSAGE',
      data: {
        cancel
      }
    })
  }

  // ============ 订阅相关 end ============

  // 处理交易消息
  @action
  receiveTradeMessage = (data: any) => {
    const type = data.type as ITradeType
    // 账户余额变动
    if (type === 'ACCOUNT') {
      const accountInfo = data.account || {}
      trade.currentAccountInfo = {
        ...trade.currentAccountInfo,
        ...accountInfo
      }
    }
    // 持仓列表、挂单列表
    else if (type === 'ORDER') {
      // 使用ws实时数据更新
      const positionList = data.bagOrderList || []
      const pendingList = data.limiteOrderList || []

      trade.positionList = formaOrderList(positionList)
      trade.pendingList = formaOrderList(pendingList)
    } else if (type === 'LIMIT_ORDER') {
    }
    // 历史成交记录,用不到
    else if (type === 'TRADING') {
    }
  }
}

const ws = new WSStore()

export default ws
