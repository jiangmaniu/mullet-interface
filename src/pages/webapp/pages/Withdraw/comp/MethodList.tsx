import { stores } from '@/context/mobxProvider'
import useKycAuth from '@/hooks/useKycAuth'
import { useIntl, useModel, useSearchParams } from '@umijs/max'
import { observer } from 'mobx-react'
import { useLayoutEffect, useState } from 'react'
import WithdrawMethod from './WithdrawMethod'
export const MethodList = observer(() => {
  const intl = useIntl()

  const methods = stores.wallet.withdrawalMethods

  const withdrawalMethodInitialized = stores.wallet.withdrawalMethodInitialized
  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求

  useLayoutEffect(() => {
    const now = Date.now().valueOf()
    if (prevIntl !== intl.locale || now - withdrawalMethodInitialized > 1000 * 30) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getWithdrawalMethods({ language })

      setPrevIntl(intl.locale)
      return
    }
  }, [withdrawalMethodInitialized, intl.locale])

  const [searchParams] = useSearchParams()
  const tradeAccountId = searchParams.get('tradeAccountId') as string

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const isKycAuth = currentUser?.isKycAuth || false
  const { notKycAuth, kycAuthType } = useKycAuth()

  return (
    <div className="flex flex-col gap-3">
      <span className=" font-bold text-xl pl-2.5 pb-[5px]">{intl.formatMessage({ id: 'mt.xuanzechujinfangshi' })}</span>
      {methods.map((item: Wallet.fundsMethodPageListItem, index: number) => (
        <WithdrawMethod
          item={item}
          key={index}
          status={notKycAuth ? 'unlocked' : isKycAuth ? 'unlocked' : 'locked'}
          tradeAccountId={tradeAccountId}
        />
      ))}
    </div>
  )
})
