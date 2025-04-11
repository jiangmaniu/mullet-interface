import { ProForm, ProFormText } from '@ant-design/pro-components'
import { useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useRef, useState } from 'react'

import FormCaptcha from '@/components/Form/Captcha'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { editEmail, sendCustomEmailCode, sendEmailCode } from '@/services/api/user'
import { validateNonEmptyFields } from '@/utils/form'
import { message } from '@/utils/message'

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
  const bottomSheetModalRef = useRef<SheetRef>(null)

  const onFinish = async () => {
    const values = await form.validateFields()

    setSubmitLoading(true)

    const res = await editEmail(values)
    const success = res.success
    setSubmitLoading(false)

    if (success) {
      message.info(intl.formatMessage({ id: 'common.opSuccess' }))

      // 更新用户信息
      fetchUserInfo()
    } else {
      // 有错误不要关闭弹窗
      throw {}
    }

    return success
  }

  const renderForm = () => {
    return (
      <ProForm submitter={false} form={form}>
        <div className="mx-4">
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
        </div>
      </ProForm>
    )
  }

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      autoHeight
      title={intl.formatMessage({ id: 'mt.genghuandianziyouxiang' })}
      trigger={trigger}
      // @ts-ignore
      onConfirm={onFinish}
      children={renderForm()}
    />
  )
}
