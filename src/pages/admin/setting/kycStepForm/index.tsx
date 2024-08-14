import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import ProFormText from '@/components/Admin/Form/ProFormText'
import SelectCountryFormItem from '@/components/Admin/Form/SelectCountryFormItem'
import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Hidden from '@/components/Base/Hidden'
import FormCaptcha from '@/components/Form/Captcha'
import ValidateCodeInput from '@/components/Form/ValidateCodeInput'
import { submitKycAuth } from '@/services/api/crm/kycAuth'
import { bindEmail, bindPhone } from '@/services/api/user'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import UploadIdcard from './UploadIdcard'

export default function KycStepForm() {
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
    if (userInfo?.phone && userInfo?.email) {
      setStep('TWO')
    }
  }, [userInfo])

  // 提交表单
  const handleSubmit = async () => {
    const formData = form.getFieldsValue()
    const { phone, phoneAreaCode, validateCode, countryName, ...values } = formData || {}
    console.log('formData', formData)

    if (!formData.authImgsUrl) {
      return message.info(intl.formatMessage({ id: 'mt.qingshangchuantupian' }))
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
        push('/setting')
        setStep('ONE')
      }, 200)
    }
  }

  // 提交手机或邮箱绑定
  const handleSubmitTwoStep = async () => {
    let bindSuccess: any = false
    if (isBindPhone) {
      const res = await bindPhone({
        phone,
        phoneCode: validateCode
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

      setStep('TWO')
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
              label={<FormattedMessage id="mt.shoujihaoma" />}
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
              label={intl.formatMessage({ id: 'mt.dianziyouxiang' })}
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
            <FormattedMessage id="mt.xiayibu" />
          </Button>
        </div>
      </div>
    )
  }

  const renderTwoStep = () => {
    return (
      <div>
        <SelectCountryFormItem
          form={form}
          height={40}
          label={<span className="text-sm font-semibold text-primary">1.{intl.formatMessage({ id: 'mt.xuanzeguojia' })}</span>}
        />
        <div className="grid grid-cols-2 gap-x-[18px] my-[22px]">
          <ProFormText
            name="lastName"
            label={intl.formatMessage({ id: 'mt.xing' })}
            placeholder={intl.formatMessage({ id: 'mt.shuruxingshi' })}
            required
          />
          <ProFormText
            name="firstName"
            label={intl.formatMessage({ id: 'mt.ming' })}
            placeholder={intl.formatMessage({ id: 'mt.shurumingzi' })}
            required
          />
        </div>
        <div className="text-primary text-sm font-semibold mb-1">
          2.
          <FormattedMessage id="mt.xuanzezhengjianleixing" />
        </div>
        <div className="flex flex-col mt-4">
          {idCardTypeOptions.map((item, idx) => {
            return (
              <div
                className="flex items-center mb-5 cursor-pointer"
                key={idx}
                onClick={() => {
                  setIdentificationType(item.key)
                }}
              >
                <img src={`/img/${item.key === identificationType ? '' : 'un'}checked-icon.png`} width={20} height={20} />
                <span className="text-xs text-primary pl-3">{item.label}</span>
              </div>
            )
          })}
        </div>
        <ProFormText
          label={intl.formatMessage({ id: 'mt.zhengjianhao' })}
          placeholder={intl.formatMessage({ id: 'mt.shurunindezhengjianhaoma' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'mt.shurunindezhengjianhaoma' })
            }
          ]}
          name="identificationCode"
        />
        <Button
          type="primary"
          style={{ height: 46 }}
          block
          className="!mt-10"
          disabled={!lastName || !firstName || !identificationCode || !country}
          onClick={() => {
            setStep('THREE')
          }}
        >
          <FormattedMessage id="mt.xiayibu" />
        </Button>
      </div>
    )
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
          <FormattedMessage id="mt.tijiao" />
        </Button>
      </div>
    )
  }

  const renderFourStep = () => {
    return (
      <div className="mt-3">
        <div className="text-primary text-sm font-semibold mb-3">
          <FormattedMessage id="mt.shenhezhong" />
        </div>

        <div className="flex justify-center">
          <div className="flex items-center justify-center flex-col w-[320px]">
            <img src="/img/shenhezhong.png" width={136} height={136} />
            <div className="my-4 text-primary font-semibold text-[22px]">
              <FormattedMessage id="mt.shenfenrenzhengshenhezhong" />
            </div>
            <div className="text-secondary text-base">
              <FormattedMessage id="mt.shenfenrenzhengshenhezhongtips" />
            </div>
            <Button
              type="primary"
              style={{ height: 46, width: 220, marginTop: 50 }}
              block
              onClick={() => {
                setTimeout(() => {
                  setStep('ONE')
                }, 200)

                push('/setting')
              }}
            >
              <FormattedMessage id="mt.haode" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <>
        {step === 'ONE' && (
          <div>
            <div className="text-primary font-semibold text-[22px]">
              {isBindPhone ? <FormattedMessage id="mt.bangdingshouji" /> : <FormattedMessage id="mt.bangdingyouxiang" />}
            </div>
            <div className="text-secondary text-sm pt-1">
              <FormattedMessage id="mt.yongyuyanzhengnidezhanghu" />
            </div>
          </div>
        )}
        {step === 'TWO' && (
          <div>
            <div className="text-primary font-semibold text-[22px]">
              <FormattedMessage id="mt.shenfenrenzheng" />
            </div>
            <div className="text-secondary text-sm pt-1">
              <FormattedMessage id="mt.shenfenrenzhengtips" />
            </div>
          </div>
        )}
        {step === 'THREE' && (
          <div>
            <div className="text-primary font-semibold text-[22px]">
              <FormattedMessage id="mt.pingzhengrenzheng" />
            </div>
            <div className="text-secondary text-sm pt-1">
              <FormattedMessage id="mt.pingzhengrenzhengtips" />
            </div>
          </div>
        )}
        <div className="mt-[50px] mb-10 px-[20px]">
          <div className="flex items-center justify-between">
            {steps.map((item, idx) => {
              const isActive = activeSteps.includes(item.key)
              return (
                <div className="flex items-center relative w-[130px] justify-center" key={idx}>
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={classNames(
                        'w-[56px] h-[56px] rounded-full flex items-center justify-center',
                        isActive ? 'bg-brand' : 'bg-white border border-gray-250'
                      )}
                    >
                      <img src={isActive ? item.activeIcon : item.icon} width={30} height={30} />
                    </div>
                    <div
                      className={classNames(
                        'text-sm pt-4 truncate w-[130px] text-center',
                        isActive ? 'text-primary font-semibold' : 'text-secondary'
                      )}
                    >
                      {item.desc}
                    </div>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div
                      className={classNames(
                        'h-1 w-[80px] absolute top-[30px] left-[116px] rounded-sm',
                        activeLineStep.includes(item.key) ? 'bg-brand' : 'bg-gray-185'
                      )}
                    ></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  return (
    <PageContainer pageBgColorMode="white" backTitle={<FormattedMessage id="mt.shezhi" />}>
      <div className="flex justify-center">
        <div className="w-[596px] bg-white rounded-xl border border-gray-180 p-7">
          <ProForm
            onFinish={async (values: any) => {
              console.log('values', values)

              return
            }}
            submitter={false}
            layout="vertical"
            form={form}
          >
            {step !== 'FOUR' && renderHeader()}
            <Hidden show={step === 'ONE'}>{renderOneStep()}</Hidden>
            <Hidden show={step === 'TWO'}>{renderTwoStep()}</Hidden>
            <Hidden show={step === 'THREE'}>{renderThreeStep()}</Hidden>
            <Hidden show={step === 'FOUR'}>{renderFourStep()}</Hidden>
          </ProForm>
        </div>
      </div>
    </PageContainer>
  )
}
