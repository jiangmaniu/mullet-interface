import { useMemo } from 'react'

import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getCurrentQuote } from '@/utils/wsUtil'

type IProps = {
  /** 交易品种item */
  item?: Account.TradeSymbolListItem
}
export default function useQuoteColor(props?: IProps) {
  const { item } = props || {}
  const { trade } = useStores()
  const { cn, theme } = useTheme()
  const { isPc } = useEnv()
  const { up: upColor, down: downColor, isDark } = theme
  const symbol = item?.symbol || trade.activeSymbolName

  const res = getCurrentQuote(symbol)

  const { bid, ask, percent: per, hasQuote, quotes, askDiff, bidDiff } = useMemo(() => res, [res])

  const quotesLength = useMemo(() => quotes.size, [quotes.size])

  const askColor = useMemo(() => {
    if (hasQuote && quotesLength) {
      return askDiff === 0 ? 'same' : askDiff > 0 ? 'up' : 'down'
    } else {
      return 'same'
    }
  }, [hasQuote, quotes, askDiff])

  const bidColor = useMemo(() => {
    if (hasQuote && quotesLength) {
      return bidDiff === 0 ? 'same' : bidDiff > 0 ? 'up' : 'down'
    } else {
      return 'same'
    }
  }, [hasQuote, quotes, bidDiff])

  const styles = useMemo(() => {
    return {
      up: {
        backgroundColor: upColor,
        color: 'white'
      },
      down: {
        backgroundColor: downColor,
        color: 'white'
      },
      same: {
        backgroundColor: theme.colors.gray[80],
        color: theme.colors.textColor.primary,
        borderColor: theme.colors.borderColor.weak
      }
    }
  }, [upColor, downColor, theme, isPc])

  const bidColorStyle = useMemo(() => styles[bidColor] || {}, [styles, bidColor])
  const askColorStyle = useMemo(() => styles[askColor] || {}, [styles, askColor])

  return {
    askColor,
    bidColor,
    bidColorStyle,
    askColorStyle,
    bid,
    ask,
    low: res.low,
    high: res.high,
    spread: res.spread
  }
}
