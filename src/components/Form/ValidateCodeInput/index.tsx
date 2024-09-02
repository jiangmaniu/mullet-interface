import { FormattedMessage } from '@umijs/max'
import { useCountDown } from 'ahooks'
import { FormInstance } from 'antd'
import { NamePath } from 'antd/es/form/interface'
import { forwardRef, useImperativeHandle, useState } from 'react'

import CodeInput from '@/components/Base/CodeInput'
import { sendCustomEmailCode, sendCustomPhoneCode } from '@/services/api/user'

export type Params = {
  /**手机或邮箱 */
  emailOrPhone: string
  /**手机区号 */
  phoneAreaCode?: string
}

export type ISendType = 'EMIAL' | 'PHONE'

type IProps = {
  /**手机或邮箱 */
  sendType: ISendType
  form?: FormInstance
  name?: NamePath
  style?: React.CSSProperties
  showReSendBtn?: boolean
  /**是否显示倒计时 */
  showCountDown?: boolean
}

function ValidateCodeInput({ sendType, form, style, name, showReSendBtn = true, showCountDown = true }: IProps, ref: any) {
  const [leftTime, setLeftTime] = useState<any>(0)
  const [params, setParams] = useState({} as Params)
  const isEmail = sendType === 'EMIAL'

  // 关闭定时器
  const stopCountDown = () => {
    setLeftTime(undefined)
  }

  const [countDown] = useCountDown({
    leftTime,
    onEnd: () => {
      // 倒计时结束重置
      stopCountDown()
    }
  })
  const seconds = Math.round(countDown / 1000)

  // 发送手机、邮箱验证码
  const sendCode = async (values?: Params) => {
    const reqFn = isEmail ? sendCustomEmailCode : sendCustomPhoneCode
    const reqParams: any = {}
    const { emailOrPhone, phoneAreaCode } = values || params || {}
    // 邮箱
    if (isEmail) {
      reqParams.email = emailOrPhone
    }
    // 手机
    if (!isEmail && phoneAreaCode && emailOrPhone) {
      reqParams.phone = emailOrPhone
      reqParams.phoneAreaCode = phoneAreaCode
    }

    const res = await reqFn(reqParams)
    let success = res?.success
    if (success) {
      // 倒计时
      setLeftTime(60 * 1000)
    }

    return success
  }

  useImperativeHandle(ref, () => {
    return {
      sendCode: (params: Params) => {
        setParams(params)
        return sendCode(params)
      },
      stopCountDown,
      // @hack 校验验证码输入框组件是否都输入， antd Input.OTP不支持
      checkCodeInput: () => {
        return Array.from(document.querySelectorAll('#validateCode input')).every((item: any) => item.value)
      }
    }
  })

  return (
    <div className="px-10 pt-5 flex-1" style={style}>
      <div className="text-primary font-semibold text-[24px] pb-3">
        {isEmail ? <FormattedMessage id="mt.chakanyouxianghuoquyanzhengma" /> : <FormattedMessage id="mt.chakanshoujihuoquyanzhengma" />}
      </div>
      <div className="text-secondary text-base pb-5">
        {isEmail ? (
          <FormattedMessage id="mt.yanzhengmafasongzhi" values={{ email: params.emailOrPhone }} />
        ) : (
          <FormattedMessage id="mt.yanzhengmayifasongzhixx" values={{ value: `${params.phoneAreaCode} ${params.emailOrPhone}` }} />
        )}
      </div>
      <CodeInput form={form} name={name} />
      {showCountDown && (
        <div className="text-xs text-weak pt-5">
          <FormattedMessage id="mt.weishoudaoyanzhengma" />
          {seconds ? (
            <FormattedMessage id="mt.qingzaixxmiaohouchongshi" values={{ count: seconds }} />
          ) : showReSendBtn ? (
            <span
              className="text-brand text-xs cursor-pointer"
              onClick={() => {
                sendCode()
              }}
            >
              <FormattedMessage id="common.chongxinfasong" />
            </span>
          ) : (
            <span className="text-weak text-xs">
              <FormattedMessage id="mt.qingfasongyanzhengmahuoqu" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default forwardRef(ValidateCodeInput)
