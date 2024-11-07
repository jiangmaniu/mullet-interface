import { observer } from 'mobx-react'

import { TRADE_BUY_SELL } from '@/constants/enum'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

type IProps = {
  item: Order.BgaOrderPageListItem
}

// 标记价格，当前市价行情价格
function CurrentPrice({ item }: IProps) {
  if (!item.symbol) return null
  const symbol = item.symbol
  const quoteInfo = getCurrentQuote(symbol)
  const currentPrice = item.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask // 价格需要取反方向的

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
