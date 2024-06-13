import { TRADE_BUY_SELL } from '@/constants/enum'
import useCurrentQuote from '@/hooks/useCurrentQuote'
import { IPositionItem } from '@/pages/web/trade/comp/TradeRecord/Position'

// 货币类型
export const CurrencyLABELS = {
  BTCUSDT: 'BTC/USDT',
  ETHUSDT: 'ETH/USDT',
  BCHUSDT: 'BCH/USDT',
  DOTUSDT: 'DOT/USDT',
  SOLUSDT: 'SOL/USDT',
  SANDUSDT: 'SAND/USDT',
  DOGEUSDT: 'DOGE/USDT',
  FILUSDT: 'FIL/USDT',
  ATOMUSDT: 'ATOM/USDT',
  AXSUSDT: 'AXS/USDT',
  ADAUSDT: 'ADA/USDT',
  LTCUSDT: 'LTC/USDT',
  AAVEUSDT: 'AAVE/USDT',
  UNIUSDT: 'UNI/USDT',
  USDCNH: 'USDCNH',
  GBPUSD: 'GBPUSD',
  USDCHF: 'USDCHF',
  EURUSD: 'EURUSD',
  AUDUSD: 'AUDUSD',
  USDJPY: 'USDJPY',
  NZDUSD: 'NZDUSD',
  USDCAD: 'USDCAD',
  AUDNZD: 'AUDNZD',
  EURJPY: 'EURJPY',
  NZDJPY: 'NZDJPY',
  AUDJPY: 'AUDJPY',
  CADJPY: 'CADJPY',
  EURAUD: 'EURAUD',
  EURCHF: 'EURCHF',
  EURGBP: 'EURGBP',
  GBPCHF: 'GBPCHF',
  GBPAUD: 'GBPAUD',
  GBPJPY: 'GBPJPY',
  USDHKD: 'USDHKD',
  US30: 'US30',
  US500: 'US500',
  GER30: 'GER30',
  HK50: 'HK50',
  NAS100: 'NAS100',
  JPN225: 'JPN225',
  CHINA300: 'CHINA300',
  CHA50: 'CHA50',
  GOLD: 'GOLD',
  SILVER: 'SILVER',
  UKOIL: 'UKOIL',
  USOIL: 'USOIL'
}

// 提取对象中的货币类型KEY
export type CurrencyType = keyof typeof CurrencyLABELS

export interface ILoginCmd {
  cmd?: number
  login?: string
  password?: string
  device?: number
}

export interface IQuoteItem {
  ask: number
  bid: number
  cmd: number
  digit: number
  sbl: CurrencyType
  utime: number
  bidDiff?: number
  askDiff?: number
}
export type QuotesProp = Record<CurrencyType, IQuoteItem>

interface ISession {
  close: number
  day: number
  open: number
  type: number
  close_h?: number
  close_m?: number
  open_h?: number
  open_m?: number
}

interface ISymbolCommonData {
  cur_base: string
  cur_digits: number
  cur_margin: string
  cur_margin_digits: number
  cur_profit: string
  cur_profit_digits: number
  digits: number
  margin_hedge: number
  margin_hold: number
  margin_hold_buy: number
  margin_hold_sell: number
  margin_init: number
  margin_init_buy: number
  margin_init_sell: number
  margin_rate_cur: number
  margin_rate_liq: number
  path: string
  pricemax: number
  pricemin: number
  vollimit: number
  volmax: number
  volmin: number
  volstep: number
  vstep: number
  swap_3day: number
  swap_long: number
  swap_mode: number
  swap_short: number
}
export interface ISymbolData extends ISymbolCommonData {
  sblid: number
  sessions: ISession[]
}

export interface ISymbolItem extends ISymbolCommonData {
  cmd: number
  consize: number
  data: ISymbolData
  el: number
  ep: number
  et: number
  exec: number
  freezl: number
  sbl: string
  spread: number
  stopl: number
  vmax: number
  vmin: number
}
export type SymbolProp = Record<CurrencyType, ISymbolItem>

export interface IMarketItem {
  askHigh: number
  askLow: number
  bidHigh: number
  bidLow: number
  cmd: number
  digits: number
  lastHigh: number
  lastLow: number
  priceClose: number
  priceOpen: number
  sbl: CurrencyType
  time: number
}

export type MarketInfoProp = Record<CurrencyType, IMarketItem>

