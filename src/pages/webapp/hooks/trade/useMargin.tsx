import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { useEffect, useState } from 'react'
import useOrderParams from './useOrderParams'

export default function useMargin() {
  const { trade } = useStores()
  const orderParams = useOrderParams()
  const accountGroupPrecision = trade.currentAccountInfo?.currencyDecimal || 2

  // ===== 使用接口计算预估保证金
  const [expectedMargin, setExpectedMargin] = useState<any>('')

  // TODO: 不是 orderParams 变化就请求，这里需要优化
  useEffect(() => {
    if (orderParams.orderVolume && Number(orderParams.orderVolume) > 0) {
      trade.calcMargin(orderParams).then((res: any) => {
        setExpectedMargin(formatNum(res, { precision: accountGroupPrecision }))
      })
    }
  }, [orderParams])

  console.log('expectedMargin', expectedMargin)
  return expectedMargin
}
