import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'

import AccountListItem from '@/components/Admin/RightContent/AccountListItem'
import { useStores } from '@/context/mobxProvider'
import { getCurrentQuote } from '@/utils/wsUtil'

// 账户可用保证金组件
function AvailableMargin() {
  const quote = getCurrentQuote()
  const { trade } = useStores()
  const { availableMargin } = trade.getAccountBalance()

  return (
    <AccountListItem value={availableMargin} label={<FormattedMessage id="mt.keyong" />} tips={<FormattedMessage id="mt.keyongtips" />} />
  )
}

export default observer(AvailableMargin)
