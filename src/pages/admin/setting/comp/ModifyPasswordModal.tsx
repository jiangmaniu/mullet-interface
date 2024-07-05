import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useRef } from 'react'

import Modal from '@/components/Admin/ModalForm'
import Button from '@/components/Base/Button'
import FormCaptcha from '@/components/Form/Captcha'
import PwdTips from '@/components/PwdTips'
import { regPassword } from '@/utils'
import { message } from '@/utils/message'

type IProps = {
  trigger: JSX.Element
}

export default function ModifyPasswordModal({ trigger }: IProps) {
  const intl = useIntl()
  const pwdTipsRef = useRef<any>()
  const { initialState } = useModel('@@initialState')
  const [form] = Form.useForm()
  const newPassword = Form.useWatch('newPassword', form)
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone

  return (
    <Modal
      trigger={trigger}
      width={460}
      title={<FormattedMessage id="mt.xiugaimima" />}
      contentStyle={{ paddingInline: 20 }}
      onFinish={async (values) => {
        console.log('values', values)

        const { newPassword, confirmNewPassword } = values

        if (newPassword !== confirmNewPassword) {
          message.info(intl.formatMessage({ id: 'admin.table.account.xinmimashurubuyizhi' }))
          return
        }

        return false
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
        onSend={async () => {
          return
        }}
        label={phone ? intl.formatMessage({ id: 'mt.shoujiyanzheng' }) : intl.formatMessage({ id: 'mt.yuanshiyouxiangyanzheng' })}
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
