import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { useDebounceEffect } from 'ahooks'
import { useState } from 'react'
import useTrade from './useTrade'

export default function useMargin() {
  const { orderParams } = useTrade()
  const { trade } = useStores()
  const accountGroupPrecision = trade.currentAccountInfo?.currencyDecimal || 2

  // ===== 使用接口计算预估保证金
  const [expectedMargin, setExpectedMargin] = useState<any>('')

  useDebounceEffect(
    () => {
      trade.calcMargin(orderParams).then((res: any) => {
        setExpectedMargin(formatNum(res, { precision: accountGroupPrecision }))
      })
    },
    [orderParams],
    {
      wait: 1000
    }
  )

  return expectedMargin
}
