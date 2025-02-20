import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'

import { push } from '@/utils/navigator'
import { observer } from 'mobx-react'
import { useLayoutEffect, useState } from 'react'
import WithdrawalMethod from './comp'

const Methods = observer(({ kycStatus }: { kycStatus: boolean }) => {
  const intl = useIntl()

  const methods = stores.wallet.withdrawalMethods
  const [prevIntl, setPrevIntl] = useState(intl.locale) // 防止重复请求

  useLayoutEffect(() => {
    if (methods.length === 0 || prevIntl !== intl.locale) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getWithdrawalMethods({ language })

      setPrevIntl(intl.locale)
      return
    }
  }, [methods, intl])

  const [searchParams] = useSearchParams()
  const tradeAccountId = searchParams.get('tradeAccountId') as string

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-[38px] md:gap-[24px] gap-[16px]">
      {methods.map((item: Wallet.fundsMethodPageListItem) => (
        <WithdrawalMethod item={item} key={item.title} status={kycStatus ? 'unlocked' : 'locked'} tradeAccountId={tradeAccountId} />
      ))}
    </div>
  )
})

function Withdrawal() {
  const intl = useIntl()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态
  const isKycAuth = currentUser?.isKycAuth

  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-primary font-bold text-[24px] mb-7">
        <FormattedMessage id="mt.chujin" />
      </div>
      <div className="flex flex-col gap-8 ">
        {!isKycAuth && (
          <div className=" border border-gray-150 rounded-lg px-5 py-4 flex justify-between">
            <div className="flex flex-row items-center gap-[18px]">
              <Iconfont name="renzheng" width={40} height={40} />
              <div className=" text-base font-semibold text-gray-900">
                {intl.formatMessage({ id: 'mt.wanshanzhanghuziliao' }, { value: getIntl().formatMessage({ id: 'mt.shoucichujin' }) })}
              </div>
            </div>

            <Button
              type="primary"
              onClick={() => {
                push('/setting')
              }}
            >
              {intl.formatMessage({ id: 'mt.wanshangerenziliao' })}
            </Button>
          </div>
        )}

        <div>
          <div className="text-base text-gray-900 mb-6 ">
            {intl.formatMessage({ id: 'mt.chujinfangshi' })}
            {kycStatus !== 'SUCCESS' && (
              <span className=" text-secondary text-sm ">&nbsp;({intl.formatMessage({ id: 'mt.renzhenghoukaiqi' })})</span>
            )}
          </div>

          <Methods kycStatus={isKycAuth || false} />
        </div>
      </div>
    </PageContainer>
  )
}

export default observer(Withdrawal)
