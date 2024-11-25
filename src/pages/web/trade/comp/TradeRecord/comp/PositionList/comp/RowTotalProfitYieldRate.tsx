import currency from 'currency.js'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

import { IPositionItem } from '..'

type IProps = {
  childrenList?: IPositionItem[]
}

// 浮动盈亏、收益率
function RowTotalProfitYieldRate({ childrenList = [] }: IProps) {
  const { trade } = useStores()
  const positionListSymbolCalcInfo = trade.positionListSymbolCalcInfo
  const precision = trade.currentAccountInfo.currencyDecimal

  if (!childrenList.length) return '--'

  // 使用worker计算结果
  let totalProfit = 0
  let totalYieldRate = 0
  childrenList.forEach((item) => {
    const calcInfo = positionListSymbolCalcInfo.get(item.id)
    totalProfit += calcInfo?.profit || 0
    totalYieldRate += Number(currency(calcInfo?.yieldRate, { precision }).value || 0)
  })

  const flag = Number(totalProfit) > 0
  const color = flag ? 'text-green' : 'text-red'

  const profitFormat = Number(totalProfit) ? formatNum(totalProfit, { precision }) : totalProfit || '--' // 格式化的
  const profitDom = totalProfit ? (
    <span className={cn('font-pf-bold', color)}>{profitFormat} USD</span>
  ) : (
    <span className="!text-[13px]">--</span>
  )

  const formatTotalYieldRate = !isNaN(totalYieldRate) ? formatNum(totalYieldRate, { precision }) : '--'

  return (
    <div className="flex flex-col">
      <div>{profitDom}</div>
      {!!totalYieldRate && (
        <div className={cn('!text-xs font-pf-bold', color)}>
          ({!isNaN(totalYieldRate) ? '+' + formatTotalYieldRate : formatTotalYieldRate})
        </div>
      )}
    </div>
  )
}
export default observer(RowTotalProfitYieldRate)
