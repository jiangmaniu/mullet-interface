import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { hiddenCenterPartStr } from '@/utils'
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
        <span className="text-gray text-xl font-bold">
          <FormattedMessage id="mt.myAccount" />
        </span>
        <span className="text-gray text-sm font-bold pl-6">Hi, {hiddenCenterPartStr(currentAccountInfo.id, 4)}</span>
        {isKycAuth && (
          <span className="text-green text-sm ml-3 px-[7px] py-1 rounded bg-green bg-opacity-[0.04]">
            <FormattedMessage id="mt.yirenzheng" />
          </span>
        )}
        {!isKycAuth && (
          <span
            className="text-red text-sm ml-3 px-[7px] py-1 rounded  cursor-pointer bg-red bg-opacity-[0.04]"
            onClick={() => {
              push('/setting/kyc')
            }}
          >
            <FormattedMessage id="mt.weirenzheng" />
          </span>
        )}
      </div>
    </div>
  )
}

export default observer(Header)
