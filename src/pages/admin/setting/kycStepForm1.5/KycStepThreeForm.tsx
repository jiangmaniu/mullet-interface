import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useState } from 'react'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import { submitSeniorAuth } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'

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

  const phone = Form.useWatch('phone', form)
  const phoneAreaCode = Form.useWatch('phoneAreaCode', form)
  const validateCode = Form.useWatch('validateCode', form)
  const email = Form.useWatch('email', form)

  const identificationCode = Form.useWatch('identificationCode', form)
  const firstName = Form.useWatch('firstName', form)
  const lastName = Form.useWatch('lastName', form)
  const country = Form.useWatch('country', form)

  const isBindPhone = !userInfo?.phone
  const [identificationType, setIdentificationType] = useState<API.IdentificationType>('ID_CARD') // 证件类型

  // 证件类型
  const idCardTypeOptions: Array<{ key: API.IdentificationType; label: string }> = [
    {
      key: 'ID_CARD',
      label: intl.formatMessage({ id: 'mt.shenfenzheng' })
    },
    {
      key: 'PASSPORT',
      label: intl.formatMessage({ id: 'mt.huzhao' })
    }
  ]

  const steps = [
    {
      key: 'ONE',
      icon: '/img/kyc-phone.png',
      activeIcon: '/img/kyc-phone.png',
      desc: <FormattedMessage id="mt.bangdingshoujihuoyouxiang" />
    },
    {
      key: 'TWO',
      icon: '/img/kyc-user.png',
      activeIcon: '/img/kyc-user-white.png',
      desc: <FormattedMessage id="mt.shenfenrenzheng" />
    },
    {
      key: 'THREE',
      icon: '/img/kyc-idcard.png',
      activeIcon: '/img/kyc-idcard-white.png',
      desc: <FormattedMessage id="mt.pingzhengrenzheng" />
    }
  ]
  const idx = steps.findIndex((v) => v.key === step)
  const activeSteps = steps.slice(0, idx + 1).map((item) => item.key)
  const activeLineStep = steps.slice(0, idx).map((item) => item.key)

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

      setTimeout(() => {
        setStep('FOUR')
      }, 100)
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
            <div className="w-[304px] h-[168px]">
              <UploadIdcard form={form} />
            </div>
          </div>
        </div>
        <Button type="primary" style={{ height: 46, marginTop: 70 }} block onClick={handleSubmit} loading={submitLoading}>
          <FormattedMessage id="common.tijiao" />
        </Button>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <>
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
    <PageContainer pageBgColorMode="white" backTitle={<FormattedMessage id="mt.shezhi" />}>
      <div className="flex justify-center">
        {/* <div className="w-[596px] bg-white rounded-xl border border-gray-180 p-7"> */}
        <div className="w-[596px] bg-white rounded-xl px-7">
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
      </div>
    </PageContainer>
  )
}
