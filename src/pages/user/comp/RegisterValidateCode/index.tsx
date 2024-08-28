import { FormattedMessage, useIntl } from '@umijs/max'
import { Form } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import ValidateCodeInput, { ISendType, Params } from '@/components/Form/ValidateCodeInput'
import { message } from '@/utils/message'

import ResetPwd from '../ResetPwd'

export type IValidateCodeType = 'RESET_PWD' | 'REGISTER'

type IProps = {
  /**返回上一个页面 */
  onBack: () => void
  /**确定 */
  onConfirm: () => void
  /**发送 手机或邮箱 */
  sendType: ISendType
  /**注册、重置密码 类型 */
  type?: IValidateCodeType
  open: boolean
}

// 注册验证码输入组件
function RegisterValidateCode({ onBack, onConfirm, sendType, type, open }: IProps, ref: any) {
  const [isOpen, setIsOpen] = useState(false)
  const validateCodeInputRef = useRef<any>()
  const [form] = Form.useForm()
  const intl = useIntl()

  useImperativeHandle(ref, () => {
    return {
      sendCode: (params: Params) => {
        setIsOpen(true)
        return validateCodeInputRef.current?.sendCode?.(params)
      },
      stopCountDown: validateCodeInputRef.current?.stopCountDown,
      form
    }
  })

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  if (type === 'RESET_PWD') {
    return <ResetPwd sendType={sendType} onBack={onBack} />
  }

  return (
    <>
      {isOpen && (
        <div className="flex items-center flex-col flex-1 justify-center -mt-12">
          <div className="mb-8" onClick={onBack}>
            <img src="/logo.svg" alt="logo" className="h-[68px] w-[242px] cursor-pointer" />
          </div>
          <div className="bg-white rounded-lg w-[490px] min-h-[200px] flex flex-col">
            <Form form={form}>
              <ValidateCodeInput sendType={sendType} ref={validateCodeInputRef} form={form} />
            </Form>
            <div className="flex px-10 items-center justify-center py-6">
              <Button
                type="primary"
                style={{ height: 48 }}
                block
                onClick={() => {
                  const checkSuccess = validateCodeInputRef.current.checkCodeInput()
                  if (!checkSuccess) {
                    return message.info(intl.formatMessage({ id: 'mt.qingshuruyanzhengma' }))
                  }
                  onConfirm()
                }}
              >
                <FormattedMessage id="mt.wancheng" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default forwardRef(RegisterValidateCode)
