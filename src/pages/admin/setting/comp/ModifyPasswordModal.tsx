import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'

import Modal from '@/components/Admin/ModalForm'
import Button from '@/components/Base/Button'
import FormCaptcha from '@/components/Form/Captcha'
import PwdTips from '@/components/PwdTips'
import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { forgetPasswordEmail, forgetPasswordPhone, sendEmailCode, sendPhoneCode } from '@/services/api/user'
import { regPassword } from '@/utils'
import { message } from '@/utils/message'
import { goKefu, onLogout, push } from '@/utils/navigator'
import { md5 } from 'js-md5'

type IProps = {
  trigger: JSX.Element
}

export default function ModifyPasswordModal({ trigger }: IProps) {
  const intl = useIntl()
  const pwdTipsRef = useRef<any>()
  const { isEmailRegisterWay } = useModel('user')
  const { initialState } = useModel('@@initialState')
  const [form] = Form.useForm()
  const newPassword = Form.useWatch('newPassword', form)
  const [submitLoading, setSubmitLoading] = useState(false)
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone as string
  const email = currentUser?.userInfo?.email as string
  const account = currentUser?.account as string
  const isKycAuth = currentUser?.isKycAuth

  const isPhoneCheck = phone && isKycAuth

  const onSend = async () => {
    let reqFn = isPhoneCheck ? sendPhoneCode : sendEmailCode

    if (getEnv().SKIP_KYC_STEP_ONE === '1') {
      reqFn = stores.global.registerWay === 'PHONE' ? sendPhoneCode : sendEmailCode
    }

    const res = await reqFn()
    return res.success
  }

  const [sendLabel, setSendLabel] = useState('')

  const setSendLabelValue = useCallback(() => {
    let value = isPhoneCheck ? intl.formatMessage({ id: 'mt.shoujiyanzheng' }) : intl.formatMessage({ id: 'mt.yuanshiyouxiangyanzheng' })

    if (getEnv().SKIP_KYC_STEP_ONE === '1') {
      value =
        stores.global.registerWay === 'PHONE'
          ? intl.formatMessage({ id: 'mt.shoujiyanzheng' })
          : intl.formatMessage({ id: 'mt.yuanshiyouxiangyanzheng' })
    }

    setSendLabel(value)
  }, [stores.global.registerWay, intl, isPhoneCheck])

  useEffect(() => {
    setSendLabelValue()
  }, [setSendLabelValue])

  return (
    <Modal
      trigger={trigger}
      width={460}
      title={<FormattedMessage id="mt.xiugaimima" />}
      contentStyle={{ paddingInline: 20 }}
      onFinish={async (values: any) => {
        const { newPassword, confirmNewPassword, validateCode } = values

        if (newPassword !== confirmNewPassword) {
          message.info(intl.formatMessage({ id: 'mt.xinmimashurubuyizhi' }))
          return
        }

        setSubmitLoading(true)
        const reqFn = isPhoneCheck ? forgetPasswordPhone : forgetPasswordEmail
        const res = await reqFn({
          emailOrPhone: currentUser?.account as string,
          newPassword: md5(newPassword),
          validateCode
        })
        setSubmitLoading(false)
        const success = res.success

        if (success) {
          message.info(intl.formatMessage({ id: 'common.opSuccess' }))

          setTimeout(() => {
            push('/user/login')
            onLogout()
          }, 500)
        }

        return success
      }}
      hiddenSubmitter
      form={form}
    >
      <div>
        <ProFormText.Password
          name="newPassword"
          label={intl.formatMessage({ id: 'mt.xinmima' })}
          placeholder={intl.formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' })}
          fieldProps={{
            size: 'large',
            style: { height: 42 },
            onFocus: () => {
              pwdTipsRef?.current?.show()
            },
            onBlur: () => {
              pwdTipsRef?.current?.hide()
            }
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' }),
              pattern: regPassword
            }
          ]}
          formItemProps={{ style: { marginBottom: 24 } }}
        />
        <div className="my-4">
          <PwdTips pwd={newPassword} ref={pwdTipsRef} />
        </div>
      </div>
      <ProFormText.Password
        name="confirmNewPassword"
        label={intl.formatMessage({ id: 'mt.querenxinmima' })}
        placeholder={intl.formatMessage({ id: 'mt.zaicishuruxinmima' })}
        fieldProps={{
          size: 'large',
          style: { height: 42 }
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'mt.zaicishuruxinmima' })
          }
        ]}
        formItemProps={{ style: { marginBottom: 24 } }}
      />
      <FormCaptcha
        name="validateCode"
        onSend={onSend}
        label={sendLabel}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'mt.shuruyanzhengma' })
          }
        ]}
        fieldProps={{ placeholder: intl.formatMessage({ id: 'mt.shuruyanzhengma' }) }}
        formItemProps={{ style: { marginBottom: 24 } }}
      />
      <div className="flex items-center justify-between gap-x-5 mt-8">
        <div className="flex items-center flex-1" onClick={goKefu}>
          <img src="/img/kefu.png" width={28} height={28} />
          <span className="text-sm text-primary cursor-pointer">
            <FormattedMessage id="mt.yanzhengshiyudaowenti" />?
          </span>
        </div>
        <Button className="!h-[44px] !w-[225px]" type="primary" block htmlType="submit" loading={submitLoading}>
          <FormattedMessage id="common.queren" />
        </Button>
      </div>
    </Modal>
  )
}
