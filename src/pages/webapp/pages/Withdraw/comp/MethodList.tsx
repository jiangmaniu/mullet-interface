import { stores } from '@/context/mobxProvider'
import { useIntl, useModel, useSearchParams } from '@umijs/max'
import { observer } from 'mobx-react'
import { useLayoutEffect } from 'react'
import WithdrawMethod from './WithdrawMethod'
export const MethodList = observer(() => {
  const intl = useIntl()

  const methods = stores.wallet.withdrawalMethods

  useLayoutEffect(() => {
    if (methods.length === 0) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getWithdrawalMethods({ language })

      return
    }
  }, [methods, intl])

  const [searchParams] = useSearchParams()
  const tradeAccountId = searchParams.get('tradeAccountId') as string

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const isKycAuth = currentUser?.isKycAuth || false

  return (
    <div className="flex flex-col gap-3">
      <span className=" font-bold text-xl pl-2.5 pb-[5px]">{intl.formatMessage({ id: 'mt.xuanzechujinfangshi' })}</span>
      {methods.map((item: Wallet.fundsMethodPageListItem, index: number) => (
        <WithdrawMethod item={item} key={index} status={isKycAuth ? 'unlocked' : 'locked'} tradeAccountId={tradeAccountId} />
      ))}
    </div>
  )
})
