import { ArrowRightOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { useEffect, useRef, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import { gray } from '@/theme/theme.config'
import { formatEmail, formatMobile } from '@/utils'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import KycApproveInfoModal from './comp/KycApproveInfoModal'
import KycFailModal from './comp/KycFailModal.tsx'
import KycStepPie from './comp/KycStepPie'
import ModifyEmailModal from './comp/ModifyEmailModal'
import ModifyPasswordModal from './comp/ModifyPasswordModal'
import ModifyPhoneModal from './comp/ModifyPhoneModal'

export default function Setting() {
  const [tabKey, setTabKey] = useState('')
  const [showPersonInfo, setShowPersonInfo] = useState(false)
  const intl = useIntl()
  const kycSuccModalRef = useRef<any>()
  const { isEmailRegisterWay, fetchUserInfo } = useModel('user')
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

  const tabList = [
    {
      label: <FormattedMessage id="mt.anquanshezhi" />,
      key: 'security'
    }
    // {
    //   label: <FormattedMessage id="mt.chujindizhi" />,
    //   key: 'address'
    // }
  ]

  useEffect(() => {
    // 刷新用户信息
    fetchUserInfo(false)
  }, [])

  // 跳转kyc认证
  const handleJumpKycAuth = () => {
    if (!kycStatus || kycStatus === 'DISALLOW') {
      push('/setting/kyc')
      return
    }
    if (kycStatus === 'TODO') {
      message.info(intl.formatMessage({ id: 'mt.shenfenrenzhengshenhezhong' }))
    } else if (kycStatus === 'SUCCESS') {
      // 认证成功弹窗
      handleKycSuccModal()
    }
  }

  // 实名认证成功弹窗
  const handleKycSuccModal = () => {
    kycSuccModalRef?.current?.show()
  }

  return (
    <PageContainer
      pageBgColorMode="white"
      fluidWidth
      tabList={tabList}
      renderHeader={() => (
        <div className="text-[24px] font-bold text-gray">
          <FormattedMessage id="mt.shezhi" />
        </div>
      )}
      onChangeTab={(activeKey) => {
        setTabKey(activeKey)
      }}
      tabActiveKey={tabKey}
    >
      <div className="pb-[26px]">
        <div className="text-gray font-dingpro-medium text-xl font-semibold pb-[18px]">
          <FormattedMessage id="mt.zhanghu" />
        </div>
        <div className="flex items-center justify-between gap-x-[27px]">
          <div className="border border-gray-150 rounded-[7px] p-[30px] flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <KycStepPie step={finishedStep} />
                <div className="flex flex-col pl-5">
                  <div className="text-gray text-sm">
                    <FormattedMessage id="mt.yanzhengzhuangtai" />
                  </div>
                  {isFinished && (
                    <div className="text-green text-base py-[6px]">
                      <FormattedMessage id="mt.yiwancheng" />
                    </div>
                  )}
                  {!isFinished && (
                    <div className="text-red-700 text-base py-[6px]">{kycStatusName || <FormattedMessage id="mt.zanweiwancheng" />}</div>
                  )}
                  <div className="text-gray text-xs">
                    <FormattedMessage id="mt.yiwanchengxxstep" values={{ step: finishedStep }} />
                  </div>
                </div>
              </div>
              <Button type="text">
                <div className="flex items-center cursor-pointer">
                  {/* 没有提交kyc申请 */}
                  {!kycStatus && (
                    <span className="text-gray text-base leading-4 font-semibold pr-2" onClick={handleJumpKycAuth}>
                      <FormattedMessage id="mt.quwancheng" />
                    </span>
                  )}
                  {/* 实名认证成功 */}
                  {kycStatus === 'SUCCESS' && (
                    <span className="text-gray text-base leading-4 font-semibold pr-2" onClick={handleKycSuccModal}>
                      <FormattedMessage id="common.chakan" />
                    </span>
                  )}
                  {/* 实名认证失败 */}
                  {kycStatus === 'DISALLOW' && (
                    <KycFailModal
                      trigger={
                        <span className="text-gray text-base leading-4 font-semibold pr-2">
                          <FormattedMessage id="common.chakan" />
                        </span>
                      }
                    />
                  )}
                  {kycStatus !== 'TODO' && <ArrowRightOutlined style={{ color: gray[900], fontSize: 16 }} />}
                </div>
              </Button>
            </div>
          </div>
          <div className="border border-gray-150 rounded-[7px] p-[30px] flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="/img/wuxian.png" width={70} height={70} />
                <div className="flex flex-col pl-7">
                  <div className="text-gray text-sm">
                    <FormattedMessage id="mt.rujinxianzhi" />
                  </div>
                  <div className="text-green text-xl py-[6px]">
                    <FormattedMessage id="mt.wuxian" />
                  </div>
                  <div className="text-gray text-sm">
                    <FormattedMessage id="mt.qujueyuzhifufangshi" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-[26px]">
        <div className="text-gray font-dingpro-medium text-xl font-semibold pb-[18px]">
          <FormattedMessage id="mt.yanzhengbuzhou" />
        </div>
        <div className="border border-gray-150 rounded-[7px]">
          <div className="py-[18px] border-b border-gray-150 px-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                // 手机、邮箱都存在才可以展开
                if (email && phone) {
                  setShowPersonInfo(!showPersonInfo)
                } else {
                  handleJumpKycAuth()
                }
              }}
            >
              <div className="flex items-center">
                <img src={`/img/${phone && email ? 'kyc-succ' : 'kyc-fail'}.png`} width={24} height={24} />
                <div className="pl-2 font-semibold text-base">
                  {phone && email && <FormattedMessage id="mt.yiquerengerenziliao" />}
                  {!email && <FormattedMessage id="mt.bangdingyouxiang" />}
                  {!phone && <FormattedMessage id="mt.bangdingshouji" />}
                </div>
              </div>
              <img src={`/img/${showPersonInfo ? 'arrow-down' : 'arrow-right'}.png`} width={24} height={24} />
            </div>
            {showPersonInfo && (
              <div className="pl-8 pt-3">
                {/* <div className="text-xs text-gray py-2">
                  <FormattedMessage id="mt.ninyiquerengerenziliao" />
                </div> */}
                <div className="flex items-center">
                  <div className="flex items-center">
                    <img src="/img/youxiang.png" width={14} height={14} />
                    <span className="text-sm text-gray pl-2">{formatEmail(email)}</span>
                  </div>
                  {phone && (
                    <>
                      <div className="size-[3px] bg-gray rounded-full mx-4"></div>
                      <div className="flex items-center">
                        <img src="/img/shouji.png" width={14} height={14} />
                        <span className="text-sm text-gray pl-2">
                          {userInfo.phoneAreaCode} {formatMobile(phone)}
                        </span>
                      </div>
                    </>
                  )}
                  {firstName && (
                    <>
                      <div className="size-[3px] bg-gray rounded-full mx-4"></div>
                      <div className="flex items-center">
                        <img src="/img/yonghu.png" width={14} height={14} />
                        <span className="text-sm text-gray pl-2">
                          {firstName}·{lastName}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* <div
            className="flex items-center justify-between py-[18px] border-b border-gray-150 px-4 cursor-pointer"
            onClick={handleJumpKycAuth}
          >
            <div className="flex items-center">
              <img src={`/img/${isKycAuth ? 'kyc-succ' : 'kyc-fail'}.png`} width={24} height={24} />
              <div className="pl-2 font-semibold text-base">
                {isKycAuth ? <FormattedMessage id="mt.nindeshenfenyirenzheng" /> : <FormattedMessage id="mt.nindesshenfenrenzheng" />}
              </div>
            </div>
            <img src="/img/arrow-right.png" width={24} height={24} />
          </div> */}
          <div className="flex items-center justify-between py-[18px] px-4 cursor-pointer" onClick={handleJumpKycAuth}>
            <div className="flex items-center">
              <img src={`/img/${isKycAuth ? 'kyc-succ' : 'kyc-fail'}.png`} width={24} height={24} />
              <div className="pl-2 font-semibold text-base">
                {isKycAuth ? <FormattedMessage id="mt.nindeshenfenyirenzheng" /> : <FormattedMessage id="mt.nindesshenfenrenzheng" />}
              </div>
            </div>
            <div className="flex items-center">
              {!kycStatus && (
                <Button size="small" autoInsertSpace={false} className="mr-2 !font-semibold !rounded-lg !h-[30px] !text-sm !border-gray">
                  <FormattedMessage id="mt.wanshan" />
                  <ArrowRightOutlined className="ml-1" />
                </Button>
              )}
              <img src="/img/arrow-right.png" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
      <div className="pb-[26px]">
        <div className="text-gray font-dingpro-medium text-xl font-semibold">
          <FormattedMessage id="mt.zhanghuguanli" />
        </div>
        <div className="text-gray-secondary text-sm pb-[16px] pt-2">
          <FormattedMessage id="mt.zhanghuguanlitips" />
        </div>
        <div className="border border-gray-150 rounded-[7px] h-[64px] px-[26px] flex items-center justify-between">
          <div className="text-gray text-sm flex-1 border-r border-gray-150 flex items-center h-full">
            <span className="">
              <FormattedMessage id="mt.zhanghao" />：
            </span>
            <span className="pl-2">{isEmailRegisterWay ? formatEmail(currentUser?.account) : formatMobile(currentUser?.account)}</span>
          </div>
          <div className="flex items-center justify-between flex-1 pl-7">
            <span className="text-gray text-sm">
              <FormattedMessage id="mt.mima" />：<span className="font-medium">﹡﹡﹡﹡﹡﹡﹡﹡﹡﹡</span>
            </span>
            <ModifyPasswordModal
              trigger={
                <Button type="text">
                  <span className="text-gray text-sm font-semibold cursor-pointer">
                    <FormattedMessage id="mt.genggai" />
                  </span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <div className="pb-[26px]">
        <div className="text-gray font-dingpro-medium text-xl font-semibold">
          <FormattedMessage id="mt.anquanrenzhengfangshi" />
        </div>
        <div className="text-gray-secondary text-sm pb-[16px] pt-2">
          <FormattedMessage id="mt.anquanrenzhengfangshitips" />
        </div>
        <div className="border border-gray-150 rounded-[7px] py-[22px] px-[26px] flex items-center justify-between">
          <div className="text-gray text-sm">
            <span className="">
              <FormattedMessage id="mt.anquanleixing" />：
            </span>
            <span className="pl-2">{phone ? formatMobile(phone) : formatEmail(email)}</span>
          </div>
          {phone ? (
            <ModifyPhoneModal
              trigger={
                <Button type="text">
                  <span className="text-gray text-sm font-semibold cursor-pointer">
                    <FormattedMessage id="mt.genggai" />
                  </span>
                </Button>
              }
            />
          ) : (
            <ModifyEmailModal
              trigger={
                <Button type="text">
                  <span className="text-gray text-sm font-semibold cursor-pointer">
                    <FormattedMessage id="mt.genggai" />
                  </span>
                </Button>
              }
            />
          )}
        </div>
      </div>
      {/* 实名认证成功弹窗 */}
      <KycApproveInfoModal ref={kycSuccModalRef} />
    </PageContainer>
  )
}
