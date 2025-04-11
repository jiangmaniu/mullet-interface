import { useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import { useEffect, useRef, useState } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Iconfont from '@/components/Base/Iconfont'
import FormCaptcha from '@/components/Form/Captcha'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { editPhone, sendCustomPhoneCode, sendPhoneCode } from '@/services/api/user'
import { regMobile } from '@/utils'
import { cn } from '@/utils/cn'
import { validateNonEmptyFields } from '@/utils/form'
import { message } from '@/utils/message'
import { ProForm } from '@ant-design/pro-components'
import type { ModalRef } from '../comp/SelectCountryModal'
import SelectCountryModal from '../comp/SelectCountryModal'

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
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const selectCountryModalRef = useRef<ModalRef>(null)

  const onFinish = async () => {
    const values = await form.validateFields()
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
    } else {
      // 有错误不要关闭弹窗
      throw {}
    }

    return success
  }

  const handleSelectCountry = (item?: Common.AreaCodeItem) => {
    if (item) {
      console.log('item', item)
      form.setFieldsValue({ phoneAreaCode: item.areaCode })
    }
  }

  const areaCode = Form.useWatch('phoneAreaCode', form)

  useEffect(() => {
    validateNonEmptyFields(form)
  }, [intl.locale])

  const renderForm = () => {
    return (
      <ProForm submitter={false} form={form}>
        <div className="mx-4">
          <div className="mb-6">
            {/* <PhoneSelectFormItem
              names={['newPhone', 'phoneAreaCode']}
              form={form}
              label={intl.formatMessage({ id: 'mt.xinshoujihaoma' })}
              placeholder={intl.formatMessage({ id: 'mt.shurushoujihaoma' })}
              required
            /> */}

            <Form.Item
              name={'newPhone'}
              required
              rules={[
                {
                  required: true,
                  validateTrigger: 'onChange',
                  validator(rule, value, callback) {
                    if (!value) {
                      return Promise.reject(intl.formatMessage({ id: 'mt.shurushoujihaoma' }))
                    } else if (!regMobile.test(value)) {
                      return Promise.reject(intl.formatMessage({ id: 'mt.shoujihaobuzhengque' }))
                    } else if (!form.getFieldValue('phoneAreaCode')) {
                      return Promise.reject(intl.formatMessage({ id: 'mt.xuanzequhao' }))
                    } else {
                      return Promise.resolve()
                    }
                  }
                }
              ]}
              className="phoneSelect"
              label={intl.formatMessage({ id: 'mt.xinshoujihaoma' })}
            >
              <TextField
                onChange={(val) => {
                  form.setFieldValue('newPhone', val?.trim())
                }}
                placeholder={intl.formatMessage({ id: 'pages.userCenter.qingshurushoujihaoma' })}
                height={42}
                containerStyle={{
                  marginTop: 4,
                  marginBottom: 0
                }}
                LeftAccessory={() => (
                  <View
                    className={cn('pl-[15px]')}
                    onPress={() => {
                      selectCountryModalRef.current?.show()
                    }}
                  >
                    <View className={cn('flex flex-row items-center gap-1')}>
                      <Text>{areaCode ? `+${areaCode}` : intl.formatMessage({ id: 'components.select.PlacehodlerSim' })}</Text>
                      <Iconfont name="qiehuanzhanghu-xiala" size={24} />
                    </View>
                  </View>
                )}
              />
            </Form.Item>
            {/* 隐藏表单项提交 */}
            <ProFormText hidden name="phoneAreaCode" />
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
        </div>
      </ProForm>
    )
  }

  return (
    <>
      <SheetModal
        ref={bottomSheetModalRef}
        autoHeight
        title={intl.formatMessage({ id: 'mt.genggaidianhuahaoma' })}
        trigger={trigger}
        // @ts-ignore
        onConfirm={onFinish}
        children={renderForm()}
      />
      <SelectCountryModal ref={selectCountryModalRef} title={intl.formatMessage({ id: 'mt.xuanzequhao' })} onPress={handleSelectCountry} />
    </>
  )
}
