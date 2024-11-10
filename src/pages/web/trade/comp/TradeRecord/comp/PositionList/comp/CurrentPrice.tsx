import { observer } from 'mobx-react'

import { TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

import { IPendingItem } from '../../PendingList'

type IProps = {
  item: Order.BgaOrderPageListItem | IPendingItem
}

// 标记价格，当前市价行情价格
function CurrentPrice({ item }: IProps) {
  if (!item.symbol) return null
  const { trade } = useStores()
  const symbol = item.symbol
  const quoteInfo = getCurrentQuote(symbol)
  // 市价当前价格-价格需要取反方向的
  const marketCurrentPrice = item.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask
  // 限价当前价格
  const limitCurrentPrice = item.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid
  // @ts-ignore
  const type = item?.type as API.OrderType
  const currentPrice = type === 'LIMIT_BUY_ORDER' || type === 'LIMIT_SELL_ORDER' ? limitCurrentPrice : marketCurrentPrice

  return (
    <>
      {Number(currentPrice) ? (
        <span className={cn('!text-[13px]', quoteInfo?.bidDiff > 0 ? 'text-green' : 'text-red')}>
          {formatNum(currentPrice, { precision: item.symbolDecimal })}
        </span>
      ) : (
        <span className="!text-[13px]">-</span>
      )}
    </>
  )
}

export default observer(CurrentPrice)
