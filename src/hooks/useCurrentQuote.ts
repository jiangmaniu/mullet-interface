import { useStores } from '@/context/mobxProvider'
import { toFixed } from '@/utils'

/**
 * 获取当前激活打开的品种，高开低收，涨幅百分比
 * @param {*} currentSymbol 当前传入的symbolName
 * @returns
 */
function useCurrentQuote(currentSymbolName?: string) {
  const { ws, global, trade } = useStores()
  const { quotes } = ws
  const symbol = currentSymbolName || trade.activeSymbolName

  const symbolInfo = trade.symbolList.find((item) => item.symbol === symbol) || {} // 品种信息
  const currentQuote = quotes?.[symbol] || {} // 行情信息

  // 品种配置解构方便取值
  const currentSymbol = symbolInfo as Account.TradeSymbolListItem
  const symbolConf = currentSymbol?.symbolConf as Symbol.SymbolConf // 当前品种配置
  const prepaymentConf = currentSymbol?.symbolConf?.prepaymentConf as Symbol.PrepaymentConf // 当前品种预付款配置
  const transactionFeeConf = currentSymbol?.symbolConf?.transactionFeeConf as Symbol.TransactionFeeConf // 当前品种手续费配置
  const holdingCostConf = currentSymbol?.symbolConf?.holdingCostConf as Symbol.HoldingCostConf // 当前品种手续费配置
  const spreadConf = currentSymbol?.symbolConf?.spreadConf as Symbol.SpreadConf // 当前品种点差配置
  const tradeTimeConf = currentSymbol?.symbolConf?.tradeTimeConf as Symbol.TradeTimeConf // 当前品种交易时间配置
  const quotationConf = currentSymbol?.symbolConf?.quotationConf as Symbol.QuotationConf // 当前品种交易时间配置
  const symbolNewTicker = currentSymbol.symbolNewTicker // 高开低收价格信息，只加载一次，不会实时跳动，需要使用ws的覆盖

  const digits = Number(currentSymbol?.symbolDecimal || 2) // 小数位，默认2
  const ask = Number(currentQuote?.priceData?.buy || 0) // 买价
  const bid = Number(currentQuote?.priceData?.sell || 0) // 卖价
  const open = Number(symbolNewTicker?.open || 0) // 开盘价
  const high = Math.max.apply(Math, [Number(symbolNewTicker?.open || 0), bid]) // 拿当前价格跟首次返回的比
  const low = Math.max.apply(Math, [Number(symbolNewTicker?.low || 0), bid]) // 拿当前价格跟首次返回的比
  const close = Number(bid || symbolNewTicker?.close || 0) // 使用卖价作为最新的收盘价格
  const percent = Number(bid && open ? (((bid - open) / open) * 100).toFixed(2) : 0)

  return {
    symbol, // 用于展示的symbol自定义名称
    dataSourceSymbol: currentSymbol.dataSourceSymbol, // 用于订阅行情、下单的名称？
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
    consize: Number(symbolConf?.contractSize || 0),
    ask: toFixed(ask, digits),
    bid: toFixed(bid, digits),
    high: toFixed(high, digits), //高
    low: toFixed(low, digits), //低
    open: toFixed(open, digits), //开
    close: toFixed(close, digits), //收
    spread: Math.abs(parseInt(String((bid - ask) * Math.pow(10, digits)))) // 买卖点差
  }
}

export default useCurrentQuote
