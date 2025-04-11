import { ProForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useRef, useState } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import SelectCountryFormItem from '@/components/Admin/Form/SelectCountryFormItem'
import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import { submitBaseAuth } from '@/services/api/crm/kycAuth'

import { DEFAULT_AREA_CODE } from '@/constants'
import { getEnv } from '@/env'
import { validateNonEmptyFields } from '@/utils/form'
import { message } from '@/utils/message'

export default function KycStepTwoForm({ onSuccess }: { onSuccess: () => void }) {
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
    }
  ]

  !getEnv()?.ID_CARD_ONLY &&
    idCardTypeOptions.push({
      key: 'PASSPORT',
      label: intl.formatMessage({ id: 'mt.huzhao' })
    })

  useEffect(() => {
    // 手机、邮箱已绑定，直接跳过
    if (userInfo?.phone && userInfo?.email && kycStatus !== 'TODO') {
      setStep('TWO')
    }
    if (kycStatus === 'TODO') {
      setStep('FOUR')
    }
  }, [userInfo])

  // 提交手机或邮箱绑定
  const handleSubmitTwoStep = async () => {
    form.validateFields().then((values) => {
      // submitBaseAuth
      submitBaseAuth({ ...values, identificationType }).then((res) => {
        if (res.success) {
          message.info(intl.formatMessage({ id: 'mt.tijiaochenggong' }))
          // 刷新用户信息
          fetchUserInfo()

          onSuccess()

          return
        }
      })
    })
  }

  const { list } = useModel('areaList')
  const defaultAreaCode = list?.find((item) => item.areaCode === DEFAULT_AREA_CODE)

  const renderTwoStep = () => {
    return (
      <div>
        <SelectCountryFormItem
          form={form}
          height={40}
          defaultAreaCode={defaultAreaCode}
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
            handleSubmitTwoStep()
          }}
        >
          <FormattedMessage id="common.queren" />
        </Button>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <>
        <div className="mb-5">
          <div className="text-primary font-semibold text-[22px]">
            <FormattedMessage id="mt.shenfenrenzheng" />
          </div>
          <div className="text-secondary text-sm pt-1">
            <FormattedMessage id="mt.shenfenrenzhengtips" />
          </div>
        </div>
      </>
    )
  }

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

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
            {step !== 'FOUR' && renderHeader()}
            {renderTwoStep()}
          </ProForm>
        </div>
      </div>
    </PageContainer>
  )
}
