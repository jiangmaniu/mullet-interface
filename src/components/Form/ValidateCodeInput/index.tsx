import { FormattedMessage } from '@umijs/max'
import { useCountDown } from 'ahooks'
import { FormInstance } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'

import CodeInput from '@/components/Base/CodeInput'
import { sendCustomEmailCode, sendCustomPhoneCode } from '@/services/api/user'

export type Params = {
  /**手机或邮箱 */
  emailOrPhone: string
  /**手机区号 */
  areaCode?: string
}

export type ISendType = 'EMIAL' | 'PHONE'

type IProps = {
  /**手机或邮箱 */
  sendType: ISendType
  form?: FormInstance
}

function ValidateCodeInput({ sendType, form }: IProps, ref: any) {
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
    const { emailOrPhone, areaCode } = values || params || {}
    // 邮箱
    if (isEmail) {
      reqParams.email = emailOrPhone
    }
    // 手机
    if (!isEmail && areaCode && emailOrPhone) {
      reqParams.phone = emailOrPhone
      reqParams.areaCode = areaCode
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
      stopCountDown
    }
  })

  return (
    <div className="px-10 pt-5 flex-1">
      <div className="text-gray font-semibold text-[24px] pb-3">
        {isEmail ? <FormattedMessage id="mt.chakanyouxianghuoquyanzhengma" /> : <FormattedMessage id="mt.chakanshoujihuoquyanzhengma" />}
      </div>
      <div className="text-gray-secondary text-base pb-5">
        {isEmail ? (
          <FormattedMessage id="mt.yanzhengmafasongzhi" values={{ email: params.emailOrPhone }} />
        ) : (
          <FormattedMessage id="mt.yanzhengmayifasongzhixx" values={{ value: params.emailOrPhone }} />
        )}
      </div>
      <CodeInput form={form} />
      <div className="text-xs text-gray-weak pt-5">
        <FormattedMessage id="mt.weishoudaoyanzhengma" />
        {seconds ? (
          <FormattedMessage id="mt.qingzaixxmiaohouchongshi" values={{ count: seconds }} />
        ) : (
          <span
            className="text-primary text-xs cursor-pointer"
            onClick={() => {
              sendCode()
            }}
          >
            <FormattedMessage id="mt.chongxinfasong" />
          </span>
        )}
      </div>
    </div>
  )
}

export default forwardRef(ValidateCodeInput)
