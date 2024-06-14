import { action, makeObservable, observable, toJS } from 'mobx'
import ReconnectingWebSocket from 'reconnecting-websocket'

import { URLS } from '@/constants'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO } from '@/utils/storage'

import trade from './trade'

export type IQuoteItem = {
  /**品种名称 */
  symbol: string
  /**价格数据 */
  priceData: {
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
  /**数据源code 例如huobi */
  dataSource: string
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
  depth = 'depth'
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

class WSStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  @observable socket: any = null
  @observable quotes = {} as Record<string, IQuoteItem> // 当前行情
  @observable depth = {} as Record<string, IDepth> // 当前行情
  @observable symbols = {} // 储存品种请求列表
  @observable websocketUrl = URLS.ws

  @action
  async connect() {
    const token = STORAGE_GET_TOKEN()
    // token不要传bear前缀
    // 游客传WebSocket:visitor
    this.socket = new ReconnectingWebSocket(this.websocketUrl, ['WebSocket', token ? token : 'visitor'], {
      minReconnectionDelay: 1,
      connectionTimeout: 5000, // 重连时间
      maxEnqueuedMessages: 0, // 不缓存发送失败的指令
      maxRetries: 50, // 最大重连次数
      debug: process.env.NODE_ENV === 'development' // 测试环境打开调试
    })
    this.socket.addEventListener('open', () => {
      this.batchSubscribeSymbol()
      this.subscribeDepth()
    })
    this.socket.addEventListener('message', (d: any) => {
      const res = JSON.parse(d.data)
      this.message(res)
    })
  }
  // 批量订阅行情(查询symbol列表后)
  batchSubscribeSymbol = (cancel?: boolean) => {
    const symbolList = trade.symbolList
    if (!symbolList.length) return
    symbolList.forEach((item) => {
      this.send({
        topic: `/000000/${item.dataSourceCode}/symbol/${item.dataSourceSymbol}`,
        cancel
      })
    })
  }
  // 订阅当前打开的品种深度报价
  subscribeDepth = (cancel?: boolean) => {
    const symbolInfo = trade.getActiveSymbolInfo()
    if (!symbolInfo?.dataSourceCode) return

    setTimeout(() => {
      this.send({
        topic: `/000000/${symbolInfo.dataSourceCode}/depth/${symbolInfo.dataSourceSymbol}`,
        cancel
      })
    }, 300)
  }

  // 发送socket指令
  @action
  send(cmd = {}) {
    const userInfo = STORAGE_GET_USER_INFO() as User.UserInfo
    // 游客身份userId传123456789
    const userId = userInfo?.user_id || '123456789'
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          header: { tenantId: '000000', userId, msgId: 'subscribe', flowId: Date.now() },
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
    if (this.socket) this.socket.close()
  }
  @action
  reconnect() {
    // 中断连接再重连
    // console.log(store.account+store.pwd)
    this.close()
    this.resetData()
    // 重新连接
    this.connect()
  }
  @action
  resetData() {
    // @ts-ignore
    this.quotes = {} // 当前行情
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
        if (symbol) {
          this.quotes[symbol] = data
        }
        break
      // 深度报价
      case MessageType.depth:
        if (symbol) {
          const asks = data.asks ? JSON.parse(data.asks) : []
          const bids = data.bids ? JSON.parse(data.bids) : []
          this.depth[symbol] = {
            ...data,
            asks,
            bids
          }
        }
        console.log('深度报价', toJS(this.depth))
        break
    }
  }
}

const ws = new WSStore()

export default ws
