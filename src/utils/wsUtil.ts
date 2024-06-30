import { TRADE_BUY_SELL } from '@/constants/enum'
import { stores } from '@/context/mobxProvider'
import { IPositionItem } from '@/pages/web/trade/comp/TradeRecord/comp/PositionList'

import { toFixed } from '.'

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

/**
 * 将计算的浮动盈亏转化为美元单位
 * @param dataSourceSymbol 数据源品种名称
 * @param positionItem 持仓item
 * @returns
 */
export function covertProfit(positionItem: Order.BgaOrderPageListItem) {
  const dataSourceSymbol = positionItem?.dataSourceSymbol
  if (!dataSourceSymbol) return
  const quoteInfo = getCurrentQuote(dataSourceSymbol)
  const quotes = quoteInfo.quotes as any // 全部行情
  let qb: any = {}
  const symbolConf = quoteInfo?.symbolConf
  const bid = Number(quoteInfo?.bid || 0)
  const ask = Number(quoteInfo?.ask || 0)
  const unit = symbolConf?.baseCurrency // 货币单位
  const isBuy = positionItem.buySell === TRADE_BUY_SELL.BUY // 是否买入
  const isSell = positionItem.buySell === TRADE_BUY_SELL.SELL // 是否卖出
  const number = Number(positionItem.orderVolume || 0) // 手数
  const consize = Number(symbolConf?.contractSize || 1) // 合约量
  const openPrice = Number(positionItem.startPrice || 0) // 开仓价
  const isForeign = symbolConf?.calculationType === 'FOREIGN_CURRENCY' // 外汇
  // 浮动盈亏  (买入价-卖出价) x 合约单位 x 交易手数
  let profit =
    bid && ask
      ? positionItem.buySell === TRADE_BUY_SELL.BUY
        ? (bid - openPrice) * number * consize
        : (openPrice - ask) * number * consize
      : 0
  // 检查货币是否是外汇/指数，并且不是以 USD 为单位，比如AUDNZD => 这里单位是NZD，找到NZDUSD或者USDNZD的指数取值即可
  // 数字货币、商品黄金石油这些以美元结算的，单位都是USD不需要参与转化直接返回
  // 非USD单位的产品都要转化为美元
  // if ((quoteList2.some((v) => v.name === symbol) || quoteList3.some((v) => v.name === symbol)) && unit !== 'USD') {
  // @TODO 取值需要处理一下
  if (isForeign) {
    // 乘法
    const divName = ('USD' + unit).toLocaleLowerCase() // 如 USDNZD
    // 除法
    const mulName = (unit + 'USD').toLocaleLowerCase() // 如 NZDUSD
    // 检查是否存在 divName 对应的报价信息
    if (quotes[divName]) {
      qb = quotes[divName]
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
    else if (quotes[mulName]) {
      // 检查交易指令是否是买入，如果是，则获取 mulName 对应的报价信息，并用其 bid 乘以 profit
      if (isBuy) {
        qb = quotes[mulName]
        profit = profit * qb.bid
      }
      // 检查交易指令是否是卖出，如果是，则获取 mulName 对应的报价信息，并用其 ask 乘以 profit
      else if (isSell) {
        qb = quotes[mulName]
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

// 计算收益率
export const calcYieldRate = (item: IPositionItem) => {
  const conf = item.conf as Symbol.SymbolConf
  const orderMargin = Number(item.orderMargin || 0) // 开仓保证金
  // 收益率 = 浮动盈亏 / 保证金
  const profit = item.profit
  return profit && orderMargin ? toFixed((profit / orderMargin) * 100) + '%' : ''
}

/**
 * 计算订单的预估强平价
 * @param item 持仓单Item
 * @returns
 */
export const calcForceClosePrice = (item: Partial<IPositionItem>) => {
  const { trade } = stores
  let { occupyMargin, balance } = trade.getAccountBalance()
  const digits = item?.symbolDecimal
  const conf = item.conf as Symbol.SymbolConf
  const contractSize = Number(conf?.contractSize || 0) // 合约大小
  const orderVolume = Number(item.orderVolume || 0) // 手数
  const orderMargin = item.orderMargin || 0 // 单笔订单的占用保证金
  const isCrossMargin = item.marginType === 'CROSS_MARGIN' // 全仓
  const startPrice = Number(item.startPrice || 0) // 开仓价格
  let compelCloseRatio = item.compelCloseRatio || 0 // 强制平仓比例
  compelCloseRatio = compelCloseRatio ? compelCloseRatio / 100 : 0

  // 净值 = 账户余额 - 库存费 - 手续费 + 浮动盈亏
  // 汇率品种USD在前面，用除法
  // 汇率品种USD在后，用乘法
  // 净值 - (开仓价格 - 强平价格) * 合约大小 * 手数 * 汇率(乘或除) / 占用保证金 = 强平比例

  // 买：多头强平价格 = 开仓价格 - (净值 - 账户占用保证金*强平比例) / (合约大小 * 手数 * 汇率(乘或除)) @TODO 处理汇率取值问题
  let buyForceClosePrice = 0
  // 卖：空头强平价格 = 开仓价格 + (净值 + 账户占用保证金*强平比例) / (合约大小 * 手数 * 汇率(乘或除))  @TODO 处理汇率取值问题
  let sellForceClosePrice = 0

  // 全仓
  if (isCrossMargin) {
    const value = (balance - occupyMargin * compelCloseRatio) / (contractSize * orderVolume)
    buyForceClosePrice = toFixed(startPrice - value)
    sellForceClosePrice = toFixed(startPrice + value)
  } else {
    // 逐仓的净值 = 账户余额(单笔订单的保证金) - 库存费 - 手续费 + 浮动盈亏
    balance = orderMargin - Number(item.interestFees || 0) - Number(item.handlingFees || 0) + Number(item.profit || 0)
    // 单笔订单的占用保证金
    occupyMargin = orderMargin
    const value = (balance - occupyMargin * compelCloseRatio) / (contractSize * orderVolume)
    buyForceClosePrice = toFixed(startPrice - value)
    sellForceClosePrice = toFixed(startPrice + value)
  }

  const retValue = item.buySell === 'BUY' ? buyForceClosePrice : sellForceClosePrice

  return retValue > 0 ? toFixed(retValue, digits) : ''
}

type IExpectedForceClosePriceProp = {
  orderVolume: number
  /**订单保证金 */
  orderMargin: number
  /**买卖方向 */
  buySell: API.TradeBuySell
  /**订单类型 */
  orderType: API.OrderType | string
}
/**
 * 计算下单时的预估强平价
 * @returns
 */
export const calcExpectedForceClosePrice = ({ orderVolume, orderType, orderMargin, buySell }: IExpectedForceClosePriceProp) => {
  const { trade } = stores
  const quote = getCurrentQuote()

  const conf = quote?.symbolConf
  const feeConfList =
    conf?.transactionFeeConf?.type === 'trade_vol' ? conf?.transactionFeeConf?.trade_vol : conf?.transactionFeeConf?.trade_hand // 手续费配置列表
  const feeConfItem = (feeConfList || []).filter((v) => orderVolume >= v.from && orderVolume <= v.to)?.[0]
  const feeComputeMode = feeConfItem?.compute_mode // 手续费计算模式
  let marketFee = Number(feeConfItem?.market_fee || 0) // 市价手续费
  let limitFee = Number(feeConfItem?.limit_fee || 0) // 限价手续费

  if (feeComputeMode === 'percentage') {
    // 后台品种配置的手续费，选择百分比形式
    marketFee = marketFee / 100 // 读取市价手续费的百分比值
    limitFee = limitFee / 100 // 读取市价手续费的百分比值
  }
  const handlingFees = orderType === 'MARKET_ORDER' ? marketFee : limitFee // 手续费

  const item = {
    conf,
    symbolDecimal: quote?.digits,
    orderVolume,
    orderMargin,
    buySell,
    marginType: trade.marginType,
    startPrice: buySell === TRADE_BUY_SELL.BUY ? quote?.ask : quote?.bid,
    compelCloseRatio: trade?.currentAccountInfo?.compelCloseRatio || 0,
    interestFees: 0, // 库存费0
    handlingFees, // 手续费
    profit: 0 // 浮动盈亏0
  }
  return calcForceClosePrice(item)
}

/**
 * 计算可开仓手数
 * @param param0
 * @returns
 */
export const getMaxOpenVolume = ({ buySell }: { buySell: API.TradeBuySell }) => {
  const trade = stores.trade
  const { availableMargin } = trade.getAccountBalance()
  const quote = getCurrentQuote()
  const prepaymentConf = quote?.prepaymentConf
  const consize = quote.consize
  const mode = prepaymentConf?.mode
  const currentPrice = buySell === 'SELL' ? quote?.ask : quote?.bid // 价格取反
  let volume = 0

  if (mode === 'fixed_margin') {
    // 可用/固定预付款
    const initial_margin = Number(prepaymentConf?.fixed_margin?.initial_margin || 0)
    volume = initial_margin ? Number(availableMargin / initial_margin) : 0
  } else if (mode === 'fixed_leverage') {
    // 固定杠杆：可用/（价格*合约大小*手数/固定杠杆）
    const fixed_leverage = Number(prepaymentConf?.fixed_leverage?.leverage_multiple || 0)
    if (fixed_leverage) {
      volume = (availableMargin * fixed_leverage) / (currentPrice * consize)
    }
  } else if (mode === 'float_leverage') {
    // 浮动杠杆：可用/（价格*合约大小*手数/浮动杠杆）
    const float_leverage = Number(trade.leverageMultiple || 1)
    if (float_leverage) {
      volume = (availableMargin * float_leverage) / (currentPrice * consize)
    }
  }
  return Number(toFixed(volume))
}

/**
 * 获取当前激活打开的品种深度报价
 * @param {*} currentSymbol 当前传入的symbolName
 * @returns
 */
export function getCurrentDepth(currentSymbolName?: string) {
  const { ws, trade } = stores
  const { depth } = ws
  const symbol = currentSymbolName || trade.activeSymbolName
  const dataSourceSymbol = trade.getActiveSymbolInfo(symbol)?.dataSourceSymbol as string

  const currentDepth = depth[dataSourceSymbol] || {}

  return currentDepth
}

/**
 * 获取当前激活打开的品种，高开低收，涨幅百分比
 * @param {*} currentSymbol 当前传入的symbolName
 * @param quote 全部行情，再次传入覆盖，有些地方没有实时刷新
 * @returns
 */
export function getCurrentQuote(currentSymbolName?: string, quote?: any) {
  const { ws, trade } = stores
  const { quotes } = ws
  let symbol = currentSymbolName || trade.activeSymbolName // 展示的名称(后台自定义的品种名称)

  // 如果传入的currentSymbolName是dataSourceSymbol，则使用传入的
  const dataSourceSymbolItem = trade.symbolList.find((item) => item.dataSourceSymbol === currentSymbolName)
  const isDataSourceSymbol = !!dataSourceSymbolItem
  // 重要：如果传入的currentSymbolName是dataSourceSymbol，则获取对应的symbol自定义名称
  symbol = isDataSourceSymbol ? dataSourceSymbolItem?.symbol : symbol
  const symbolInfo = trade.symbolList.find((item) => item.symbol === symbol) || {} // 当前品种的详细信息

  // 品种配置解构方便取值
  const currentSymbol = symbolInfo as Account.TradeSymbolListItem
  const dataSourceSymbol = (isDataSourceSymbol ? currentSymbolName : currentSymbol.dataSourceSymbol) as string // 用于订阅行情
  const currentQuote = quote?.[dataSourceSymbol] || quotes?.[dataSourceSymbol] || {} // 行情信息
  const symbolConf = currentSymbol?.symbolConf as Symbol.SymbolConf // 当前品种配置
  const prepaymentConf = currentSymbol?.symbolConf?.prepaymentConf as Symbol.PrepaymentConf // 当前品种预付款配置
  const transactionFeeConf = currentSymbol?.symbolConf?.transactionFeeConf as Symbol.TransactionFeeConf // 当前品种手续费配置
  const holdingCostConf = currentSymbol?.symbolConf?.holdingCostConf as Symbol.HoldingCostConf // 当前品种手续费配置
  const spreadConf = currentSymbol?.symbolConf?.spreadConf as Symbol.SpreadConf // 当前品种点差配置
  const tradeTimeConf = currentSymbol?.symbolConf?.tradeTimeConf as Symbol.TradeTimeConf // 当前品种交易时间配置
  const quotationConf = currentSymbol?.symbolConf?.quotationConf as Symbol.QuotationConf // 当前品种交易时间配置
  const symbolNewTicker = currentSymbol.symbolNewTicker // 高开低收价格信息，只加载一次，不会实时跳动，需要使用ws的覆盖

  const digits = Number(currentSymbol?.symbolDecimal || 2) // 小数位，默认2
  let ask = Number(currentQuote?.priceData?.buy || 0) // 买价
  let bid = Number(currentQuote?.priceData?.sell || 0) // 卖价
  const open = Number(symbolNewTicker?.open || 0) // 开盘价
  const high = Math.max.apply(Math, [Number(symbolNewTicker?.open || 0), bid]) // 拿当前价格跟首次返回的比
  const low = Math.max.apply(Math, [Number(symbolNewTicker?.low || 0), bid]) // 拿当前价格跟首次返回的比
  const close = Number(bid || symbolNewTicker?.close || 0) // 使用卖价作为最新的收盘价格
  const percent = Number(bid && open ? (((bid - open) / open) * 100).toFixed(2) : 0)
  // 区分固定点差 浮动点差
  let spread = 0
  if (bid && ask) {
    if (spreadConf?.type === 'fixed') {
      // 固定点差模式
      // const { buy = 0, sell = 0 } = spreadConf?.fixed || {}
      // 后台处理
      // 新买价 = (买价 + 卖价) / 2 + 设置的点差*小数点
      // const newBuy = (bid + ask) / 2 + buy * Math.pow(10, -digits)
      // 新卖价 = （买价 + 卖价) / 2 - 设置的点差*小数点
      // const newSell = (bid + ask) / 2 - sell * Math.pow(10, -digits)
      // 点差
      spread = Math.abs(bid - ask)
    } else if (spreadConf?.type === 'float') {
      // 浮动点差模式
      // const { buy = 0, sell = 0 } = spreadConf?.float || {}
      // 后台处理
      // // 新买价 = 买价 + 设置的点差*小数点
      // const newBuy = (ask + buy) * Math.pow(10, -digits)
      // // 新卖价 = 卖价 - 设置的点差*小数点
      // const newSell = (bid - sell) * Math.pow(10, -digits)
      // 点差
      spread = Math.abs(bid - ask)
    }
  }

  return {
    symbol, // 用于展示的symbol自定义名称
    dataSourceSymbol, // 用于订阅行情
    digits,
    currentQuote,
    currentSymbol, // 当前品种信息
    symbolConf, // 全部品种配置
    prepaymentConf, // 预付款配置
    transactionFeeConf, // 手续费配置
    holdingCostConf, // 库存费配置
    spreadConf, // 点差配置
    tradeTimeConf, // 交易时间配置
    quotationConf, // 报价配置
    symbolNewTicker, // 高开低收
    percent, //涨幅百分比
    quotes,
    consize: Number(symbolConf?.contractSize || 0),
    ask: toFixed(ask, digits),
    bid: toFixed(bid, digits),
    high: toFixed(high, digits), //高
    low: toFixed(low, digits), //低
    open: toFixed(open, digits), //开
    close: toFixed(close, digits), //收
    spread: Number(toFixed(spread, digits)),
    bidDiff: currentQuote.bidDiff,
    askDiff: currentQuote.askDiff,
    hasQuote: Number(bid) > 0 // 是否存在行情
  }
}
