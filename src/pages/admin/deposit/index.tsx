import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'

import useKycAuth from '@/hooks/useKycAuth'
import { observer } from 'mobx-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import BaseKycApproveInfoModal from '../setting/kycV2/BaseKycApproveInfoModal'
import BindContactModal from '../setting/kycV2/BindContactModal'
import DepositMethod from './comp'

const Methods = observer(({ kycStatus }: { kycStatus?: boolean }) => {
  const intl = useIntl()
  const { notKycAuth, isKycAuth } = useKycAuth()
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[26px] gap-x-[34px] w-[80%]">
      {methods.map((item: Wallet.fundsMethodPageListItem) => (
        <DepositMethod
          item={item}
          key={item.title}
          status={notKycAuth ? 'unlocked' : kycStatus ? 'unlocked' : 'locked'}
          tradeAccountId={tradeAccountId}
        />
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
  const phone = currentUser?.userInfo?.phone || ''
  const { fetchUserInfo } = useModel('user')
  const baseModal = useRef<any>()
  const bindModal = useRef<any>()
  const advanceModal = useRef<any>()
  const kycWaitModal = useRef<any>()
  const { notKycAuth, isKycAuth } = useKycAuth()

  useEffect(() => {
    // 刷新用户信息
    fetchUserInfo(false)
  }, [])

  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-primary font-bold text-[24px] mb-7">
        <FormattedMessage id="mt.rujin" />
      </div>
      <div className="flex flex-col gap-8 ">
        {!isBaseAuth && !notKycAuth && (
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
                if (!phone) {
                  bindModal.current?.show()
                  return
                }

                baseModal.current?.show()
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

      {/* 基础认证弹窗 */}
      <BaseKycApproveInfoModal
        ref={baseModal}
        onSuccess={() => {
          advanceModal.current?.show()
        }}
      />

      <BindContactModal ref={bindModal} />

      {/* 高级认证弹窗 */}
      {/* <AdvanceKycApproveInfoModal
        ref={advanceModal}
        onSuccess={() => {
          kycWaitModal.current?.show()
        }}
      />
      <KycWaitModal ref={kycWaitModal} /> */}
    </PageContainer>
  )
}

export default observer(Deposit)
