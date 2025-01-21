import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { Form } from 'antd'
import { observer } from 'mobx-react'
import { forwardRef, useRef, useState } from 'react'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import Button from '@/components/Base/Button'
import Hidden from '@/components/Base/Hidden'
import PwdTips from '@/components/PwdTips'
import { useStores } from '@/context/mobxProvider'
import { forgetPasswordEmail, forgetPasswordPhone } from '@/services/api/user'
import { regEmail, regPassword } from '@/utils'
import { message } from '@/utils/message'
import { goLogin } from '@/utils/navigator'

import ValidateCodeInput from '../../../../components/Form/ValidateCodeInput'

type IProps = {
  /**返回上一个页面 */
  onBack: () => void
  /**确定 */
  onConfirm?: () => void
  /**手机或邮箱 */
  sendType: 'EMIAL' | 'PHONE'
}
type Params = {
  /**手机或邮箱 */
  emailOrPhone: string
  /**手机区号 */
  phoneAreaCode?: string
}

// 重置密码
function ResetPwd({ onBack, onConfirm, sendType }: IProps, ref: any) {
  const { global } = useStores()
  const [step, setStep] = useState<'ONE' | 'TWO' | 'THREE' | 'FOUR'>('ONE') // 表单步骤
  const [form] = Form.useForm()
  const intl = useIntl()
  const registerWay = global.registerWay
  const isEmailTab = registerWay === 'EMAIL'
  const pwdTipsRef = useRef<any>()
  const newPassword = Form.useWatch('newPassword', form)
  const validateCodeInputRef = useRef<any>()

  // 发送手机、邮箱验证码
  const sendCode = async () => {
    const values = form.getFieldsValue()
    // console.log('values', values)
    if (!values.emailOrPhone) {
      message.info(intl.formatMessage({ id: 'common.qingshuru' }))
    }
    // 手机方式
    if (!values.phoneAreaCode && !isEmailTab) {
      message.info(intl.formatMessage({ id: 'common.qingxuanzequhao' }))
    }
    const success = await validateCodeInputRef.current?.sendCode?.({
      emailOrPhone: values.emailOrPhone?.trim(),
      phoneAreaCode: values.phoneAreaCode
    })
    if (success) {
      setStep('TWO')
    }
    return success
  }

  // 提交修改密码
  const handleSubmit = async (values: any) => {
    console.log('values', values)

    const params = {
      newPassword,
      emailOrPhone: values.emailOrPhone,
      validateCode: values.validateCode,
      phoneAreaCode: values.phoneAreaCode
    }

    console.log('params', params)

    const reqFn = isEmailTab ? forgetPasswordEmail : forgetPasswordPhone
    const res = await reqFn(params)

    if (res.success) {
      setStep('FOUR')
    }
  }

  return (
    <div className="flex items-center flex-col justify-center mt-[100px]">
      {step !== 'FOUR' && (
        <div className="mb-8 cursor-pointer" onClick={onBack}>
          <img src="/platform/img/pc-logo.svg" alt="logo" className="h-[68px] w-[242px]" />
        </div>
      )}
      <div className="bg-white rounded-lg w-[490px] min-h-[200px] flex flex-col">
        {step !== 'FOUR' && (
          <div className="border-b border-gray-100 py-5" onClick={onBack}>
            <div className="text-primary text-lg font-semibold px-10">
              <FormattedMessage id="mt.chongzhimima" />
            </div>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Hidden show={step === 'ONE'}>
            <div className="px-10 mt-6">
              <div>
                {/* 电子邮箱 */}
                {isEmailTab && (
                  <ProFormText
                    name="emailOrPhone"
                    fieldProps={{
                      size: 'large',
                      style: { height: 49 }
                    }}
                    placeholder={intl.formatMessage({ id: 'mt.shurudianziyouxiang' })}
                    required={false}
                    label={<FormattedMessage id="common.dianziyouxiang" />}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'mt.youxianggeshibuzhengque' }),
                        pattern: regEmail
                      }
                    ]}
                  />
                )}

                {/* 手机号码 */}
                {!isEmailTab && (
                  <PhoneSelectFormItem
                    names={['emailOrPhone', 'phoneAreaCode']}
                    form={form}
                    label={<FormattedMessage id="common.shoujihaoma" />}
                    required={false}
                  />
                )}
              </div>
              <div className="flex items-center justify-end gap-x-3 py-6">
                <Button
                  style={{ height: 48, width: 120 }}
                  onClick={() => {
                    // 返回登录页
                    goLogin()
                    onBack?.()
                  }}
                >
                  <FormattedMessage id="common.back" />
                </Button>
                <Button
                  type="primary"
                  style={{ height: 48, width: 120 }}
                  onClick={() => {
                    sendCode()
                  }}
                >
                  <FormattedMessage id="mt.fasongyanzhengma" />
                </Button>
              </div>
            </div>
          </Hidden>
          <Hidden show={step === 'TWO'}>
            <ValidateCodeInput sendType={sendType} ref={validateCodeInputRef} form={form} />
            <>
              <div className="flex px-10 items-center justify-end gap-x-3 py-6">
                <Button
                  style={{ height: 48, width: 120 }}
                  onClick={() => {
                    // 返回第一步表单
                    setStep('ONE')
                    // 关闭定时器
                    validateCodeInputRef.current?.stopCountDown?.()
                  }}
                >
                  <FormattedMessage id="common.back" />
                </Button>
                <Button
                  type="primary"
                  style={{ height: 48, width: 120 }}
                  onClick={() => {
                    const checkSuccess = validateCodeInputRef.current.checkCodeInput()
                    if (!form.getFieldValue('validateCode')) {
                      return message.info(intl.formatMessage({ id: 'mt.qingshuruyanzhengma' }))
                    }
                    if (!checkSuccess) {
                      return message.info(intl.formatMessage({ id: 'mt.qingshuruyanzhengma' }))
                    }
                    // 第三步表单
                    setStep('THREE')
                    // 关闭定时器
                    validateCodeInputRef.current?.stopCountDown?.()
                  }}
                >
                  <FormattedMessage id="common.jixu" />
                </Button>
              </div>
            </>
          </Hidden>
          <Hidden show={step === 'THREE'}>
            <div className="px-10 py-6">
              <ProFormText.Password
                name="newPassword"
                // required={false}
                required
                label={intl.formatMessage({ id: 'mt.shezhixinmima' })}
                placeholder={intl.formatMessage({ id: 'mt.shurumima' })}
                fieldProps={{
                  size: 'large',
                  style: { height: 49 },
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
              />
              <div className="my-4">
                <PwdTips pwd={newPassword} ref={pwdTipsRef} />
              </div>
              <div className="flex items-center justify-center py-6">
                <Button type="primary" style={{ height: 48 }} block htmlType="submit">
                  <FormattedMessage id="common.finish" />
                </Button>
              </div>
            </div>
          </Hidden>
          <Hidden show={step === 'FOUR'}>
            <div className="px-10 flex items-center justify-center flex-col">
              <img src="/img/pwd-success.png" width={232} height={232} />
              <div className="text-primary text-[24px] mb-3 font-semibold">
                <FormattedMessage id="mt.mimaxiugaiwancheng" />
              </div>
              <div className="text-primary text-[15px] mb-5">
                <FormattedMessage id="mt.qingjizhumimabuyaoxielu" />
              </div>
              <div className="flex items-center justify-center py-6">
                <Button
                  type="primary"
                  style={{ height: 48, width: 230 }}
                  onClick={() => {
                    setStep('ONE')
                    onBack()
                  }}
                >
                  <FormattedMessage id="mt.qudenglu" />
                </Button>
              </div>
            </div>
          </Hidden>
        </Form>
      </div>
    </div>
  )
}

export default observer(forwardRef(ResetPwd))
