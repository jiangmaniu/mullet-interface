import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'

import useKycStatusInfo from '@/pages/webapp/hooks/useKycStatusInfo'
import { observer } from 'mobx-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import KycApproveInfoModal from '../setting/comp/KycApproveInfoModal'
import AdvanceKycApproveInfoModal from '../setting/kycV2/AdvanceKycApproveInfoModal'
import BaseKycApproveInfoModal from '../setting/kycV2/BaseKycApproveInfoModal'
import BindContactModal from '../setting/kycV2/BindContactModal'
import KycRejectModal from '../setting/kycV2/KycRejectModal'
import KycWaitModal from '../setting/kycV2/KycWaitModal'
import WithdrawalMethod from './comp'

const Methods = observer(({ kycStatus }: { kycStatus: boolean }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[26px] gap-x-[34px] w-[80%]">
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
  const isBaseAuth = currentUser?.isBaseAuth
  const { fetchUserInfo } = useModel('user')
  const baseModal = useRef<any>()
  const advanceModal = useRef<any>()
  const kycRejectModal = useRef<any>()
  const kycWaitModal = useRef<any>()
  const kycSuccModalRef = useRef<any>()

  const { status, operation, phone } = useKycStatusInfo()
  const bindModal = useRef<any>()

  useEffect(() => {
    // 刷新用户信息
    fetchUserInfo(false)
  }, [])

  const handleKycStatusClick = (status: number) => {
    if (!phone) {
      bindModal.current?.show()
      return
    }

    // TODO
    if (status === 0) {
      baseModal.current?.show()
    } else if (status === 4) {
      kycSuccModalRef.current?.show()
    } else if (status === 1) {
      advanceModal.current?.show()
    } else if (status === 3) {
      kycRejectModal.current?.show()
    } else if (status === 2) {
      kycWaitModal.current?.show()
    }
  }

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
                // push('/setting')
                handleKycStatusClick(status)
              }}
            >
              {operation}
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
      {/* 基础认证弹窗 */}
      <BaseKycApproveInfoModal
        ref={baseModal}
        onSuccess={() => {
          advanceModal.current?.show()
        }}
      />
      {/* 高级认证弹窗 */}
      <AdvanceKycApproveInfoModal
        ref={advanceModal}
        onSuccess={() => {
          kycWaitModal.current?.show()
        }}
      />
      <KycWaitModal ref={kycWaitModal} />
      <KycApproveInfoModal ref={kycSuccModalRef} />
      <KycRejectModal
        ref={kycRejectModal}
        onSuccess={() => {
          advanceModal.current?.show()
        }}
      />

      <BindContactModal ref={bindModal} />
    </PageContainer>
  )
}

export default observer(Withdrawal)
