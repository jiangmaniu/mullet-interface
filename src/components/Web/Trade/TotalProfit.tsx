import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'

import AccountListItem from '@/components/Admin/RightContent/AccountListItem'
import { useStores } from '@/context/mobxProvider'

// 账户总浮动盈亏组件
function TotalProfit() {
  const { trade } = useStores()
  const totalProfit = trade.accountBalanceInfo.totalProfit

  return (
    <AccountListItem
      value={totalProfit}
      label={<FormattedMessage id="mt.fudongyingkui" />}
      tips={<FormattedMessage id="mt.accountfudongyingkuitips" />}
    />
  )
}

export default observer(TotalProfit)
