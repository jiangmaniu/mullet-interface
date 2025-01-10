import { notification } from 'antd'
import { debounce } from 'lodash'
import { action, configure, makeObservable, observable, toJS } from 'mobx'

import { stores } from '@/context/mobxProvider'
import ENV from '@/env'
import { formaOrderList } from '@/services/api/tradeCore/order'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import { getCurrentQuote } from '@/utils/wsUtil'

import Iconfont from '@/components/Base/Iconfont'
import { getEnum } from '@/constants/enum'
import { isPCByWidth } from '@/utils'
import { getSymbolIcon, parseOrderMessage, removeOrderMessageFieldNames } from '@/utils/business'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'
import { getIntl } from '@umijs/max'
import { Toast } from 'antd-mobile'
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

export type SymbolWSItem = { accountGroupId?: any; symbol: string; dataSourceCode?: any }
export type SymbolWSItemSemi = { symbol: string; dataSourceCode?: string }

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

  originSend: any = null // socket 原生 send 方法
  sendingList: any[] = [] // 发送队列
  sendingSymbols = new Map<string, boolean>() // 发送队列

  // ========== 连接相关 start ==========
  @action
  async connect(resolve?: () => void) {
    const token = await STORAGE_GET_TOKEN()
    const userInfo = (await STORAGE_GET_USER_INFO()) as User.UserInfo
    if (!token) return

    this.initWorker(resolve)

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
    this.readyState = 0
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
  reconnect(cb?: () => void) {
    this.close()
    // 重新连接
    this.reconnectTimer = setTimeout(() => {
      this.connect(cb)
    }, 1000)
  }

  // 初始化worker线程
  initWorker(resolve?: () => void) {
    this.worker = this.worker || new Worker(new URL('./ws.worker.ts', import.meta.url))
    this.worker.onmessage = (event: MessageEvent) => {
      this.handleWorkerMessage(event, resolve)
    }
  }

  // 接收worker线程消息
  handleWorkerMessage = (event: MessageEvent, resolve?: () => void) => {
    const { data } = event.data
    const type = event.data?.type as WorkerType

    switch (type) {
      case 'CONNECT_SUCCESS':
        this.handleOpenCallback()
        this.readyState = data?.readyState
        resolve?.()
        break
      case 'SYMBOL_RES':
        // 增量更新行情
        if (data && data.size) {
          data.forEach((item: IQuoteItem, dataSourceKey: string) => {
            this.quotes.set(dataSourceKey, item)
          })
          // 更新k线数据
          klineStore.updateKlineData(this.quotes)
        }
        break
      case 'DEPTH_RES':
        // 更新深度
        if (data && data.size) {
          data.forEach((item: IDepth, dataSourceKey: string) => {
            this.depth.set(dataSourceKey, item)
          })
        }
        break
      case 'TRADE_RES':
        // 更新交易信息
        this.receiveTradeMessage(data)
        break
      case 'MESSAGE_RES':
        // 更新消息通知
        const info = data as MessagePopupInfo
        const content = removeOrderMessageFieldNames(info?.content || '')
        if (isPCByWidth()) {
          notification.info({
            message: <span className="text-primary font-medium">{info?.title}</span>,
            description: <span className="text-secondary">{content}</span>,
            placement: 'bottomLeft',
            style: {
              background: 'var(--dropdown-bg)'
            }
          })
        } else {
          // Toast.show({
          //   content: (
          //     <div className="toast-container">
          //       {info?.title}：{content}
          //     </div>
          //   ),
          //   position: 'top',
          //   duration: 3000
          // })
          const fields = parseOrderMessage(info?.content || '')
          const symbolIcon = trade.symbolListAll.find((item) => item.symbol === fields.symbol)?.imgUrl
          Toast.show({
            content: (
              <div
                className="w-full flex items-center flex-col"
                onClick={() => {
                  Toast.clear()
                  push('/app/position')
                }}
              >
                <div className="flex items-center w-full justify-between px-[14px] py-[6px] bg-gray-50">
                  <div className="flex items-center">
                    <Iconfont size={18} name="chengjiaotongzhi" />
                    <span className="pl-1 text-primary text-xs font-pf-medium">
                      {getIntl().formatMessage({ id: 'mt.dingdanchengjiao' })}
                    </span>
                  </div>
                  <Iconfont size={18} name="anniu-gengduo" />
                </div>
                <div className="px-[14px] py-[10px] flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <img src={getSymbolIcon(symbolIcon)} width={20} height={20} alt="" className="rounded-full" />
                        <span className="text-primary font-semibold text-base pl-1">{fields.symbol}</span>
                      </div>
                      <span className={cn('text-base font-pf-medium pl-2', fields.tradeDirection === 'BUY' ? 'text-green' : 'text-red')}>
                        {fields.tradeDirection === 'BUY'
                          ? getIntl().formatMessage({ id: 'mt.mairu' })
                          : getIntl().formatMessage({ id: 'mt.maichu' })}{' '}
                        {/* @TODO 暂时没有杠杆支持 */}
                        {/* 20X */}
                      </span>
                    </div>
                    {/* @TODO 暂时没有保证金类型、订单类型 */}
                    {(fields.marginType || fields.orderType) && (
                      <div className="flex items-center pt-1">
                        <span className="text-primary text-xs">
                          {fields.marginType === 'CROSS_MARGIN'
                            ? getIntl().formatMessage({ id: 'mt.quancang' })
                            : getIntl().formatMessage({ id: 'mt.zhucang' })}
                        </span>
                        {fields.orderType && (
                          <>
                            <span className="mx-1 bg-gray-500 w-[1px] h-2"></span>
                            <span className="text-primary text-xs">{getEnum().Enum.OrderType[fields.orderType]?.text}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-primary text-base font-pf-medium">
                    {getIntl().formatMessage({ id: 'mt.chengjiao' })} {fields.tradeVolume}
                    {getIntl().formatMessage({ id: 'mt.lot' })}
                  </div>
                </div>
              </div>
            ),
            position: 'top',
            duration: 4000,
            maskClassName: 'webapp-custom-message'
          })
        }
        // 刷新消息列表
        stores.global.getUnreadMessageCount()
        // console.log('消息通知', data)
        break
      // 同步计算的结果返回
      case 'SYNC_CALCA_RES':
        stores.trade.accountBalanceInfo = data?.accountBalanceInfo
        stores.trade.positionListSymbolCalcInfo = data?.positionListSymbolCalcInfo
        stores.trade.rightWidgetSelectMarginInfo = data?.rightWidgetSelectMarginInfo
        stores.trade.expectedMargin = data?.expectedMargin
        stores.trade.maxOpenVolume = data?.maxOpenVolume
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
    this.subscribeMessage()
    this.subscribeTrade()

    if (isPCByWidth()) {
      this.batchSubscribeSymbol()
      this.subscribeDepth()
    }
  }

  // ========== 连接相关 end ===============

  // ============ 订阅相关 start ============
  setSendingSymbols = (symbolList: SymbolWSItem[], cancel: boolean) => {
    symbolList?.forEach((item) => {
      // 记录当前正在订阅的符号
      if (cancel) {
        this.sendingSymbols.delete(this.symbolToString(item))
      } else {
        this.sendingSymbols.set(this.symbolToString(item), true)
      }
    })
  }

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

    // 标记当前正在订阅的符号
    this.setSendingSymbols(symbolList, cancel)

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
    const symbolInfo = trade.getActiveSymbolInfo(trade.activeSymbolName, trade.symbolListAll)

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

  // ========== H5订阅相关 start ============
  // 工具方法：通过符号列表，生成成品符号列表
  makeWsSymbol = (symbols: string[], _accountGroupId?: string) => {
    const symbolList = trade.symbolListAll
    const symbolSemis = symbols.map((symbol) => ({
      symbol,
      dataSourceCode: symbolList.find((item) => item.symbol === symbol)?.dataSourceCode
    })) as SymbolWSItemSemi[]

    const accountGroupId = _accountGroupId || trade.currentAccountInfo.accountGroupId
    return symbolSemis.map((symbolSemi) => ({ ...symbolSemi, accountGroupId })) as SymbolWSItem[]
  }

  // 工具方法：通过半成品符号列表，生成成品符号列表
  makeWsSymbolBySemi = (symbolSemis: SymbolWSItemSemi[], _accountGroupId?: string) => {
    const accountGroupId = _accountGroupId || trade.currentAccountInfo.accountGroupId
    return symbolSemis.map((symbolSemi) => ({ ...symbolSemi, accountGroupId })) as SymbolWSItem[]
  }

  // 检查socket是否连接，如果未连接，则重新连接
  checkSocketReady = (fn?: () => void) => {
    if (this.socket?.readyState !== 1) {
      this.reconnect(fn)
    } else {
      fn?.()
    }
  }

  /** 符号转字符串(唯一识别) */
  symbolToString = (symbol: SymbolWSItem) => {
    return `${symbol.symbol}-${symbol.accountGroupId}-${symbol.dataSourceCode}`
  }

  stringToSymbol = (str: string) => {
    const [symbol, accountGroupId, dataSourceCode] = str.split('-')
    return {
      symbol: symbol === 'undefined' ? undefined : symbol,
      accountGroupId: accountGroupId === 'undefined' ? undefined : accountGroupId,
      dataSourceCode: dataSourceCode === 'undefined' ? undefined : dataSourceCode
    }
  }

  /** 打开行情订阅 */
  openSymbol = (symbols: SymbolWSItem[]) => {
    const toSend = new Map<string, boolean>()

    // 找到 symbols 中不在 [正在订阅列表] 中的符号
    symbols?.forEach((symbol) => {
      toSend.set(this.symbolToString(symbol), true)
    })

    if (toSend.size) {
      this.debounceBatchSubscribeSymbol(toSend)
    }
  }

  /** 打开交易订阅 */
  openTrade = (symbol: SymbolWSItem) => {
    this.openSymbol([symbol])
    this.subscribeDepth()
  }

  /** 注意：离开交易页或者切换品种时，请主动取消订阅 */
  closeTrade = () => {
    this.debounceBatchSubscribeSymbol()
    this.subscribeDepth(true)
  }

  /** 打开仓位订阅 */
  openPosition = (symbols: SymbolWSItem[]) => {
    this.openSymbol(symbols)
    this.subscribePosition()
  }

  /** 注意：离开仓位页面时，请主动取消订阅 */
  closePosition = (symbols?: SymbolWSItem[]) => {
    this.debounceBatchSubscribeSymbol()
    this.subscribePosition(true)
  }

  // 订阅持仓记录、挂单记录、账户余额信息
  subscribePosition = (cancel?: boolean) => {
    this.subscribeTrade(cancel)
  }

  /**
   * 延迟批量订阅行情
   * toSend 传入空对象或不传值，表示取消所有订阅
   */
  debounceBatchSubscribeSymbol = debounce((toSend?: Map<string, boolean>) => {
    // 1. 找到 this.toSendSymbols 中不在 this.sendingSymbols 中的符号，这些符号是即将要打开的符号
    const toOpen = new Map<string, boolean>()
    toSend?.forEach((value, key) => {
      if (!this.sendingSymbols.get(key)) {
        toOpen.set(key, true)
      }
    })

    // 2. 找到 this.sendingSymbols 中不在 this.toSendSymbols 中的符号，这些符号是即将要关闭的符号
    if (toSend?.size) {
      const toClose = new Map<string, boolean>()
      this.sendingSymbols.forEach((value, key) => {
        if (toSend?.get(key)) {
        } else {
          toClose.set(key, true)
        }
      })

      // 2.1 关闭即将要关闭的符号
      if (toClose.size) {
        // console.log('即将关闭的符号', toClose.size, toClose)
        const list2 = Array.from(toClose.keys()).map((key) => this.stringToSymbol(key)) as SymbolWSItem[]
        // console.log('即将关闭的符号', list2)
        this.debounceBatchCloseSymbol({ list: list2 })
      }
    }

    // 3. 打开即将要打开的符号
    const list = Array.from(toOpen.keys()).map((key) => this.stringToSymbol(key)) as SymbolWSItem[]
    // console.log('即将打开的符号', list)
    this.batchSubscribeSymbol({ list })
  }, 300)

  // 封装一个延迟执行的取消订阅方法
  debounceBatchCloseSymbol = debounce(
    ({
      list = []
    }: {
      list?: Array<SymbolWSItem>
      source?: string
    } = {}) => {
      // console.log(
      //   '即将关闭的符号',
      //   list.map((item) => this.symbolToString(item))
      // )
      this.batchSubscribeSymbol({ cancel: true, list })
    },
    3000
  )
  // ========== H5 订阅相关 end ============

  // 处理交易消息
  @action
  receiveTradeMessage = (data: any) => {
    // console.log('ws交易消息', data)
    const type = data.type as ITradeType
    // 账户余额变动
    if (type === 'ACCOUNT') {
      const accountInfo = data.account || {}
      trade.currentAccountInfo = {
        ...trade.currentAccountInfo,
        ...accountInfo
      }
    }
    // 持仓列表
    else if (type === 'MARKET_ORDER') {
      const positionList = data.bagOrderList || []
      trade.positionList = formaOrderList(positionList)
    }
    // 挂单列表
    else if (type === 'LIMIT_ORDER') {
      const pendingList = data.limiteOrderList || []
      trade.pendingList = formaOrderList(pendingList)
    }
    // 历史成交记录,用不到
    else if (type === 'TRADING') {
    }
  }
}

const ws = new WSStore()

export default ws
