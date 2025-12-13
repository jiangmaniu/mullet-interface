import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import useKycAuth from '@/hooks/useKycAuth'
import { hiddenCenterPartStr } from '@/utils'
import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'

function Header() {
  const { trade } = useStores()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const isKycAuth = currentUser?.isKycAuth

  const currentAccountInfo = trade.currentAccountInfo

  const kycInfo = useKycAuth()

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <span className="text-primary text-xl font-bold">
          <FormattedMessage id="mt.myAccount" />
        </span>
        <span className="text-primary text-sm font-bold pl-6">Hi, {hiddenCenterPartStr(currentUser?.userInfo?.account, 6)}</span>
        {/* {isKycAuth && (
          <span className="text-green text-sm ml-3 px-[7px] py-1 rounded bg-[#45a48a1c]">
            <FormattedMessage id="mt.yirenzheng" />
          </span>
        )}
        {!isKycAuth && (
          <span
            className="text-red text-sm ml-3 px-[7px] py-1 rounded  cursor-pointer bg-[#c5474712]"
            onClick={() => {
              push('/setting')
            }}
          >
            <FormattedMessage id="mt.weirenzheng" />2
          </span>
        )} */}
        {!kycInfo.notKycAuth && (
          <div
            className="flex flex-col items-start justify-start ml-3 cursor-pointer"
            onClick={() => {
              push('/setting')
            }}
          >
            <span className={cn('text-xs font-pf-medium', kycInfo?.color)}>{kycInfo?.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default observer(Header)
