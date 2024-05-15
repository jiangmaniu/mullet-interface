import { getIntl } from '@umijs/max'
import { message } from 'antd'
import { action, makeObservable, observable } from 'mobx'
import ReconnectingWebSocket from 'reconnecting-websocket'

import { URLS } from '@/constants'
import { STORAGE_GET_PWD, STORAGE_GET_USER_INFO } from '@/utils/storage'
import {
  AllSymbols,
  covertProfit,
  CurrencyLABELS,
  CurrencyType,
  formatQuotes,
  ILoginCmd,
  IOpenData,
  IPendingItem,
  IPriceInfo,
  IQuoteItem,
  ITrendingItem,
  IUserProp,
  MarketInfoProp,
  QuotesProp,
  SymbolProp
} from '@/utils/wsUtil'

class WSStore {
  constructor() {
    makeObservable(this) // 使用 makeObservable mobx6.0 才会更新视图
  }
  quotesTempArr: any = []
  batchTimer: any = null
  @observable loginCmd: ILoginCmd = { cmd: 10000, login: '', password: '', device: 1 }
  @observable socket: any = null
  @observable modal = 'dark'
  @observable socketState = 0 //ws状态，0未连接，1已连接
  @observable quotes = {} as QuotesProp // 当前行情
  @observable symbols = {} as SymbolProp // 品种信息
  @observable marketInfo = {} as MarketInfoProp // 高开收低数据
  @observable user = {} as IUserProp // 用户信息
  @observable tradeList: ITrendingItem[] = [] //持仓信息
  @observable pendingList: IPendingItem[] = [] //挂单信息
  @observable isRefresh = true
  @observable openTips = false
  @observable openData = {} as IOpenData
  @observable pengdingTips = false
  @observable heyueTips = false
  @observable lpTips = false
  @observable timer: any = null
  @observable userType = 0 // 0 真实 1模拟
  @observable editOrderTips = false
  @observable quoteList = AllSymbols
  @observable quoteList1 = formatQuotes().quoteList1
  @observable quoteList2 = formatQuotes().quoteList2
  @observable quoteList3 = formatQuotes().quoteList3
  @observable quoteList4 = formatQuotes().quoteList4
  @observable quoteName: CurrencyType = 'BTCUSDT'
  @observable quoteLabel = 'BTC/USDT'
  @observable label: Record<CurrencyType, string> = CurrencyLABELS // 货币类型
  @observable websocketUrl = URLS.ws.y
  @observable urls = [URLS.ws.y, URLS.ws.d, URLS.ws.r] //ws链接