export interface IUserProp {
  balance: number
  cmd: number
  equity: number
  margin: number
  marginfree: number
  status: number
}

export interface IOpenData {
  closed?: number
  vol: number
  type?: number
  order?: string
  profit: number
  price: number
  digits?: number
  storage: number
  commission: number
  tp: number
  sl: number
  sbl?: CurrencyType
}

export interface IPendingItem {
  digits: number
  expire: number
  login: number
  order: number
  price: number
  sl: number
  symbol: CurrencyType
  tp: number
  ttime: number
  type: number
  utime: number
  vol: number
}

export interface ITrendingItem {
  action: number
  digits: number
  login: number
  position: number
  price: number
  sl: number
  storage: number
  symbol: CurrencyType
  tp: number
  utime: number
  vol: number
}

export interface IPriceInfo {
  balance: number //账户净值
  profit: number //浮动盈亏
  margin: number //可用保证金
  occupy: number // 占用金
}

export interface IQuoteInfoProp {
  name: CurrencyType
  label: string
  isRecommend: boolean
  type?: number
}

export const AllSymbols: IQuoteInfoProp[] = [
  { name: 'BTCUSDT', label: 'BTC/USDT', isRecommend: true, type: 1 },
  { name: 'ETHUSDT', label: 'ETH/USDT', isRecommend: true, type: 1 },
  { name: 'DOTUSDT', label: 'DOT/USDT', isRecommend: true, type: 1 },
  { name: 'LTCUSDT', label: 'LTC/USDT', isRecommend: false, type: 1 },
  { name: 'BCHUSDT', label: 'BCH/USDT', isRecommend: true, type: 1 },
  { name: 'FILUSDT', label: 'FIL/USDT', isRecommend: true, type: 1 },
  { name: 'ADAUSDT', label: 'ADA/USDT', isRecommend: false, type: 1 },
  { name: 'DOGEUSDT', label: 'DOGE/USDT', isRecommend: true, type: 1 },
  { name: 'AXSUSDT', label: 'AXS/USDT', isRecommend: false, type: 1 },
  { name: 'SOLUSDT', label: 'SOL/USDT', isRecommend: true, type: 1 },
  { name: 'SANDUSDT', label: 'SAND/USDT', isRecommend: true, type: 1 },
  { name: 'ATOMUSDT', label: 'ATOM/USDT', isRecommend: false, type: 1 },
  { name: 'AAVEUSDT', label: 'AAVE/USDT', isRecommend: false, type: 1 },
  { name: 'UNIUSDT', label: 'UNI/USDT', isRecommend: false, type: 1 },
  { name: 'USDCNH', label: 'USDCNH', isRecommend: false, type: 2 },
  { name: 'GBPUSD', label: 'GBPUSD', isRecommend: false, type: 2 },
  { name: 'USDCHF', label: 'USDCHF', isRecommend: false, type: 2 },
  { name: 'EURUSD', label: 'EURUSD', isRecommend: false, type: 2 },
  { name: 'AUDUSD', label: 'AUDUSD', isRecommend: false, type: 2 },
  { name: 'USDJPY', label: 'USDJPY', isRecommend: false, type: 2 },
  { name: 'NZDUSD', label: 'NZDUSD', isRecommend: false, type: 2 },
  { name: 'USDCAD', label: 'USDCAD', isRecommend: false, type: 2 },
  { name: 'AUDNZD', label: 'AUDNZD', isRecommend: false, type: 2 },
  { name: 'EURJPY', label: 'EURJPY', isRecommend: false, type: 2 },
  { name: 'NZDJPY', label: 'NZDJPY', isRecommend: false, type: 2 },
  { name: 'AUDJPY', label: 'AUDJPY', isRecommend: false, type: 2 },
  { name: 'CADJPY', label: 'CADJPY', isRecommend: false, type: 2 },
  { name: 'EURAUD', label: 'EURAUD', isRecommend: false, type: 2 },
  { name: 'EURCHF', label: 'EURCHF', isRecommend: false, type: 2 },
  { name: 'EURGBP', label: 'EURGBP', isRecommend: false, type: 2 },
  { name: 'GBPCHF', label: 'GBPCHF', isRecommend: false, type: 2 },
  { name: 'GBPAUD', label: 'GBPAUD', isRecommend: false, type: 2 },
  { name: 'GBPJPY', label: 'GBPJPY', isRecommend: false, type: 2 },
  { name: 'USDHKD', label: 'USDHKD', isRecommend: false, type: 2 },
  { name: 'US30', label: 'US30', isRecommend: false, type: 3 },
  { name: 'US500', label: 'US500', isRecommend: false, type: 3 },
  { name: 'GER30', label: 'GER30', isRecommend: false, type: 3 },
  { name: 'HK50', label: 'HK50', isRecommend: false, type: 3 },
  { name: 'NAS100', label: 'NAS100', isRecommend: false, type: 3 },
  { name: 'JPN225', label: 'JPN225', isRecommend: false, type: 3 },
  { name: 'CHINA300', label: 'CHINA300', isRecommend: false, type: 3 },
  { name: 'CHA50', label: 'CHA50', isRecommend: false, type: 3 },
  { name: 'GOLD', label: 'GOLD', isRecommend: false, type: 4 },
  { name: 'SILVER', label: 'SILVER', isRecommend: false, type: 4 },
  { name: 'UKOIL', label: 'UKOIL', isRecommend: false, type: 4 },
  { name: 'USOIL', label: 'USOIL', isRecommend: false, type: 4 }
]

