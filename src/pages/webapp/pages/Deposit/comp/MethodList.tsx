import { stores } from '@/context/mobxProvider'
import { useIntl, useModel, useSearchParams } from '@umijs/max'
import { observer } from 'mobx-react'
import { useLayoutEffect, useState } from 'react'
import DepositMethod from './DepositMethod'

export const MethodList = observer(() => {
  const intl = useIntl()

  const methods = stores.wallet.depositMethods

  const depositMethodInitialized = stores.wallet.depositMethodInitialized
  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求

  useLayoutEffect(() => {
    const now = Date.now().valueOf()
    if (prevIntl !== intl.locale || now - depositMethodInitialized > 1000 * 30) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getDepositMethods({ language })

      setPrevIntl(intl.locale)
      return
    }
  }, [depositMethodInitialized, intl.locale])

  const [searchParams] = useSearchParams()
  const tradeAccountId = searchParams.get('tradeAccountId') as string

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const isBaseAuth = currentUser?.isBaseAuth || false

  return (
    <div className="flex flex-col gap-3">
      <span className=" font-bold text-xl pl-2.5 pb-[5px]">{intl.formatMessage({ id: 'mt.xuanzerujinfangshi' })}</span>
      {methods.map((item: Wallet.fundsMethodPageListItem, index: number) => (
        <DepositMethod item={item} key={index} status={isBaseAuth ? 'unlocked' : 'locked'} tradeAccountId={tradeAccountId} />
      ))}
    </div>
  )
})
