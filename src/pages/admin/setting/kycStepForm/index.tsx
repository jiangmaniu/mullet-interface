import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import classNames from 'classnames'
import { useRef, useState } from 'react'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import ProFormText from '@/components/Admin/Form/ProFormText'
import SelectCountryFormItem from '@/components/Admin/Form/SelectCountryFormItem'
import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Hidden from '@/components/Base/Hidden'
import FormCaptcha from '@/components/Form/Captcha'
import ValidateCodeInput from '@/components/Form/ValidateCodeInput'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import UploadIdcard from './UploadIdcard'

export default function KycStepForm() {
  const [step, setStep] = useState<'ONE' | 'TWO' | 'THREE' | 'FOUR'>('ONE') // 步骤
  const [form] = Form.useForm()
  const { initialState } = useModel('@@initialState')
  const intl = useIntl()
  const validateCodeInputRef = useRef<any>()
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone
  const emailOrPhone = Form.useWatch('phone', form)
  const phoneAreaCode = Form.useWatch('phoneAreaCode', form)
  const validateCode = Form.useWatch('validateCode', form)

  const identificationCode = Form.useWatch('identificationCode', form)
  const firstName = Form.useWatch('firstName', form)
  const lastName = Form.useWatch('lastName', form)
  const country = Form.useWatch('country', form)

  const isBindPhone = !phone
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
      desc: <FormattedMessage id="mt.bangdingshouji" />
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

  // 提交表单
  const handleSubmit = () => {
    console.log('formData', form.getFieldsValue())

    const formData = form.getFieldsValue()

    if (!formData.authImgsUrl) {
      return message.info(intl.formatMessage({ id: 'mt.qingshangchuantupian' }))
    }

    // @TODO
    const params = {
      ...formData,
      identificationType
    }

    // setTimeout(() => {
    //   setStep('ONE')
    // }, 200)
  }

  const renderOneStep = () => {
    return (
      <div>
        <div className="mb-3">
          <div className="text-gray font-semibold text-[22px]">
            {isBindPhone ? <FormattedMessage id="mt.shurunindeshoujihaoma" /> : <FormattedMessage id="mt.qingshurunindeyouxiang" />}
          </div>
          <div className="text-gray-secondary text-sm pt-1 mb-4">
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
                if (!emailOrPhone) {
                  return message.info(intl.formatMessage({ id: 'mt.qingshurushoujihao' }))
                }
                if (!phoneAreaCode) {
                  return message.info(intl.formatMessage({ id: 'mt.qingxuanzequhao' }))
                }
                return validateCodeInputRef.current?.sendCode({
                  emailOrPhone,
                  phoneAreaCode
                })
              }}
            />
          ) : (
            <FormCaptcha
              name="validateCode"
              label={intl.formatMessage({ id: 'mt.dianziyouxiang' })}
              fieldProps={{ placeholder: intl.formatMessage({ id: 'mt.shuruyouxiangyanzhengma' }) }}
              formItemProps={{ style: { marginBottom: 24 } }}
              onSend={async () => {
                return
              }}
            />
          )}
          <div className="border border-gray-150 rounded-lg mt-7">
            <ValidateCodeInput
              sendType={isBindPhone ? 'PHONE' : 'EMIAL'}
              form={form}
              ref={validateCodeInputRef}
              showReSendBtn={false}
              style={{ padding: 20 }}
            />
          </div>
        </div>
        <div className="mt-[60px]">
          <div className="flex items-center justify-center flex-1">
            <img src="/img/kefu.png" width={28} height={28} />
            <span className="text-sm text-gray cursor-pointer">
              <FormattedMessage id="mt.yanzhengshiyudaowenti" />?
            </span>
          </div>
          <Button
            type="primary"
            style={{ height: 46, marginTop: 16 }}
            block
            disabled={isBindPhone ? !emailOrPhone || !phoneAreaCode || !validateCode : !emailOrPhone || !validateCode}
            onClick={() => {
              setStep('TWO')
            }}
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
          label={<span className="text-sm font-semibold text-gray">1.{intl.formatMessage({ id: 'mt.xuanzeguojia' })}</span>}
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
        <div className="text-gray text-sm font-semibold mb-1">
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
                <span className="text-xs text-gray pl-3">{item.label}</span>
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
          <div className="text-gray text-sm font-semibold mb-3">
            <FormattedMessage id="mt.shangchuanzhengjian" />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-[304px] h-[168px]">
              <UploadIdcard form={form} />
            </div>
          </div>
        </div>
        <Button type="primary" style={{ height: 46, marginTop: 70 }} block onClick={handleSubmit}>
          <FormattedMessage id="mt.tijiao" />
        </Button>
      </div>
    )
  }

  const renderFourStep = () => {
    return (
      <div className="mt-3">
        <div className="text-gray text-sm font-semibold mb-3">
          <FormattedMessage id="mt.shenhezhong" />
        </div>

        <div className="flex justify-center">
          <div className="flex items-center justify-center flex-col w-[320px]">
            <img src="/img/shenhezhong.png" width={136} height={136} />
            <div className="my-4 text-gray font-semibold text-[22px]">
              <FormattedMessage id="mt.shenfenrenzhengshenhezhong" />
            </div>
            <div className="text-gray-secondary text-base">
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
            <div className="text-gray font-semibold text-[22px]">
              {isBindPhone ? <FormattedMessage id="mt.bangdingshouji" /> : <FormattedMessage id="mt.bangdingyouxiang" />}
            </div>
            <div className="text-gray-secondary text-sm pt-1">
              <FormattedMessage id="mt.yongyuyanzhengnidezhanghu" />
            </div>
          </div>
        )}
        {step === 'TWO' && (
          <div>
            <div className="text-gray font-semibold text-[22px]">
              <FormattedMessage id="mt.shenfenrenzheng" />
            </div>
            <div className="text-gray-secondary text-sm pt-1">
              <FormattedMessage id="mt.shenfenrenzhengtips" />
            </div>
          </div>
        )}
        {step === 'THREE' && (
          <div>
            <div className="text-gray font-semibold text-[22px]">
              <FormattedMessage id="mt.pingzhengrenzheng" />
            </div>
            <div className="text-gray-secondary text-sm pt-1">
              <FormattedMessage id="mt.pingzhengrenzhengtips" />
            </div>
          </div>
        )}
        <div className="mt-[50px] mb-10 px-[50px]">
          <div className="flex items-center">
            {steps.map((item, idx) => {
              const isActive = activeSteps.includes(item.key)
              return (
                <div className="flex items-center justify-between" key={idx}>
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={classNames(
                        'w-[56px] h-[56px] rounded-full flex items-center justify-center',
                        isActive ? 'bg-primary' : 'bg-white border border-gray-250'
                      )}
                    >
                      <img src={isActive ? item.activeIcon : item.icon} width={30} height={30} />
                    </div>
                    <div className={classNames('text-sm pt-4', isActive ? 'text-gray font-semibold' : 'text-gray-secondary')}>
                      {item.desc}
                    </div>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div
                      className={classNames(
                        'h-1 w-[71px] mx-6 relative -top-[14px] rounded-sm',
                        activeLineStep.includes(item.key) ? 'bg-primary' : 'bg-gray-185'
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
