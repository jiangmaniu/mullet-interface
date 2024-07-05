import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useRef } from 'react'

import Modal from '@/components/Admin/ModalForm'
import Button from '@/components/Base/Button'
import FormCaptcha from '@/components/Form/Captcha'

type IProps = {
  trigger: JSX.Element
}

export default function ModifyPhoneModal({ trigger }: IProps) {
  const intl = useIntl()
  const pwdTipsRef = useRef<any>()
  const { initialState } = useModel('@@initialState')
  const [form] = Form.useForm()
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone

  return (
    <Modal
      trigger={trigger}
      width={460}
      title={<FormattedMessage id="mt.genggaidianhuahaoma" />}
      contentStyle={{ paddingInline: 20 }}
      onFinish={async (values) => {
        console.log('values', values)

        const { newPassword, confirmNewPassword } = values

        return false
      }}
      hiddenSubmitter
      form={form}
    >
      <ProFormText
        name="newPhone"
        label={intl.formatMessage({ id: 'mt.xinshoujihaoma' })}
        placeholder={intl.formatMessage({ id: 'mt.shurushoujihaoma' })}
        fieldProps={{
          size: 'large',
          style: { height: 42 }
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'mt.shurushoujihaoma' })
          }
        ]}
        formItemProps={{ style: { marginBottom: 24 } }}
      />
      <FormCaptcha
        name="newPhoneCode"
        onSend={async () => {
          return
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
          return
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
        <div className="flex items-center flex-1">
          <img src="/img/kefu.png" width={28} height={28} />
          <span className="text-sm text-gray cursor-pointer">
            <FormattedMessage id="mt.yanzhengshiyudaowenti" />?
          </span>
        </div>
        <Button className="!h-[44px] !w-[225px]" type="primary" block htmlType="submit">
          <FormattedMessage id="common.queren" />
        </Button>
      </div>
    </Modal>
  )
}
