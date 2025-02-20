import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'

import { push } from '@/utils/navigator'
import { observer } from 'mobx-react'
import { useLayoutEffect } from 'react'
import DepositMethod from './comp'

const Methods = observer(({ kycStatus }: { kycStatus: boolean }) => {
  const intl = useIntl()

  const methods = stores.wallet.depositMethods

  useLayoutEffect(() => {
    if (methods.length === 0) {
      const language = intl.locale.replace('-', '').replace('_', '').toUpperCase() as Wallet.Language
      stores.wallet.getDepositMethods({ language })

      return
    }
  }, [methods, intl])

  const [searchParams] = useSearchParams()
  const tradeAccountId = searchParams.get('tradeAccountId') as string

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-[38px] md:gap-[24px] gap-[16px]">
      {methods.map((item: Wallet.fundsMethodPageListItem) => (
        <DepositMethod item={item} key={item.title} status={kycStatus ? 'unlocked' : 'locked'} tradeAccountId={tradeAccountId} />
      ))}
    </div>
  )
})

function Deposit() {
  const intl = useIntl()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态
  const isBaseAuth = currentUser?.isBaseAuth || false

  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-primary font-bold text-[24px] mb-7">
        <FormattedMessage id="mt.rujin" />
      </div>
      <div className="flex flex-col gap-8 ">
        {!isBaseAuth && (
          <div className=" border border-gray-150 rounded-lg px-5 py-4 flex justify-between">
            <div className="flex flex-row items-center gap-[18px]">
              <Iconfont name="renzheng" width={40} height={40} />
              <div className=" text-base font-semibold text-gray-900">
                {intl.formatMessage({ id: 'mt.wanshanzhanghuziliao' }, { value: getIntl().formatMessage({ id: 'mt.shoucirujin' }) })}
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
          <div className="  text-base text-gray-900 mb-6 ">
            {intl.formatMessage({ id: 'mt.rujinfangshi' })}
            {isBaseAuth && <span className=" text-secondary text-sm ">&nbsp;({intl.formatMessage({ id: 'mt.renzhenghoukaiqi' })})</span>}
          </div>
          <Methods kycStatus={isBaseAuth} />
        </div>
      </div>
    </PageContainer>
  )
}

export default observer(Deposit)
