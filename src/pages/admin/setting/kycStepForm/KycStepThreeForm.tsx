import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import { submitSeniorAuth } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'

import { getEnv } from '@/env'
import useKycAuth from '@/hooks/useKycAuth'
import { cn } from '@/utils/cn'
import { validateNonEmptyFields } from '@/utils/form'
import { push } from '@/utils/navigator'
import UploadIdcard from './UploadIdcard'

export default function KycStepThreeForm({ onSuccess, onClose }: { onSuccess: () => void; onClose?: () => void }) {
  const [step, setStep] = useState<'ONE' | 'TWO' | 'THREE' | 'FOUR'>('ONE') // 步骤
  const [form] = Form.useForm()
  const { fetchUserInfo, isEmailRegisterWay } = useModel('user')
  const [submitLoading, setSubmitLoading] = useState(false)
  const { initialState } = useModel('@@initialState')
  const intl = useIntl()
  const currentUser = initialState?.currentUser
  const userInfo = currentUser?.userInfo

  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态

  const { kycAuthType } = useKycAuth()
  const KYC_FACE = !!getEnv()?.KYC_FACE || kycAuthType === 'TENCENT_FACE_AUTH' // 开启人脸识别

  const authImgsUrl = Form.useWatch('authImgsUrl', form)

  useEffect(() => {
    // 手机、邮箱已绑定，直接跳过
    if (userInfo?.phone && userInfo?.email && kycStatus !== 'TODO') {
      setStep('TWO')
    }
    if (kycStatus === 'TODO') {
      setStep('FOUR')
    }
  }, [userInfo])

  // 提交表单
  const handleSubmit = async () => {
    const formData = form.getFieldsValue()

    if (!formData.authImgsUrl) {
      return message.info(intl.formatMessage({ id: 'common.qingshangchuantupian' }))
    }

    setSubmitLoading(true)

    // 提交kyc认证
    const res = await submitSeniorAuth({ authImgsUrl: formData.authImgsUrl })

    setSubmitLoading(false)

    if (res.success) {
      message.info(intl.formatMessage({ id: 'mt.tijiaochenggong' }))

      // 刷新用户信息
      await fetchUserInfo()

      onSuccess?.()
    }
  }

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

  const renderThreeStep = () => {
    return (
      <div className="mt-3">
        {KYC_FACE ? (
          <div className={cn('flex h-[200px] items-center justify-center  w-full')}>
            <div className={cn('border w-[380px] border-dashed border-[#6A7073]  rounded-lg overflow-hidden px-[20px] py-[25px]')}>
              <div className="flex flex-row items-center justify-start gap-[28px]">
                <img src="/img/webapp/face.png" width={100} height={100} />
                <div className="flex flex-col items-start justify-start gap-2">
                  <span className="text-sm font-extrabold">{intl.formatMessage({ id: 'common.wenxintishi' })}</span>
                  <span className="text-xs">{intl.formatMessage({ id: 'mt.renlianshibietishitips2' })}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-primary text-sm font-semibold mb-3">
              <FormattedMessage id="mt.shangchuanzhengjian" />
            </div>
            <div className="flex items-center justify-center">
              <div className="w-[488px] h-[236px]">
                <UploadIdcard form={form} />
                <span className="text-xs text-red-500">
                  <FormattedMessage id="mt.shangchuanzhaopianbuyaochaoguo" values={{ value: '5MB' }} />
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row items-center gap-4">
          <Button
            type="primary"
            style={{ height: 46, marginTop: 10 }}
            block
            onClick={() => {
              push('/deposit')
            }}
          >
            <FormattedMessage id="mt.qurujin" />
          </Button>

          {KYC_FACE ? (
            <Button type="default" style={{ height: 46, marginTop: 10 }} block onClick={onClose}>
              <FormattedMessage id="mt.wozhidaole" />
            </Button>
          ) : (
            <Button
              type={authImgsUrl ? 'primary' : 'default'}
              style={{ height: 46, marginTop: 10 }}
              block
              onClick={handleSubmit}
              disabled={!authImgsUrl}
              loading={submitLoading}
            >
              <FormattedMessage id="common.tijiao" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <>
        <div className="text-primary pb-3 font-medium">
          <FormattedMessage id="mt.renzhengxingming" />:
          {intl.locale === 'zh-TW'
            ? `${currentUser?.lastName || 'lastName'}${currentUser?.firstName || 'firstName'}`
            : `${currentUser?.firstName || 'firstName'} ${currentUser?.lastName || 'lastName'}`}
        </div>
        <div className="mb-5">
          <div className="text-primary font-semibold text-[22px]">
            {KYC_FACE ? <FormattedMessage id="pages.userCenter.renlianshibie" /> : <FormattedMessage id="mt.pingzhengrenzheng" />}
          </div>
          <div className="text-secondary text-sm pt-1">
            {KYC_FACE ? (
              <FormattedMessage id="pages.userCenter.weiquebaonindezijinanquan" />
            ) : (
              <FormattedMessage id="mt.pingzhengrenzhengtips" />
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div
        className="w-full h-10 px-5 text-blue align-middle flex items-center"
        style={{
          backgroundColor: 'rgba(24, 62, 252, 0.08)'
        }}
      >
        ◆&nbsp; <FormattedMessage id="mt.ninyiwanchengchujirenzheng" />
      </div>
      <div className=" p-5">
        <ProForm
          onFinish={async (values: any) => {
            console.log('values', values)

            return
          }}
          submitter={false}
          layout="vertical"
          form={form}
        >
          {renderHeader()}
          {renderThreeStep()}
        </ProForm>
      </div>
    </>
  )
}
