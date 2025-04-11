import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useRef, useState } from 'react'

import Modal from '@/components/Admin/ModalForm'
import Button from '@/components/Base/Button'
import FormCaptcha from '@/components/Form/Captcha'
import { editEmail, sendCustomEmailCode, sendEmailCode } from '@/services/api/user'
import { validateNonEmptyFields } from '@/utils/form'
import { message } from '@/utils/message'
import { goKefu } from '@/utils/navigator'

type IProps = {
  trigger: JSX.Element
}

export default function ModifyEmailModal({ trigger }: IProps) {
  const intl = useIntl()
  const pwdTipsRef = useRef<any>()
  const { fetchUserInfo } = useModel('user')
  const { initialState } = useModel('@@initialState')
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

  return (
    <Modal
      trigger={trigger}
      width={460}
      title={<FormattedMessage id="mt.genghuandianziyouxiang" />}
      contentStyle={{ paddingInline: 20 }}
      onFinish={async (values: any) => {
        console.log('values', values)

        setSubmitLoading(true)

        const res = await editEmail(values)
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
      <ProFormText
        name="newEmail"
        label={intl.formatMessage({ id: 'mt.xinyouxiang' })}
        placeholder={intl.formatMessage({ id: 'mt.shurudianziyouxiang' })}
        fieldProps={{
          size: 'large',
          style: { height: 42 }
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'mt.shurudianziyouxiang' })
          }
        ]}
        formItemProps={{ style: { marginBottom: 24 } }}
      />
      <FormCaptcha
        name="newEmailCode"
        onSend={async () => {
          const email = form.getFieldValue('newEmail')
          if (!email) {
            message.info(intl.formatMessage({ id: 'mt.qingshuruxinyouxiang' }))
            throw {}
          }
          const res = await sendCustomEmailCode({ email })
          return res.success
        }}
        label={intl.formatMessage({ id: 'mt.xinyouxiangyanzheng' })}
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
        name="oldEmailCode"
        onSend={async () => {
          const res = await sendEmailCode()
          return res.success
        }}
        label={intl.formatMessage({ id: 'mt.yuanshiyouxiangyanzheng' })}
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