  @action
  async connect() {
    // console.log(IuserInfo.pwd)
    const userInfo = STORAGE_GET_USER_INFO()
    // console.log('xxxx', userInfo)
    if (userInfo !== null) {
      if (this.userType === 0) {
        this.loginCmd.login = userInfo.realStandardAccount
        this.loginCmd.password = STORAGE_GET_PWD()
        this.websocketUrl = URLS.ws.d // 真实
      } else {
        this.websocketUrl = URLS.ws.r // 模拟
        this.loginCmd.login = userInfo.demoAccount
        this.loginCmd.password = STORAGE_GET_PWD()
      }
    } else {
      this.websocketUrl = URLS.ws.y // 游客
    }
    let urlIndex = 0
    // console.log('this.websocketUrl', this.websocketUrl)
    const urlProvider = () => {
      // 连接
      const url = Array.isArray(this.websocketUrl) ? this.websocketUrl[urlIndex++ % this.websocketUrl.length] : this.websocketUrl
      return url
    }
    // console.log('yyy', this.websocketUrl)
    this.socket = new ReconnectingWebSocket(urlProvider, [], {
      minReconnectionDelay: 1,
      connectionTimeout: 5000, // 重连时间
      maxEnqueuedMessages: 0 // 不缓存发送失败的指令
    })
    this.socket.addEventListener('open', () => {
      // console.log('xxxxx')
      const list = this.quoteList //获取品种信息
      if (STORAGE_GET_PWD()) {
        this.send(this.loginCmd) // 默认先登录
      }
      let getSymbol = {}
      let getSymbolVerb = {}
      let getquotes = {}
      list.map((item, i) => {
        getSymbol = { cmd: 10001, sbl: item.name }
        getSymbolVerb = { cmd: 10003, sbl: item.name }
        getquotes = { cmd: 10007, sbl: item.name }
        this.send(getSymbol) //获取品种信息
        this.send(getSymbolVerb) //获取高开低收
        this.send(getquotes) //获取最新报价
      })
      this.socketState = 1
    })
    this.socket.addEventListener('message', (d: any) => {
      // console.log(d)
      let res = JSON.parse(d.data)
      // console.log('res===', res)
      // this.option.message && this.option.message(res); // 保存相关信息
      this.message(res)
      // DeviceEventEmitter.emit('WS_MESSAGE', res) // 派发订阅事件
      // return true;
    })
  }
  @action
  send(cmd = {}) {
    // 发送socket指令
    // console.log('发送', cmd)
    const readyState = (this.socket && this.socket.readyState) || 0
    if (this.socket && readyState === 1) {
      // console.log(cmd)
      this.socket.send(JSON.stringify(cmd))
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
    this.quotes = {} as QuotesProp // 当前行情
    this.symbols = {} as SymbolProp // 品种信息
    this.tradeList = [] // 持仓信息
    this.user = {} as IUserProp // 用户信息
    this.socketState = 0
    this.pendingList = []
    this.quotesTempArr = []
  }
  // 更新react组件数据
  @action
  message(data: any) {
    // console.log(data)
    // const lang = lan.getlang().trade
    const getuser = { cmd: 10005 } //发送获取用户信息
    const getPosition = { cmd: 10011 } //发送获取持仓
    const getPending = { cmd: 10021 } //获取挂单列表
    const symbol = data.sbl as CurrencyType
    if (data.status !== 0 && (data.cmd === 10032 || data.cmd === 10036 || data.cmd === 10038 || data.cmd === 10034)) {
      // message.destroy()
      if (data.status === -12 || data.status === -13 || data.status === -14) {
        message.error(getIntl().formatMessage({ id: 'ws.fuwuqifangmangqingshaohou' }))
      } else if (data.status === 12) {
        message.error(getIntl().formatMessage({ id: 'ws.qingqiupinlvtaikuai' }))
      } else if (data.status === 10013) {
        message.error(getIntl().formatMessage({ id: 'ws.wuxiaoqingqiu' }))
      } else if (data.status === 10015) {
        message.error(getIntl().formatMessage({ id: 'ws.wuxiaodeguadanijage' }))
      } else if (data.status === 10020 || data.status === 10021) {
        message.error(getIntl().formatMessage({ id: 'ws.fuwuqifangmangqingshaohou2' }))
      } else if (data.status === 10033) {
        message.error(getIntl().formatMessage({ id: 'ws.plosssettingerror' }))
      } else if (data.status === 10019) {
        message.error(getIntl().formatMessage({ id: 'ws.yuebuzu' }))
      } else {
        message.error(data.msg || data.message)
      }
    }
    switch (data.cmd) {
      case 9999:
        //登录成功
        // console.log('登录成功',data.cmd)
        // const res = {"cmd": 10011}
        if (this.timer !== null) {
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.send({ cmd: 8888 })
          }, 30000)
        } else {
          this.timer = setInterval(() => {
            this.send({ cmd: 8888 })
          }, 30000)
        }
        const list = this.quoteList //获取品种信息
        this.send(getuser)
        this.send(getPosition)
        let getSymbol = {}
        let getSymbolVerb = {}
        let getquotes = {}
        list.map((item, i) => {
          getSymbol = { cmd: 10001, sbl: item.name }
          getSymbolVerb = { cmd: 10003, sbl: item.name }
          getquotes = { cmd: 10007, sbl: item.name }
          this.send(getSymbol) //获取品种信息
          this.send(getSymbolVerb) //获取高开低收
          this.send(getquotes) //获取最新报价
        })
        // const res = {"cmd": 10033,'ticket': }
        // this.send(res)
        break
      case 9998:
        message.warning(getIntl().formatMessage({ id: 'ws.marketclose' }))
        break
      case 10002:
        //获取品种信息
        // console.log(SymbolsArr[5])
        this.symbols[symbol] = data
        // console.log('品种信息', data)
        break
      case 10004:
        //获取商品统计信息
        // console.log('获取商品统计信息',data)
        this.marketInfo[symbol] = data
        break
      case 10006:
        //获取用户信息
        // console.log('获取用户信息',data)
        this.user = data
        break
      case 10008: // 收市报价、报价数据
      case 51001:
        // 限制更新频率，只有行情数据是高频更新的
        if (this.quotesTempArr.length > 40) {
          const quotes = this.quotes // 之前的值

          // 一次性更新，避免页面卡顿的关键
          let quotesObj: any = {}
          this.quotesTempArr.forEach((item: IQuoteItem) => {
            const sbl = item.sbl
            if (quotes[sbl]) {
              const prevBid = quotes[sbl]?.bid || 0
              const prevAsk = quotes[sbl]?.ask || 0
              item.bidDiff = item.bid - prevBid
              item.askDiff = item.ask - prevAsk
            }
            quotesObj[sbl] = item
          })
          this.quotes = {
            ...this.quotes,
            ...quotesObj
          }
          this.quotesTempArr = []
        } else {
          this.quotesTempArr.push(data)
        }
        break
      case 10012:
        // 更新持仓信息
        // console.log('更新持仓信息', data)
        this.tradeList = data.data
        break
      case 10022:
        // 更新挂单信息
        // console.log('更新挂单信息',data)
        this.pendingList = data.data
        break
      case 10030:
        // this.send(getuser)
        this.send(getPosition)
        this.send(getPending)
        // console.log('通知',data)
        break

      case 10032:
        // 交易是否成功
        // console.log('交易是否成功', data)
        if (data.status === 0) {
          this.openTips = true
          this.openData = data
          // const getuser = {"cmd": 10005} //发送获取用户信息
          // this.send(getuser)
          if (data.closed) {
            //平仓
            this.openData = data
            // const getPosition = {"cmd": 10011} //发送获取持仓
            setTimeout(() => {
              this.send(getPosition)
            }, 1000)
          } else {
            if (data.type === 0 || data.type === 1) {
              // const getPosition = {"cmd": 10011} //发送获取持仓
              setTimeout(() => {
                this.send(getPosition)
              }, 1000)
            } else {
              // const getPending = {"cmd": 10021}//发送获取挂单指令
              setTimeout(() => {
                this.send(getPending)
              }, 1000)
            }
          }
        }
        // console.log('交易是否成功',data)
        break
      case 10034:
        // console.log('挂单删除成功',data)
        if (data.status === 0) {
          message.success(getIntl().formatMessage({ id: 'ws.chexiaochenggong' }))
          setTimeout(() => {
            // const res = {"cmd": 10021}
            this.send(getPending)
          }, 1000)
        }
        break
      case 10036:
        //
        // console.log('修改挂单',data)
        if (data.status === 0) {
          message.success(getIntl().formatMessage({ id: 'ws.modifySuccess' }))
          setTimeout(() => {
            this.editOrderTips = false
            this.send(getPending)
          }, 1000)
        }
        break
      case 10038:
        //
        // console.log('修改止盈止损',data)
        if (data.status === 0) {
          message.success(getIntl().formatMessage({ id: 'ws.modifySuccess' }))
          // getIntl
          setTimeout(() => {
            this.lpTips = false
            // const getPosition = {"cmd": 10011}
            this.send(getPosition)
          }, 1000)
        }
        break
      // case 51002:

      //     // console.log('深度报价',data)
      //     // const list = SymbolsArr[5] //获取品种信息
      //     list.map((item,i) => {
      //       if(item.name == data.sbl) {
      //         this.deepQuotes[item.name] = data.items
      //       }
      //     })
      //     break;
      case 403:
        // console.log('403')
        // 服务器断开，调重连
        // this.close()
        // this.connect()
        // window.sessionStorage.clear()
        // setTimeout(() => {
        //   window.location.reload()
        // }, 500)
        // toast.show(lang['连接已断开，如需重连，请刷新页面（请勿同时打开多个交易窗口）'])
        // clearInterval(ii)
        // this.reconnect()
        // window.location.reload()
        break
      case 404:
        message.error(getIntl().formatMessage({ id: 'ws.distconnectTips' }))
        // clearInterval(ii)
        this.close()
        // this.reconnect()
        console.log('404')
        break
      case 406:
        //密码错误
        close()
        // clearInterval(this.timer)
        // window.localStorage.clear()
        // message.error(getIntl().formatMessage({ id: 'ws.pwdChangePleaseReLogin' }))
        // setTimeout(() => {
        //   history.push('/user/login')
        // }, 1000)
        break
    }
  }
  getPrice = () => {
    const { tradeList, quotes, symbols, user } = this
    const res: IPriceInfo = {
      balance: 0, //账户净值
      profit: 0, //浮动盈亏
      margin: 0, //可用保证金
      occupy: 0 // 占用金
    }
    if (!quotes || !symbols || !user || !tradeList) return

    if (tradeList?.length) {
      tradeList.map((item: ITrendingItem, index: number) => {
        if (!quotes[item.symbol]) return
        let profit: any = covertProfit(quotes, symbols, item)
        res.profit += profit
      })
    }
    // console.log('user',res.profit)
    res.balance = Number((user && user.balance ? res.profit + user.balance : 0).toFixed(2)) // 账户净值 = 余额 + 浮动盈亏 + 信用额
    res.occupy = user.margin
    res.margin = res.balance - res.occupy // 可用保证金 = 账户净值 - 占用保证金
    return res
  }
}

const ws = new WSStore()

export default ws
