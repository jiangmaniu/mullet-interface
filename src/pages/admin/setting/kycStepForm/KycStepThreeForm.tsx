import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import { submitSeniorAuth } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'

import { push } from '@/utils/navigator'
import UploadIdcard from './UploadIdcard'

export default function KycStepForm({ onSuccess }: { onSuccess: () => void }) {
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

  const renderThreeStep = () => {
    return (
      <div className="mt-3">
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
            <FormattedMessage id="mt.pingzhengrenzheng" />
          </div>
          <div className="text-secondary text-sm pt-1">
            <FormattedMessage id="mt.pingzhengrenzhengtips" />
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