// 行情页默认选择的自选产品
export const DEFAULT_QUOTE_FAVORITES_CURRENCY = [
  { name: 'GOLD', checked: true, label: 'GOLD', type: 4 },
  { name: 'USOIL', checked: true, label: 'USOIL', type: 4 },
  { name: 'UKOIL', checked: true, label: 'UKOIL', type: 4 },
  { name: 'NAS100', checked: true, label: 'NAS100', type: 3 },
  { name: 'BTCUSDT', checked: true, label: 'BTC/USDT', type: 1 },
  { name: 'ETHUSDT', checked: true, label: 'ETH/USDT', type: 1 },
  { name: 'EURUSD', checked: true, label: 'EURUSD', type: 2 },
  { name: 'GBPUSD', checked: true, label: 'GBPUSD', type: 2 }
]

export function formatQuotes() {
  const quoteList1: IQuoteInfoProp[] = [] //数字货币
  const quoteList2: IQuoteInfoProp[] = [] //外汇
  const quoteList3: IQuoteInfoProp[] = [] //指数
  const quoteList4: IQuoteInfoProp[] = [] //商品
  AllSymbols.map((i) => {
    if (i.type === 1) {
      quoteList1.push(i)
    }
    if (i.type === 2) {
      quoteList2.push(i)
    }
    if (i.type === 3) {
      quoteList3.push(i)
    }
    if (i.type === 4) {
      quoteList4.push(i)
    }
  })
  return { quoteList1, quoteList2, quoteList3, quoteList4 }
}

// 格式化websocket数据
export function formatWS(data: any) {
  let res = typeof data === 'string' ? JSON.parse(data) : data
  const example: any = {
    NOT_ENOUGH_DISTANCE_FROM_MARKET_PRICE: '挂单不符合最小挂单距离',
    CLIENT_BLOCKED_FOR_MALICIOUS_ACT: '恶意行为导致断开连接',
    RET_TRADE_EXPIRATION_DENIED: '到期时间设置无效',
    ILLEGAL_TRANSACTION_REQUEST: '非法交易请求',
    WRONG_ACCOUNT_PASSWORD: '账户或密码错误',
    SYMBOL_TRADE_DISABLED: '产品已禁止交易',
    REQUEST_PRICE_CHANGED: '偏离市场价格太大',
    RET_TRADE_BAD_VALUME: '手数不合理',
    GROUP_SECURITY_ERROR: '不符合组安全策略要求',
    MARKET_PRICE_CHANGED: '市场价格已改变',
    INSUFFICIENT_RIGHTS: '权限不足',
    QUOTE_NOT_AVAILABLE: '报价不可用',
    USER_NOT_LOGGED_IN: '用户未登录',
    RET_TRADE_NO_MONEY: '账户金额不足',
    RET_INVALID_DATA: '无效数据',
    SYMBOL_NOT_FOUND: '产品不存在',
    WRONG_STOP_LEVEL: '止损止盈设置错误',
    SERVER_NOT_READY: '服务器暂不可用',
    ORDER_NOT_EXIST: '订单不存在',
    MARKET_CLOSED: '市场已关闭',
    NETWORK_ERROR: '网络异常',
    INVALID_DATA: '无效数据',
    RET_TRADE_BAD_VOLUME: '手数不合理',
    ACCOUNT_DISABLED: '未通过风险审查，请联系客服',
    OFF_QUOTES: '网络错误'
  }
  if ((res.t === 8 || res.t === 4) && typeof res.d === 'string' && example[res.d]) {
    res.msg = example[res.d]
  }
  return res
}

