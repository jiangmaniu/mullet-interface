import { observer } from 'mobx-react'

import useTrade from '@/hooks/useTrade'
import { formatNum } from '@/utils'

// 可用保证金
function AccountAvailableMargin() {
  const { availableMargin } = useTrade()

  return Number(availableMargin) < 0 ? '--' : formatNum(availableMargin, { precision: 2 }) + ' USD'
}

export default observer(AccountAvailableMargin)
