import { observer } from 'mobx-react'

import useMargin from '@/hooks/useMargin'

// 预估保证金
function ExpectedMargin() {
  // const { expectedMargin } = useTrade()

  // 接口计算预估保证金
  const margin = useMargin()
  // return expectedMargin ? expectedMargin + 'USD' : '-'
  return margin ? margin + 'USD' : '-'
}

export default observer(ExpectedMargin)
