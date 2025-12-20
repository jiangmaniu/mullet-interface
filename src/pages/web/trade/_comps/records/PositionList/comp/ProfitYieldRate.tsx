import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

type IProps = {
  item: Order.BgaOrderPageListItem
  /**是否展示收益率 */
  showYieldRate?: boolean
}

// 浮动盈亏、收益率
function ProfitYieldRate({ item, showYieldRate = true }: IProps) {
  if (!item.symbol) return null
  const { trade } = useStores()
  const positionListSymbolCalcInfo = trade.positionListSymbolCalcInfo
  // const quoteInfo = getCurrentQuote(item.symbol)
  const precision = trade.currentAccountInfo.currencyDecimal
  // const profit = covertProfit(item) as number // 浮动盈亏
  // const flag = Number(profit) > 0
  // const color = flag ? 'text-green' : 'text-red'

  // const profitFormat = Number(profit) ? formatNum(profit, { precision }) : profit || '-' // 格式化的
  // const profitDom = profit ? <span className={cn('font-pf-bold', color)}>{profitFormat} USD</span> : <span className="!text-[13px]">-</span>
  // const yieldRate = showYieldRate ? calcYieldRate(item, precision, profit) : undefined // 收益率

  // 使用worker计算结果
  const calcInfo = positionListSymbolCalcInfo.get(item.id)
  const profit = calcInfo?.profit
  let yieldRate = calcInfo?.yieldRate

  const flag = Number(profit) > 0
  const color = flag ? 'text-green' : 'text-red'

  const profitFormat = Number(profit) ? formatNum(profit, { precision }) : profit || '--' // 格式化的
  const profitDom = profit ? (
    <span className={cn('font-pf-bold', color)}>
      {flag ? '+' : ''}
      {profitFormat} USD
    </span>
  ) : (
    <span className="!text-[13px]">--</span>
  )
  yieldRate = showYieldRate ? yieldRate : undefined // 收益率

  return (
    <div className="flex flex-col">
      <div>{profitDom}</div>
      {showYieldRate && !!yieldRate && <div className={cn('!text-xs font-pf-bold', color)}>({yieldRate})</div>}
    </div>
  )
}
export default observer(ProfitYieldRate)
