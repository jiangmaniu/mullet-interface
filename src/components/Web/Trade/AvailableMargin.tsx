import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'

import AccountListItem from '@/components/Admin/RightContent/AccountListItem'
import { useStores } from '@/context/mobxProvider'
import { useEffect, useState } from 'react'

// 账户可用保证金组件
function AvailableMargin() {
  const { trade } = useStores()
  const { availableMargin } = trade.getAccountBalance()
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 设置一个定时器强制更新availableMargin的值
    const timer = setInterval(() => {
      if (count > 5) {
        clearInterval(timer)
      }
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [count])

  return (
    <AccountListItem value={availableMargin} label={<FormattedMessage id="mt.keyong" />} tips={<FormattedMessage id="mt.keyongtips" />} />
  )
}

export default observer(AvailableMargin)
