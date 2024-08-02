import { action, configure, makeObservable, observable } from 'mobx'
import ReconnectingWebSocket from 'reconnecting-websocket'

import ENV from '@/env'
import { formaOrderList } from '@/services/api/tradeCore/order'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'

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
  /**品种名称 */
  symbol: string
  /**价格数据 */
  priceData: IQuotePriceItem
  /**数据源code 例如huobi */
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
  symbol: string
  dataSourceCode?: string
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
export type IReadyState =
  /**WebSocket 连接正在进行中 */
  | 'CONNECTING'
  /**WebSocket 连接已经建立并且可以进行通信 */
  | 'OPEN'
  /**WebSocket 连接正在关闭过程中。此时，客户端或服务器已经开始关闭连接，但连接还没有完全关闭，双方还可以继续发送和接收消息 */
  | 'CLOSEING'
  /**WebSocket 连接已经关闭，连接断开，无法再发送或接收消息 */
  | 'CLOSED'

// 禁用 MobX 严格模式
configure({ enforceActions: 'never' })

class WSStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  batchTimer: any = null
  heartbeatInterval: any = null
  heartbeatTimeout = 20000 // 心跳间隔，单位毫秒
  quotesCacheArr: any = [] // 行情缓存区
  depthCacheArr: any = [] // 深度缓存区
  @observable readyState: IReadyState = 'CONNECTING' // ws连接状态
  @observable socket: any = null
  @observable quotes = {} as Record<string, IQuoteItem> // 当前行情
  @observable depth = {} as Record<string, IDepth> // 当前行情
  @observable symbols = {} // 储存品种请求列表
  @observable websocketUrl = ENV.ws

  @action
  async connect() {
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
      this.readyState = 'OPEN'

      this.batchSubscribeSymbol()
      this.subscribeDepth()
      this.subscribeTrade()
      this.startHeartbeat()

      // 开启定时器推送数据
      this.batchUpdateDataByTimer()
    })
    this.socket.addEventListener('message', (d: any) => {
      const res = JSON.parse(d.data)
      this.message(res)
    })
    this.socket.addEventListener('close', () => {
      this.readyState = 'CLOSED'
    })
    this.socket.addEventListener('error', () => {
      this.readyState = 'CLOSED'
    })
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
  batchSubscribeSymbol = (cancel?: boolean) => {
    const symbolList = trade.symbolList
    if (!symbolList.length) return
    symbolList.forEach((item) => {
      this.send({
        topic: `/000000/${item.dataSourceCode}/symbol/${item.dataSourceSymbol}/${item.accountGroupId}`,
        cancel
      })
    })
  }
  // 订阅当前打开的品种深度报价
  subscribeDepth = (cancel?: boolean) => {
    const symbolInfo = trade.getActiveSymbolInfo()
    if (!symbolInfo?.dataSourceCode) return

    setTimeout(() => {
      // accountGroupId从交易品种列表获取
      this.send({
        topic: `/000000/${symbolInfo.dataSourceCode}/depth/${symbolInfo.dataSourceSymbol}/${symbolInfo.accountGroupId}`,
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
    if (this.socket) {
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
  close() {
    // 关闭socket指令
    if (this.socket) {
      this.socket.close()
      this.stopHeartbeat()
      this.readyState = 'CLOSED'
    }
  }
  @action
  reconnect() {
    // 中断连接再重连
    // console.log(store.account+store.pwd)
    this.close()
    // this.resetData()
    // 重新连接
    this.connect()
  }
  @action
  resetData() {
    // @ts-ignore
    this.quotes = {} // 当前行情
    this.depth = {}
    this.quotesCacheArr = []
    this.depthCacheArr = []
  }

  // 更新行情数据
  @action
  updateQuoteData = () => {
    if (this.quotesCacheArr.length) {
      const quotes = this.quotes // 之前的值
      const quotesObj: any = {} // 一次性更新，避免卡顿
      this.quotesCacheArr.forEach((item: IQuoteItem) => {
        const sbl = item.symbol
        const dataSourceCode = item.dataSource
        if (quotes[sbl]) {
          const prevBid = quotes[sbl]?.priceData?.sell || 0
          const prevAsk = quotes[sbl]?.priceData?.buy || 0
          item.bidDiff = item.priceData?.sell - prevBid
          item.askDiff = item.priceData?.buy - prevAsk

          if (item.priceData) {
            // 如果没有最新报价，获取上一口报价
            item.priceData.buy = item.priceData.buy || prevAsk
            item.priceData.sell = item.priceData.sell || prevBid
          }
        }

        if (sbl) {
          // 数据源-品种拼接，避免被覆盖
          quotesObj[`${dataSourceCode}/${sbl}`] = item
        }
      })

      const newQuotes = {
        ...this.quotes,
        ...quotesObj
      }

      // 实时更新k线数据
      klineStore.updateKlineData(newQuotes)

      this.quotes = newQuotes

      this.quotesCacheArr = []
    }
  }

  // 定时更新数据
  @action
  batchUpdateDataByTimer = () => {
    if (this.batchTimer) {
      clearInterval(this.batchTimer)
    }
    this.batchTimer = setInterval(() => {
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

  // 批量更新深度数据，通过指定数量
  @action
  batchUpdateDepthDataByNumber = (data: any) => {
    // 限流
    if (this.depthCacheArr.length > 2) {
      const depthObj: any = {} // 一次性更新，避免卡顿
      this.depthCacheArr.forEach((item: IDepth) => {
        const sbl = item.symbol
        const dataSourceCode = item.dataSourceCode
        if (sbl) {
          if (typeof item.asks === 'string') {
            item.asks = item.asks ? JSON.parse(item.asks) : []
          }
          if (typeof item.bids === 'string') {
            item.bids = item.bids ? JSON.parse(item.bids) : []
          }
          // 数据源-品种拼接，避免被覆盖
          depthObj[`${dataSourceCode}/${sbl}`] = item
        }
      })

      this.depth = {
        ...this.depth,
        ...depthObj
      }

      this.depthCacheArr = []
    } else {
      this.depthCacheArr.push(data)
    }
  }

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

        this.batchUpdateDepthDataByNumber(data)

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
