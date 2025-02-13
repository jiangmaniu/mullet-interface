import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useRef, useState } from 'react'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Hidden from '@/components/Base/Hidden'
import FormCaptcha from '@/components/Form/Captcha'
import ValidateCodeInput from '@/components/Form/ValidateCodeInput'
import { submitKycAuth } from '@/services/api/crm/kycAuth'
import { bindEmail, bindPhone } from '@/services/api/user'
import { message } from '@/utils/message'

export default function BindEmailPhoneForm(props: { onSuccess?: () => void }) {
  const [step, setStep] = useState<'ONE' | 'TWO' | 'THREE' | 'FOUR'>('ONE') // 步骤
  const [form] = Form.useForm()
  const { fetchUserInfo, isEmailRegisterWay } = useModel('user')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showValidateCodeInput, setShowValidateCodeInput] = useState(false) // 是否展示验证码输入框
  const { initialState } = useModel('@@initialState')
  const intl = useIntl()
  const validateCodeInputRef = useRef<any>()
  const currentUser = initialState?.currentUser
  const userInfo = currentUser?.userInfo

  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态

  const phone = Form.useWatch('phone', form)
  const phoneAreaCode = Form.useWatch('phoneAreaCode', form)
  const validateCode = Form.useWatch('validateCode', form)
  const email = Form.useWatch('email', form)

  const isBindPhone = !userInfo?.phone
  const [identificationType, setIdentificationType] = useState<API.IdentificationType>('ID_CARD') // 证件类型

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
    const { phone, phoneAreaCode, validateCode, countryName, ...values } = formData || {}
    console.log('formData', formData)

    if (!formData.authImgsUrl) {
      return message.info(intl.formatMessage({ id: 'common.qingshangchuantupian' }))
    }

    const params = {
      ...values,
      identificationType
    }

    console.log('params', params)

    setSubmitLoading(true)

    // 提交kyc认证
    const res = await submitKycAuth(params)

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

  // 提交手机或邮箱绑定
  const handleSubmitTwoStep = async () => {
    let bindSuccess: any = false
    if (isBindPhone) {
      const res = await bindPhone({
        phone,
        phoneCode: validateCode,
        phoneAreaCode
      })
      bindSuccess = res.success
    } else {
      const res = await bindEmail({
        email,
        emailCode: validateCode
      })
      bindSuccess = res.success
    }
    if (bindSuccess) {
      // 刷新用户信息
      await fetchUserInfo()

      props?.onSuccess?.()
    }
  }

  const renderOneStep = () => {
    return (
      <div>
        <div className="mb-3">
          <div className="text-primary font-semibold text-[22px]">
            {isBindPhone ? <FormattedMessage id="mt.shurunindeshoujihaoma" /> : <FormattedMessage id="mt.qingshurunindeyouxiang" />}
          </div>
          <div className="text-secondary text-sm pt-1 mb-4">
            <FormattedMessage id="mt.yongyuyanzhengnidezhanghu" />
          </div>
          {isBindPhone ? (
            <PhoneSelectFormItem
              names={['phone', 'phoneAreaCode']}
              form={form}
              label={<FormattedMessage id="common.shoujihaoma" />}
              required={false}
              height={44}
              dropdownWidth={540}
              onSend={async () => {
                if (!phone) {
                  return message.info(intl.formatMessage({ id: 'mt.qingshurushoujihao' }))
                }
                if (!phoneAreaCode) {
                  return message.info(intl.formatMessage({ id: 'mt.qingxuanzequhao' }))
                }
                const success = await validateCodeInputRef.current?.sendCode({
                  emailOrPhone: phone,
                  phoneAreaCode
                })

                if (success) {
                  setShowValidateCodeInput(true)
                }
                return success
              }}
            />
          ) : (
            <FormCaptcha
              name="email"
              label={intl.formatMessage({ id: 'common.dianziyouxiang' })}
              fieldProps={{ placeholder: intl.formatMessage({ id: 'mt.shuruyouxiangyanzhengma' }) }}
              formItemProps={{ style: { marginBottom: 24 } }}
              onSend={async () => {
                if (!email) {
                  message.info(intl.formatMessage({ id: 'mt.qingshuruyouxiang' }))
                  throw {}
                }
                const success = await validateCodeInputRef.current?.sendCode({
                  emailOrPhone: email
                })

                if (success) {
                  setShowValidateCodeInput(true)
                }

                return success
              }}
            />
          )}
          {/* 发送验证码后，展示验证码输入框 */}
          <Hidden show={showValidateCodeInput}>
            <div className="border border-gray-150 rounded-lg mt-7">
              <ValidateCodeInput
                sendType={isBindPhone ? 'PHONE' : 'EMIAL'}
                form={form}
                ref={validateCodeInputRef}
                showReSendBtn={false}
                showCountDown={false}
                style={{ padding: 20 }}
              />
            </div>
          </Hidden>
        </div>
        <div className="mt-[60px]">
          <div className="flex items-center justify-center flex-1">
            <img src="/img/kefu.png" width={28} height={28} />
            <span className="text-sm text-primary cursor-pointer">
              <FormattedMessage id="mt.yanzhengshiyudaowenti" />?
            </span>
          </div>
          <Button
            type="primary"
            style={{ height: 46, marginTop: 16 }}
            block
            disabled={isBindPhone ? !phone || !phoneAreaCode || !validateCode : !email || !validateCode}
            onClick={handleSubmitTwoStep}
          >
            <FormattedMessage id="common.xiayibu" />
          </Button>
        </div>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <>
        <div>
          <div className="text-primary font-semibold text-[22px]">
            {isBindPhone ? <FormattedMessage id="mt.bangdingshouji" /> : <FormattedMessage id="mt.bangdingyouxiang" />}
          </div>
          <div className="text-secondary text-sm pt-1">
            <FormattedMessage id="mt.yongyuyanzhengnidezhanghu" />
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
            {renderOneStep()}
          </ProForm>
        </div>
      </div>
    </PageContainer>
  )
}
