import { action, configure, makeObservable, observable, runInAction } from 'mobx'
import ReconnectingWebSocket from 'reconnecting-websocket'

import ENV from '@/env'
import { formaOrderList } from '@/services/api/tradeCore/order'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'
import { getCurrentQuote } from '@/utils/wsUtil'

import klineStore from './kline'
import trade from './trade'

export type IQuotePriceItem = {
  /**卖交易量 */
  sellSize: number
  /**买 */
  buy: number
  /**卖 */
  sell: number
  /**这个是时间戳13位 */
  id: number
  /*买交易量 */
  buySize: number
}
export type IQuoteItem = {
  /**品种名称（后台创建品种，自定义填写的品种名称，唯一）通过账户组订阅的品种行情才会有symbol */
  symbol: string
  /**账户组id */
  accountGroupId?: string
  /**价格数据 */
  priceData: IQuotePriceItem
  /**数据源code+数据源品种 例如huobi-btcusdt */
  dataSource: string
  /**前端计算的 卖价 上一口报价和下一口报价对比 */
  bidDiff?: number
  /**前端计算的 买价 上一口报价和下一口报价对比 */
  askDiff?: number
}

export type IDepthPriceItem = {
  amount: number
  price: number
}
export type IDepth = {
  /**品种名称（后台创建品种，自定义填写的品种名称，唯一）通过账户组订阅的品种行情才会有symbol */
  symbol: string
  /**数据源code+数据源品种 例如huobi-btcusdt */
  dataSource: string
  asks: IDepthPriceItem[]
  bids: IDepthPriceItem[]
  /**13位时间戳 */
  ts?: number
}

enum MessageType {
  /**行情 */
  symbol = 'symbol',
  /**深度报价 */
  depth = 'depth',
  /**行情 */
  trade = 'trade'
}
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

class WSStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  batchQuoteTimer: any = null // 定时更新行情
  batchDepthTimer: any = null // 定时更新深度
  heartbeatInterval: any = null
  heartbeatTimeout = 20000 // 心跳间隔，单位毫秒
  quotesCacheArr: any = [] // 行情缓存区
  depthCacheArr: any = [] // 深度缓存区
  @observable socket: any = null
  @observable quotes = {} as Record<string, IQuoteItem> // 当前行情
  @observable depth = {} as Record<string, IDepth> // 当前行情
  @observable symbols = {} // 储存品种请求列表
  @observable websocketUrl = ENV.ws

  @observable isQuotePushing = true // 判断行情是否一直实时在推送
  QUOTE_PUSH_TIMEOUT = 5000 // 行情推送5秒超时
  quotePushTimer: NodeJS.Timeout | null = null // 行情推送定时器
  lastQuotePushTime = 0 // 行情最后推送时间

  // ====================== 检查行情开始 ========================================
  // 开始检查行情推送状态
  startQuotePushCheck() {
    if (this.quotePushTimer) clearInterval(this.quotePushTimer)
    this.quotePushTimer = setInterval(() => {
      this.checkQuotePushStatus()
    }, 1000) // 每秒检查一次
  }
  // 检查行情推送状态
  checkQuotePushStatus() {
    const lastPushTime = this.lastQuotePushTime || 0
    const currentTime = Date.now()
    if (currentTime - lastPushTime > this.QUOTE_PUSH_TIMEOUT) {
      runInAction(() => {
        this.isQuotePushing = false
      })
    }
  }
  // 更新最后一次行情推送时间
  updateLastQuotePushTime() {
    this.lastQuotePushTime = Date.now()
    runInAction(() => {
      this.isQuotePushing = true
    })
  }
  // ====================== 检查行情结束 ========================================

  @action
  async connect() {
    this.startQuotePushCheck()

    const token = STORAGE_GET_TOKEN()
    // token不要传bear前缀
    // 游客传WebSocket:visitor
    this.socket = new ReconnectingWebSocket(this.websocketUrl, ['WebSocket', token ? token : 'visitor'], {
      minReconnectionDelay: 1,
      connectionTimeout: 3000, // 重连时间
      maxEnqueuedMessages: 0, // 不缓存发送失败的指令
      maxRetries: 10000000 // 最大重连次数
      // debug: process.env.NODE_ENV === 'development' // 测试环境打开调试
    })
    this.socket.addEventListener('open', () => {
      this.batchSubscribeSymbol()
      this.subscribeDepth()
      this.subscribeTrade()
      this.startHeartbeat()

      // 开启定时器推送数据
      this.batchUpdateQuoteDataByTimer() // 更新行情
      this.batchUpdateDepthDataByTimer() // 更新深度
    })
    this.socket.addEventListener('message', (d: any) => {
      const res = JSON.parse(d.data)
      this.message(res)
    })
    this.socket.addEventListener('close', () => {})
    this.socket.addEventListener('error', () => {})
  }

  // 开始心跳
  startHeartbeat() {
    if (!STORAGE_GET_TOKEN()) return
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      this.send({}, { msgId: 'heartbeat' })
    }, this.heartbeatTimeout)
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
    const symbolInfo = trade.getActiveSymbolInfo()
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
    // 关闭socket指令
    this.socket?.close?.()
    this.stopHeartbeat()

    if (this.quotePushTimer) {
      clearInterval(this.quotePushTimer)
      this.quotePushTimer = null
      runInAction(() => {
        this.isQuotePushing = true
      })
    }
  }

  @action
  reconnect() {
    // 中断连接再重连
    // console.log(store.account+store.pwd)
    this.close()
    // this.resetData()
    // 重新连接
    setTimeout(() => {
      this.connect()
    }, 1000)
  }
  @action
  resetData() {
    // @ts-ignore
    this.quotes = {} // 当前行情
    this.depth = {}
    this.quotesCacheArr = []
    this.depthCacheArr = []
  }

  // ================ 更新行情数据 开始 ================
  @action
  updateQuoteData = () => {
    if (this.quotesCacheArr.length) {
      const quotes = this.quotes // 之前的值
      const quotesObj: any = {} // 一次性更新，避免卡顿
      this.quotesCacheArr.forEach((item: IQuoteItem) => {
        const [dataSourceCode, dataSourceSymbol] = (item.dataSource || '').split('-').filter((v) => v)
        const sbl = item.symbol || dataSourceSymbol // 如果有symbol，说明是通过账户组订阅的品种行情
        const dataSourceKey = `${dataSourceCode}/${sbl}` // 数据源 + 品种名称
        if (quotes[dataSourceKey]) {
          const prevSell = quotes[dataSourceKey]?.priceData?.sell || 0
          const prevBuy = quotes[dataSourceKey]?.priceData?.buy || 0
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

        if (sbl) {
          // 数据源-品种拼接，避免被覆盖
          quotesObj[dataSourceKey] = item
        }
      })

      const newQuotes = {
        ...this.quotes,
        ...quotesObj
      }

      // 实时更新k线数据
      klineStore.updateKlineData(newQuotes)

      runInAction(() => {
        this.quotes = newQuotes
      })

      this.quotesCacheArr = []
    }
  }

  // 定时更新行情数据
  @action
  batchUpdateQuoteDataByTimer = () => {
    if (this.batchQuoteTimer) {
      clearInterval(this.batchQuoteTimer)
    }
    this.batchQuoteTimer = setInterval(() => {
      // 更新行情
      this.updateQuoteData()
    }, 300)
  }

  // 批量更新行情数据，通过指定数量
  @action
  batchUpdateQuoteDataByNumber = (data: any) => {
    if (this.quotesCacheArr.length > 12) {
      this.updateQuoteData()
    } else {
      this.quotesCacheArr.push(data)
    }
  }

  // ================ 更新行情数据 结束 ================

  // ================ 更新深度 开始 ================
  @action
  updateDepthData = () => {
    if (this.depthCacheArr.length) {
      const depthObj: any = {} // 一次性更新，避免卡顿
      this.depthCacheArr.forEach((item: IDepth) => {
        const [dataSourceCode, dataSourceSymbol] = (item.dataSource || '').split('-').filter((v) => v)
        const sbl = item.symbol || dataSourceSymbol // 如果有symbol，说明是通过账户组订阅的品种行情
        const dataSourceKey = `${dataSourceCode}/${sbl}` // 数据源 + 品种名称
        if (sbl) {
          if (typeof item.asks === 'string') {
            item.asks = item.asks ? JSON.parse(item.asks) : []
          }
          if (typeof item.bids === 'string') {
            item.bids = item.bids ? JSON.parse(item.bids) : []
          }
          // 数据源-品种拼接，避免被覆盖
          depthObj[dataSourceKey] = item
        }
      })

      runInAction(() => {
        this.depth = {
          ...this.depth,
          ...depthObj
        }
      })

      this.depthCacheArr = []
    }
  }

  // 批量更新深度数据，通过指定数量
  @action
  batchUpdateDepthDataByNumber = (data: any) => {
    // 限流
    if (this.depthCacheArr.length > 2) {
      this.updateDepthData()
    } else {
      this.depthCacheArr.push(data)
    }
  }

  // 定时更新深度数据
  @action
  batchUpdateDepthDataByTimer = () => {
    if (this.batchDepthTimer) {
      clearInterval(this.batchDepthTimer)
    }
    this.batchDepthTimer = setInterval(() => {
      // 更新深度
      this.updateDepthData()
    }, 100)
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
        // this.batchUpdateQuoteDataByNumber(data)
        // 更新最后一次行情推送时间
        this.updateLastQuotePushTime()

        // 推入缓冲区
        this.quotesCacheArr.push(data)

        // console.log('行情信息', toJS(this.quotes))
        break
      // 深度报价
      case MessageType.depth:
        // if (symbol) {
        //   const asks = data.asks ? JSON.parse(data.asks) : []
        //   const bids = data.bids ? JSON.parse(data.bids) : []
        //   this.depth[symbol] = {
        //     ...data,
        //     asks,
        //     bids
        //   }
        // }

        // this.batchUpdateDepthDataByNumber(data)

        // 推入缓冲区
        this.depthCacheArr.push(data)

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
    }
  }
}

const ws = new WSStore()

export default ws
