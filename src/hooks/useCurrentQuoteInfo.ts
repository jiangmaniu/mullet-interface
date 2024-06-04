import { useStores } from '@/context/mobxProvider'
import { toFixed } from '@/utils'

/**
 * 获取当前激活打开的品种，高开低收，涨幅百分比
 * @param {*} currentSymbol 当前传入的symbolName
 * @returns
 */
function useCurrentQuoteInfo(currentSymbolName?: string) {
  const { ws, global } = useStores()
  const { quotes, symbols, user, marketInfo, tradeList, userType } = ws as any
  const symbol = currentSymbolName || global.activeSymbolName

  const currentQuote = quotes?.[symbol] // 行情
  const currentSymbol = symbols?.[symbol] // 品种
  const currentMarketInfo = marketInfo?.[symbol] // 市场信息
  const digits = currentSymbol?.digits // 小数位

  const ask = currentQuote?.ask // 买价
  const bid = currentQuote?.bid // 卖价

  const res =
    currentQuote && currentSymbol && currentMarketInfo
      ? {
          h: toFixed(currentMarketInfo.bidhigh, digits), //高
          l: toFixed(currentMarketInfo.bidlow, digits), //低
          o: toFixed(currentMarketInfo.priceOpen, digits), //开
          c: toFixed(bid, digits), //收
          per: (((bid - currentMarketInfo.priceOpen) / currentMarketInfo.priceOpen) * 100).toFixed(2), //涨幅
          symbol,
          currentQuote,
          currentSymbol,
          currentMarketInfo,
          ask: toFixed(ask, digits),
          bid: toFixed(bid, digits),
          askBidDiffValue: Math.abs(parseInt(String((bid - ask) * Math.pow(10, digits)))) // 买卖点差
        }
      : {}

  return res
}

export default useCurrentQuoteInfo
