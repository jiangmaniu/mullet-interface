import { observer } from 'mobx-react'

import useTrade from '@/hooks/useTrade'

// 预估保证金
function ExpectedMargin() {
  const { expectedMargin } = useTrade()
  return expectedMargin ? expectedMargin + 'USD' : '-'
}

export default observer(ExpectedMargin)
