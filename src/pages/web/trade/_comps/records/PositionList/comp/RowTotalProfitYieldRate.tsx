import Big from 'big.js'
import currency from 'currency.js'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { toFixed } from '@/utils'
import { cn } from '@/libs/ui/lib/utils'

import { IPositionItem } from '..'
import { BNumber } from '@/libs/utils/number'

type IProps = {
  childrenList?: IPositionItem[]
}

// 浮动盈亏、收益率
function RowTotalProfitYieldRate({ childrenList = [] }: IProps) {
  const { trade } = useStores()
  const positionListSymbolCalcInfo = trade.positionListSymbolCalcInfo
  const precision = trade.currentAccountInfo.currencyDecimal
  const unit = trade.currentAccountInfo.currencyUnit

  if (!childrenList.length) return '--'

  // 使用worker计算结果
  let totalProfit = 0
  let totalYieldRate = 0
  let totalOrderMargin: any = new Big(0)
  childrenList.forEach((item) => {
    const calcInfo = positionListSymbolCalcInfo.get(item.id)
    totalProfit += calcInfo?.profit || 0
    totalYieldRate += Number(currency(calcInfo?.yieldRate, { precision }).value || 0)
    totalOrderMargin = totalOrderMargin.plus(toFixed(item.orderMargin || 0, precision)) // 先截取在结算，否则跟页面上截取后的结果不一致
  })

  totalOrderMargin = totalOrderMargin.toNumber()

  // 总盈利百分比=(总投资金额/总盈亏金额)×100]
  const totalYieldRateValue = BNumber.from(totalProfit).div(totalOrderMargin)
  const color = BNumber.from(totalProfit).gt(0) ? 'text-green' : 'text-red'

  return (
    <div className={cn('flex flex-col', color)}>
      <div>{BNumber.toFormatNumber(totalProfit, { volScale: precision, positive: false, forceSign: true })}</div>

      {!!totalYieldRateValue && (
        <div className={cn('!text-xs font-pf-bold', color)}>({BNumber.toFormatPercent(totalYieldRateValue, { forceSign: true })})</div>
      )}
    </div>
  )
}
export default observer(RowTotalProfitYieldRate)
