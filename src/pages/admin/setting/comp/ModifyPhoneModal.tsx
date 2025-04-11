import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useRef, useState } from 'react'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import Modal from '@/components/Admin/ModalForm'
import Button from '@/components/Base/Button'
import FormCaptcha from '@/components/Form/Captcha'
import { editPhone, sendCustomPhoneCode, sendPhoneCode } from '@/services/api/user'
import { validateNonEmptyFields } from '@/utils/form'
import { message } from '@/utils/message'
import { goKefu } from '@/utils/navigator'

type IProps = {
  trigger: JSX.Element
}

export default function ModifyPhoneModal({ trigger }: IProps) {
  const intl = useIntl()
  const pwdTipsRef = useRef<any>()
  const { initialState } = useModel('@@initialState')
  const { fetchUserInfo } = useModel('user')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

  return (
    <Modal
      trigger={trigger}
      width={460}
      title={<FormattedMessage id="mt.genggaidianhuahaoma" />}
      contentStyle={{ paddingInline: 20 }}
      onFinish={async (values: any) => {
        console.log('values', values)
        const params = {
          ...values
        } as User.EditPhoneParams

        setSubmitLoading(true)

        const res = await editPhone(params)
        const success = res.success
        setSubmitLoading(false)

        if (success) {
          message.info(intl.formatMessage({ id: 'common.opSuccess' }))

          // 更新用户信息
          fetchUserInfo()
        }

        return success
      }}
      hiddenSubmitter
      form={form}
    >
      <div className="mb-6">
        <PhoneSelectFormItem
          names={['newPhone', 'phoneAreaCode']}
          form={form}
          label={intl.formatMessage({ id: 'mt.xinshoujihaoma' })}
          placeholder={intl.formatMessage({ id: 'mt.shurushoujihaoma' })}
          required
        />
      </div>
      <FormCaptcha
        name="newPhoneCode"
        onSend={async () => {
          const phone = form.getFieldValue('newPhone')
          const phoneAreaCode = form.getFieldValue('phoneAreaCode')
          if (!phone) {
            message.info(intl.formatMessage({ id: 'mt.qingshuruxinshouji' }))
            throw {}
          }
          const res = await sendCustomPhoneCode({ phone, phoneAreaCode })
          return res.success
        }}
        label={intl.formatMessage({ id: 'mt.xinshoujiyanzheng' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'mt.shuruyanzhengma' })
          }
        ]}
        fieldProps={{ placeholder: intl.formatMessage({ id: 'mt.shuruyanzhengma' }) }}
        formItemProps={{ style: { marginBottom: 24 } }}
      />
      <FormCaptcha
        name="oldPhoneCode"
        onSend={async () => {
          const res = await sendPhoneCode()
          return res.success
        }}
        label={intl.formatMessage({ id: 'mt.yuanshishoujiyanzheng' })}
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