const quoteList2 = formatQuotes().quoteList2 // 外汇
const quoteList3 = formatQuotes().quoteList3 // 指数

/**
 * 将计算的浮动盈亏转化为美元单位
 * @param dataSourceSymbol 数据源品种名称
 * @param positionItem 持仓item
 * @returns
 */
export function covertProfit(dataSourceSymbol: string, positionItem: IPositionItem) {
  if (!dataSourceSymbol) return
  const quoteInfo = useCurrentQuote(dataSourceSymbol)
  const currentQuote = quoteInfo.currentQuote as any
  let qb: any = {}
  const symbolConf = quoteInfo?.symbolConf
  const bid = quoteInfo?.bid
  const ask = quoteInfo?.ask
  const unit = symbolConf?.baseCurrency // 货币单位
  const isBuy = positionItem.buySell === TRADE_BUY_SELL.BUY // 是否买入
  const isSell = positionItem.buySell === TRADE_BUY_SELL.SELL // 是否卖出
  const number = positionItem.orderVolume || 0 // 手数
  const consize = symbolConf?.contractSize || 1 // 合约量
  const openPrice = positionItem.startPrice || 0 // 开仓价
  const isForeign = symbolConf?.calculationType === 'FOREIGN_CURRENCY' // 外汇
  // 浮动盈亏  (买入价-卖出价) x 合约单位 x 交易手数
  let profit = positionItem.buySell === TRADE_BUY_SELL.BUY ? (bid - openPrice) * number * consize : (openPrice - ask) * number * consize

  // 检查货币是否是外汇/指数，并且不是以 USD 为单位，比如AUDNZD => 这里单位是NZD，找到NZDUSD或者USDNZD的指数取值即可
  // 数字货币、商品黄金石油这些以美元结算的，单位都是USD不需要参与转化直接返回
  // 非USD单位的产品都要转化为美元
  // if ((quoteList2.some((v) => v.name === symbol) || quoteList3.some((v) => v.name === symbol)) && unit !== 'USD') {
  if (isForeign) {
    // 乘法
    const divName = 'USD' + unit // 如 USDNZD
    // 除法
    const mulName = unit + 'USD' // 如 NZDUSD
    // 检查是否存在 divName 对应的报价信息
    if (currentQuote[divName]) {
      qb = currentQuote[divName]
      // 检查交易指令是否是买入，如果是，则获取 divName 对应的报价信息，并用其 bid 除以 profit
      if (isBuy) {
        profit = profit / qb.bid
      }
      // 检查交易指令是否是卖出，如果是，则获取 divName 对应的报价信息，并用其 ask 除以 profit
      else if (isSell) {
        profit = profit / qb.ask
      }
    }
    // 如果 divName 对应的报价信息不存在，则检查 mulName 对应的报价信息
    else if (currentQuote[mulName]) {
      // 检查交易指令是否是买入，如果是，则获取 mulName 对应的报价信息，并用其 bid 乘以 profit
      if (isBuy) {
        qb = currentQuote[mulName]
        profit = profit * qb.bid
      }
      // 检查交易指令是否是卖出，如果是，则获取 mulName 对应的报价信息，并用其 ask 乘以 profit
      else if (isSell) {
        qb = currentQuote[mulName]
        profit = profit * qb.ask
      }
    }
  }
  // 返回转化后的 profit
  return Number(profit.toFixed(2))
}

/**
 * 格式化交易时间段
 * @param a 分钟
 * @returns
 */
export function formatSessionTime(a: any) {
  let b: any = (a / 60).toFixed(2)
  if (parseInt(b) === parseFloat(b)) {
    // console.log('整数')
    if (b < 10) {
      return '0' + parseInt(b).toFixed(0) + ':' + '00'
    } else {
      return parseInt(b).toFixed(0) + ':' + '00'
    }
  } else {
    let c: any = b.substring(b.indexOf('.') + 1, b.length) * 0.01
    let d: any = parseInt(b).toFixed(0)
    if (d < 10) {
      return '0' + d + ':' + (c * 60).toFixed(0)
    } else {
      return d + ':' + (c * 60).toFixed(0)
    }
  }
}
