import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import SelectCountryFormItem from '@/components/Admin/Form/SelectCountryFormItem'
import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { DEFAULT_AREA_CODE } from '@/constants'
import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import { submitBaseAuth } from '@/services/api/crm/kycAuth'
import { ProForm } from '@ant-design/pro-components'
import { Form, message } from 'antd'
import { observer } from 'mobx-react'

type IProps = {
  trigger?: JSX.Element
  onSuccess?: () => void
}

function BaseKycApproveInfoModal({ trigger, onSuccess }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { theme } = useTheme()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const intl = useIntl()
  const [form] = ProForm.useForm()
  const [identificationType, setIdentificationType] = useState<API.IdentificationType>('ID_CARD') // 证件类型

  // 证件类型
  const idCardTypeOptions: Array<{ key: API.IdentificationType; label: string }> = [
    {
      key: 'ID_CARD',
      label: intl.formatMessage({ id: 'mt.shenfenzheng' })
    }
  ]

  !getEnv().ID_CARD_ONLY &&
    idCardTypeOptions.push({
      key: 'PASSPORT',
      label: intl.formatMessage({ id: 'mt.huzhao' })
    })

  const identificationCode = Form.useWatch('identificationCode', form)
  const firstName = Form.useWatch('firstName', form)
  const lastName = Form.useWatch('lastName', form)
  const country = Form.useWatch('country', form)

  const { fetchUserInfo, isEmailRegisterWay } = useModel('user')
  // 提交手机或邮箱绑定
  const handleSubmitTwoStep = async () => {
    form.validateFields().then((values) => {
      // submitBaseAuth
      submitBaseAuth({ ...values, identificationType }).then((res) => {
        if (res.success) {
          message.info(intl.formatMessage({ id: 'mt.tijiaochenggong' }))
          // 刷新用户信息
          fetchUserInfo()

          modalRef.current?.close()
          onSuccess?.()

          return
        }
      })
    })
  }

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const userInfo = currentUser?.userInfo
  const phone = userInfo?.phone

  return (
    <Modal
      styles={{
        header: {
          backgroundColor: theme.colors.backgroundColor.secondary
        }
      }}
      contentStyle={{ padding: 18 }}
      renderTitle={() => (
        <div className="h-[100px] w-60 relative">
          <FormattedMessage id="mt.kycrenzheng" />
          <img src="/img/kyc-i1.png" className="absolute top-0 right-0" width={102} height={102} />
        </div>
      )}
      trigger={trigger}
      width={430}
      footer={null}
      ref={modalRef}
    >
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-primary">
          <FormattedMessage id="mt.shenfenrenzheng" />
        </span>
        <span className="text-sm text-gray-500 mt-2">
          <FormattedMessage id="mt.qingquebaoyixiazixunshibenren" />
        </span>
        <span className="text-base font-medium text-primary my-[22px]">
          {intl.formatMessage({ id: 'common.shoujihaoma' })}:&nbsp;
          {phone}
        </span>
      </div>
      <ProForm
        onFinish={async (values: any) => {
          console.log('values', values)

          return
        }}
        submitter={false}
        layout="vertical"
        form={form}
      >
        <SelectCountryFormItem
          initialValue={`+${DEFAULT_AREA_CODE}`}
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
      </ProForm>

      <Button
        className="!h-[44px] mt-6"
        type="primary"
        block
        disabled={!lastName || !firstName || !identificationCode || !country}
        onClick={handleSubmitTwoStep}
      >
        <FormattedMessage id="mt.wanchengchujirenzheng" />
      </Button>
    </Modal>
  )
}

export default observer(forwardRef(BaseKycApproveInfoModal))
