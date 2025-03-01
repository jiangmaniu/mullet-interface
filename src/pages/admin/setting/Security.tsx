import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { push } from '@/utils/navigator'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Button } from 'antd'
import { useRef } from 'react'
import KycApproveInfoModal from './comp/KycApproveInfoModal'
import ModifyPasswordModal from './comp/ModifyPasswordModal'
import BindContactModal from './kycV1.5/BindContactModal'
import AdvanceKycApproveInfoModal from './kycV2/AdvanceKycApproveInfoModal'
import BaseKycApproveInfoModal from './kycV2/BaseKycApproveInfoModal'
import KycRejectModal from './kycV2/KycRejectModal'
import KycStatus from './kycV2/KycStatus'
import KycWaitModal from './kycV2/KycWaitModal'

export default function Security() {
  const ENV = getEnv()
  const intl = useIntl()
  const kycSuccModalRef = useRef<any>()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const userInfo = currentUser?.userInfo
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const phone = userInfo?.phone
  const email = userInfo?.email
  const firstName = kycAuthInfo?.firstName
  const lastName = kycAuthInfo?.lastName
  const isKycAuth = currentUser?.isKycAuth
  const isFinished = isKycAuth && email && phone // 验证是否完成
  let finishedStep = 0 // 已完成步数

  const phoneAreaCode = userInfo?.phoneAreaCode ? `+${userInfo?.phoneAreaCode}` : ''

  if (isFinished) {
    finishedStep = 2
  } else if (email && phone) {
    finishedStep = 1
  }

  // @ts-ignore
  const kycStatusName = {
    TODO: <FormattedMessage id="mt.daishenhe" />,
    CANCEL: <FormattedMessage id="mt.quxiao" />,
    DISALLOW: <FormattedMessage id="mt.shenheshibai" />
    // SUCCESS: <FormattedMessage id="mt.yirenzheng" />
  }[kycStatus]
  // 跳转kyc认证
  const handleJumpKycAuth = () => {
    if (!kycStatus || kycStatus === 'DISALLOW') {
      push('/setting/kyc')
      return
    }
    if (kycStatus === 'TODO') {
      // message.info(intl.formatMessage({ id: 'mt.shenfenrenzhengshenhezhong' }))
      push('/setting/kyc')
    } else if (kycStatus === 'SUCCESS') {
      // 认证成功弹窗
      handleKycSuccModal()
    }
  }

  // 实名认证成功弹窗
  const handleKycSuccModal = () => {
    kycSuccModalRef?.current?.show()
  }

  const informations = [
    {
      title: <FormattedMessage id="common.guojia" />,
      value: intl.locale === 'zh-TW' ? currentUser?.countryInfo?.nameCn : currentUser?.countryInfo?.nameEn
    },
    {
      title: <FormattedMessage id="common.shoujihao" />,
      value: phoneAreaCode + ' ' + phone
    },
    {
      title: <FormattedMessage id="common.dianziyouxiang" />,
      value: email || (
        <span className=" underline cursor-pointer">
          <FormattedMessage id="common.bangding" />
        </span>
      ),
      onClick: () => {
        const checked = stores.global.registerWay === 'EMAIL' ? phone : email
        !checked && bindModal.current?.show()
      }
    }
  ]

  const baseModal = useRef<any>()
  const advanceModal = useRef<any>()
  const bindModal = useRef<any>()
  const kycRejectModal = useRef<any>()
  const kycWaitModal = useRef<any>()
  const handleKycStatusClick = (status: number) => {
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
    <>
      <div className="pb-[26px]">
        <div className="rounded-[7px] border border-gray-150 py-[23px] px-[37px]">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-xl">{userInfo?.account}</span>
            <span className="text-secondary text-sm">
              <FormattedMessage id="mt.zhuceshijian" />
              :&nbsp;{userInfo?.createTime}
            </span>
          </div>
        </div>
      </div>
      <div className="pb-[26px]">
        <div className="text-primary font-dingpro-medium text-xl font-semibold pb-[16px]">
          <FormattedMessage id="mt.kyczhuangtai" />
        </div>
        <KycStatus onClick={handleKycStatusClick} />
      </div>
      <div className="pb-[26px]">
        <div className="text-primary font-dingpro-medium text-xl font-semibold">
          <FormattedMessage id="mt.xinxi" />
        </div>
        <div className="text-secondary text-sm pb-[16px] pt-2">
          <FormattedMessage id="mt.shezhixinxifubiaoti" />
        </div>
        <div className="flex flex-col gap-3">
          {informations.map((item, index) => (
            <div key={index} className="border border-gray-150 rounded-[7px] py-[22px] px-[26px] flex items-center justify-between">
              <span className="text-base font-normal">{item.title}</span>
              <span className="text-base font-normal" onClick={item?.onClick}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pb-[26px]">
        <div className="text-primary font-dingpro-medium text-xl font-semibold">
          <FormattedMessage id="mt.anquan" />
        </div>
        <div className="text-secondary text-sm pb-[16px] pt-2">
          <FormattedMessage id="mt.anquanfubiaoti" />
        </div>
        <div className="border border-gray-150 rounded-[7px] py-[22px] px-[26px] flex items-center justify-between">
          <span className="text-base font-normal">
            <FormattedMessage id="mt.zhanghaomima" />
          </span>

          <ModifyPasswordModal
            trigger={
              <Button type="text">
                <span className="text-primary text-sm font-semibold cursor-pointer">
                  <FormattedMessage id="mt.xiugaimima" />
                </span>
              </Button>
            }
          />
        </div>
      </div>
      {/* 实名认证成功弹窗 */}
      <KycApproveInfoModal ref={kycSuccModalRef} />
      <BaseKycApproveInfoModal
        ref={baseModal}
        onSuccess={() => {
          advanceModal.current?.show()
        }}
      />
      <AdvanceKycApproveInfoModal
        ref={advanceModal}
        onSuccess={() => {
          kycWaitModal.current?.show()
        }}
      />
      <BindContactModal ref={bindModal} />
      <KycWaitModal ref={kycWaitModal} />
      <KycRejectModal
        ref={kycRejectModal}
        onSuccess={() => {
          advanceModal.current?.show()
        }}
      />
    </>
  )
}
