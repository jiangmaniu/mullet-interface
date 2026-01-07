import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { BNumber } from '@/libs/utils/number'

type IProps = {
  item: Order.BgaOrderPageListItem
}

// 保证金率
function MarginRate({ item }: IProps) {
  const { trade } = useStores()
  const positionListSymbolCalcInfo = trade.positionListSymbolCalcInfo
  // const quoteInfo = getCurrentQuote(item.symbol)

  // 保证金率
  // const { marginRate } = trade.getMarginRateInfo(item)

  // return marginRate ? `${marginRate}%` : '-'

  // 使用worker计算结果
  const calcInfo = positionListSymbolCalcInfo.get(item.id)
  const marginRate = calcInfo?.marginRateInfo?.marginRate

  return `${BNumber.toFormatPercent(marginRate, { isRaw: false })}`
}

export default observer(MarginRate)
