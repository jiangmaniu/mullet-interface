import { action, configure, makeObservable, observable } from 'mobx'
import ReconnectingWebSocket from 'reconnecting-websocket'

import { formaOrderList } from '@/services/api/tradeCore/order'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import { getCurrentQuote } from '@/utils/wsUtil'

import { getEnv } from '@/env'
import trade from './trade'
import { IDepth, IQuoteItem, MessageType } from './ws.types'

type IMessage = {
  header: {
    flowId: number
    /**消息类型 */
    msgId: MessageType
    tenantId: string
    /**用户ID */
    userId: string
  }
  body: any
}

type ITradeType =
  /** 限价单下单 */
  | 'LIMIT_ORDER'
  /**订单变更 */
  | 'ORDER'
  /**账户变更 */
  | 'ACCOUNT'
  /**成交记录 */
  | 'TRADING'

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

const THROTTLE_QUOTE_INTERVAL = 2200
const THROTTLE_DEPTH_INTERVAL = 600
const MAX_CACHE_SIZE = 400 // 设置最大缓存限制

class WSStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  updateLastQuoteTimer: any = null // 延迟更新最后一口报价
  updateLastDepthTimer: any = null // 延迟更新最后一口深度
  batchQuoteTimer: any = null // 定时更新行情
  batchDepthTimer: any = null // 定时更新深度
  heartbeatInterval: any = null
  heartbeatTimeout = 20000 // 心跳间隔，单位毫秒
  quotesCache = new Map<string, IQuoteItem>() // 行情缓存区
  depthCache = new Map<string, IDepth>() // 深度缓存区
  @observable socket: any = null
  @observable quotes = new Map<string, IQuoteItem>() // 当前行情
  @observable depth = new Map<string, IDepth>() // 当前深度
  @observable symbols = {} // 储存品种请求列表
  lastQuoteUpdateTime = 0
  lastDepthUpdateTime = 0

  @action
  async connect() {
    const ENV = getEnv()
    const token = STORAGE_GET_TOKEN()
    const websocketUrl = ENV.ws as string
    // token不要传bear前缀
    // 游客传WebSocket:visitor
    this.socket = new ReconnectingWebSocket(websocketUrl, ['WebSocket', token ? token : 'visitor'], {
      minReconnectionDelay: 1,
      connectionTimeout: 3000, // 重连时间
      maxEnqueuedMessages: 0, // 不缓存发送失败的指令
      maxRetries: 10000000 // 最大重连次数
      // debug: process.env.NODE_ENV === 'development' // 测试环境打开调试
    })
    this.socket.addEventListener('open', this.handleOpenCallback)
    this.socket.addEventListener('message', this.handleMessageCallback)
    // this.socket.addEventListener('close', () => {})
    // this.socket.addEventListener('error', () => {})
  }

  handleOpenCallback = () => {
    this.batchSubscribeSymbol()
    this.subscribeDepth()
    this.subscribeTrade()
    this.subscribeMessage()
    this.startHeartbeat()
  }

  handleMessageCallback = (d: any) => {
    const res = JSON.parse(d.data)
    this.message(res)
  }

  // 开始心跳
  startHeartbeat() {
    if (!STORAGE_GET_TOKEN()) return
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(this.startHeartbeatCallback, this.heartbeatTimeout)
  }

  startHeartbeatCallback = () => {
    this.send({}, { msgId: 'heartbeat' })
  }

  // 停止心跳
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
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
    const symbolList = list?.length ? list : trade.symbolList
    if (!symbolList.length) return
    symbolList.forEach((item) => {
      const topicNoAccount = `/000000/symbol/${item.dataSourceCode}/${item.symbol}`
      const topicAccount = `/000000/symbol/${item.symbol}/${item.accountGroupId}`
      // 如果有账户id，订阅该账户组下的行情，此时行情会加上点差
      const topic = item.accountGroupId ? topicAccount : topicNoAccount
      this.send({
        topic,
        cancel
      })
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

    const topicNoAccount = `/000000/depth/${symbolInfo.dataSourceCode}/${symbolInfo.symbol}`
    const topicAccount = `/000000/depth/${symbolInfo.symbol}/${symbolInfo?.accountGroupId}`
    // 区分带账户组id和不带账户组情况
    const topic = symbolInfo?.accountGroupId ? topicAccount : topicNoAccount

    setTimeout(() => {
      this.send({
        topic,
        cancel
      })
    }, 300)
  }
  // 订阅持仓记录、挂单记录、账户余额信息
  subscribeTrade = (cancel?: boolean) => {
    const currentAccountInfo = trade.currentAccountInfo
    const accountId = currentAccountInfo?.id
    if (!accountId) return
    this.send({
      topic: `/000000/trade/${accountId}`,
      cancel
    })
  }

  // 订阅消息
  subscribeMessage = async (cancel?: boolean) => {
    const userInfo = (await STORAGE_GET_USER_INFO()) as User.UserInfo
    if (!userInfo?.user_id) return

    // 公共订阅：/{租户ID}/public/1
    // 角色订阅：/{租户ID}/role/{角色ID}
    // 机构订阅：/{租户ID}/dept/{机构ID}
    // 岗位订阅：/{租户ID}/post/{岗位ID}
    // 用户订阅：/{租户ID}/user/{用户ID}
    this.send({
      topic: `/000000/public/1`,
      cancel
    })
    this.send({
      topic: `/000000/role/${userInfo.role_id}`,
      cancel
    })
    this.send({
      topic: `/000000/dept/${userInfo.dept_id}`,
      cancel
    })
    this.send({
      topic: `/000000/post/${userInfo.post_id}`,
      cancel
    })
    this.send({
      topic: `/000000/user/${userInfo?.user_id}`,
      cancel
    })
  }

  // 发送socket指令
  @action
  send(cmd = {}, header = {}) {
    const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
    // 游客身份userId传123456789
    const userId = userInfo?.user_id || '123456789'
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(
        JSON.stringify({
          header: { tenantId: '000000', userId, msgId: 'subscribe', flowId: Date.now(), ...header },
          body: {
            cancel: false,
            ...cmd
          }
        })
      )
    }
  }
  @action
  close = () => {
    this.stopHeartbeat()
    if (this.socket) {
      // 关闭socket指令
      this.socket.close?.()
    }
    this.quotesCache.clear()
    this.depthCache.clear()
  }

  @action
  reconnect() {
    // 中断连接再重连
    // console.log(store.account+store.pwd)
    this.close()
    // 重新连接
    setTimeout(() => {
      this.connect()
    }, 1000)
  }

  // ================ 更新行情数据 开始 ================
  @action
  updateQuoteData = () => {
    if (this.quotesCache.size) {
      this.quotesCache.forEach((item: IQuoteItem, dataSourceKey) => {
        const quoteData = this.quotes.get(dataSourceKey)
        if (quoteData) {
          const prevSell = quoteData?.priceData?.sell || 0
          const prevBuy = quoteData?.priceData?.buy || 0
          const buy = item.priceData?.buy
          const sell = item.priceData?.sell
          const flag = buy && sell // 买卖都存在，才跳动
          item.bidDiff = flag ? buy - prevBuy : 0 // bid使用买盘的
          item.askDiff = flag ? sell - prevSell : 0 // ask使用卖盘的

          if (item.priceData) {
            // 如果没有最新报价，获取上一口报价
            item.priceData.buy = item.priceData.buy || prevBuy
            item.priceData.sell = item.priceData.sell || prevSell
          }
        }

        if (dataSourceKey) {
          this.quotes.set(dataSourceKey, item)
        }
      })

      this.quotesCache.clear()
      this.lastQuoteUpdateTime = performance.now()
    }
  }

  // 批量更新行情数据，通过指定数量
  @action
  batchUpdateQuoteDataByNumber = (data: any) => {
    // if (this.quotesCacheArr.length > 10) {
    //   this.updateQuoteData()
    // } else {
    //   this.quotesCacheArr.push(data)

    //   // 处理最后一口报价问题，设置一个短暂的延迟，确保即使数据量不足也能更新
    //   if (!this.updateLastQuoteTimer && this.quotesCacheArr.length) {
    //     this.updateLastQuoteTimer = setTimeout(() => {
    //       this.updateQuoteData()
    //       // this.updateLastQuoteTimer = null
    //     }, 200)
    //   }
    // }
    const [dataSourceCode, dataSourceSymbol] = (data.dataSource || '').split('-').filter((v: any) => v)
    const sbl = data.symbol || dataSourceSymbol // 如果有symbol，说明是通过账户组订阅的品种行情
    const dataSourceKey = `${dataSourceCode}/${sbl}` // 数据源 + 品种名称
    this.quotesCache.set(dataSourceKey, data)

    // 如果缓存太大，强制发送
    if (this.quotesCache.size >= MAX_CACHE_SIZE) {
      this.updateQuoteData()
      return
    }

    const now = performance.now()
    if (now - this.lastQuoteUpdateTime >= THROTTLE_QUOTE_INTERVAL) {
      if (this.quotesCache.size > 0) {
        this.updateQuoteData()
      }
    }
  }

  // ================ 更新行情数据 结束 ================

  // ================ 更新深度 开始 ================
  @action
  updateDepthData = () => {
    if (this.depthCache.size) {
      this.depthCache.forEach((item: IDepth, dataSourceKey) => {
        if (dataSourceKey) {
          if (typeof item.asks === 'string') {
            item.asks = item.asks ? JSON.parse(item.asks) : []
          }
          if (typeof item.bids === 'string') {
            item.bids = item.bids ? JSON.parse(item.bids) : []
          }
          this.depth.set(dataSourceKey, item)
        }
      })

      this.depthCache.clear()
      this.lastDepthUpdateTime = performance.now()
    }
  }

  // 批量更新深度数据，通过指定数量
  @action
  batchUpdateDepthDataByNumber = (data: any) => {
    // if (this.depthCacheArr.length > 5) {
    //   this.updateDepthData()
    // } else {
    //   this.depthCacheArr.push(data)

    //   // 设置一个短暂的延迟，确保即使数据量不足也能更新
    //   if (!this.updateLastDepthTimer && this.depthCacheArr.length) {
    //     this.updateLastDepthTimer = setTimeout(() => {
    //       this.updateDepthData()
    //       // this.updateLastDepthTimer = null
    //     }, 200)
    //   }
    // }
    const [dataSourceCode, dataSourceSymbol] = (data.dataSource || '').split('-').filter((v: any) => v)
    const sbl = data.symbol || dataSourceSymbol // 如果有symbol，说明是通过账户组订阅的品种行情
    const dataSourceKey = `${dataSourceCode}/${sbl}` // 数据源 + 品种名称
    this.depthCache.set(dataSourceKey, data)

    // 如果缓存太大，强制发送
    if (this.depthCache.size >= MAX_CACHE_SIZE) {
      this.updateDepthData()
      return
    }

    const now = performance.now()
    if (now - this.lastDepthUpdateTime >= THROTTLE_DEPTH_INTERVAL) {
      if (this.depthCache.size > 0) {
        this.updateDepthData()
      }
    }
  }

  // ================ 更新深度 结束 ================

  // 处理ws消息
  @action
  message(res: IMessage) {
    const header = res?.header || {}
    const messageId = header.msgId
    const data = res?.body || {}
    const symbol = data?.symbol

    switch (messageId) {
      // 行情
      case MessageType.symbol:
        this.batchUpdateQuoteDataByNumber(data)

        // console.log('行情信息', toJS(this.quotes))
        break
      // 深度报价
      case MessageType.depth:
        this.batchUpdateDepthDataByNumber(data)

        // 推入缓冲区
        // this.depthCacheArr.push(data)

        // console.log('深度报价', toJS(this.depth))
        break
      // 交易信息：账户余额变动、持仓列表、挂单列表
      case MessageType.trade:
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
        break
      case MessageType.notice:
        console.log('消息通知', data)
        break
    }
  }
}

const ws = new WSStore()

export default ws
