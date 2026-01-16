import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { hiddenCenterPartStr } from '@/utils'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

function Header() {
  const { trade } = useStores()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const isKycAuth = currentUser?.isKycAuth

  const currentAccountInfo = trade.currentAccountInfo

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <span className="text-primary text-xl font-bold">
          <FormattedMessage id="mt.myAccount" />
        </span>
        <span className="text-primary text-sm font-bold pl-6">Hi, {hiddenCenterPartStr(currentUser?.userInfo?.account, 6)}</span>
      </div>
    </div>
  )
}

export default observer(Header)
