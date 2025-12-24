import { observer } from 'mobx-react'

import { TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { formatNum } from '@/utils'
import { cn } from '@/libs/ui/lib/utils'
import { IPendingItem } from '@/pages/web/trade/comp/TradeRecord/comp/PendingList'

type IProps = {
  item: Order.BgaOrderPageListItem | IPendingItem | Order.TradeRecordsPageListItem
}

// 标记价格，当前市价行情价格
function CurrentPrice({ item }: IProps) {
  if (!item.symbol) return null
  const { trade } = useStores()
  const symbol = item.symbol
  const quoteInfo = useCurrentQuote(symbol)
  // 市价当前价格-价格需要取反方向的
  const marketCurrentPrice = item.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask
  // 限价当前价格
  const limitCurrentPrice = item.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid
  // @ts-ignore
  const type = item?.type as API.OrderType
  const currentPrice = type === 'LIMIT_BUY_ORDER' || type === 'LIMIT_SELL_ORDER' ? limitCurrentPrice : marketCurrentPrice

  return (
    <>
      {currentPrice ? (
        <span className={cn('', quoteInfo?.bidDiff && quoteInfo?.bidDiff > 0 ? 'text-green' : 'text-red')}>
          {formatNum(currentPrice, { precision: item.symbolDecimal })}
        </span>
      ) : (
        <span className="">-</span>
      )}
    </>
  )
}

export default observer(CurrentPrice)
