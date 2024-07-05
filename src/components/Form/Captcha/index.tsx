// @ts-nocheck
import { ProFormCaptcha, ProFormCaptchaProps } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { useRef, useState } from 'react'

import Theme from '@/theme/theme.antd'

// 验证码组件
interface IProps extends ProFormCaptchaProps {
  /**@name 参数校验完成，正式发送请求获取验证码 */
  onSend: (phoneOrEmail?: string) => Promise<any>
  /** @name 获取验证码的方法 */
  onGetCaptcha?: (mobile: string) => Promise<void>
}
const FormCaptcha: React.FC<IProps> = ({ onSend, fieldProps, ...res }) => {
  const intl = useIntl()
  const captchaRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)

  return (
    <ProFormCaptcha
      captchaTextRender={(paramsTiming: boolean, paramsCount: number) => {
        return paramsTiming ? (
          <FormattedMessage id="mt.codeDownload" values={{ count: paramsCount }} />
        ) : (
          <FormattedMessage id="mt.fasongyanzhengma" />
        )
      }}
      countDown={59}
      fieldProps={{ style: { marginRight: 0, height: 42 }, size: 'large', ...fieldProps }}
      captchaProps={{ loading, style: { position: 'absolute', right: 8, color: Theme.colorPrimary }, type: 'link' }}
      // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
      // throw new Error("获取验证码错误")
      onGetCaptcha={async (phoneOrEmail) => {
        try {
          setLoading(true)
          await onSend?.(phoneOrEmail)
          setLoading(false)
          captchaRef?.current?.startTiming()
        } catch (error) {
          captchaRef?.current?.endTiming()
          setLoading(false)
        }
      }}
      fieldRef={captchaRef}
      {...res}
    />
  )
}

export default FormCaptcha
