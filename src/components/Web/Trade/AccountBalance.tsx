import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { getCurrentQuote } from '@/utils/wsUtil'

// 账户净值
function AccountBalance() {
  const { trade } = useStores()
  const { hasQuote } = getCurrentQuote()
  // 没有行情取当前账号余额展示
  const balance = hasQuote ? trade.accountBalanceInfo.balance : trade.currentAccountInfo.money
  const currencyDecimal = trade.currentAccountInfo.currencyDecimal

  return (
    <span className="text-base font-pf-bold  dark:text-primary">
      {Number(balance) ? formatNum(balance > 0 ? balance : 0, { precision: currencyDecimal }) : '0.00'} USD
    </span>
  )
}

export default observer(AccountBalance)
