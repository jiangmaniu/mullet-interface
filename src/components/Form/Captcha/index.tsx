// @ts-nocheck
import { ProFormCaptcha, ProFormCaptchaProps } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { useRef, useState } from 'react'

import Theme from '@/theme/theme.antd'
import { callGT4 } from '@/utils/gt4'

// 验证码组件
interface IProps extends ProFormCaptchaProps {
  /**@name 参数校验完成，正式发送请求获取验证码 */
  onSend: (geeTestParam: API.GeeTestParam, phoneOrEmail?: string) => Promise<any>
  /** @name 获取验证码的方法 */
  onGetCaptcha?: (mobile: string) => Promise<void>
}
const FormCaptcha: React.FC<IProps> = ({ onSend, ...res }) => {
  const intl = useIntl()
  const captchaRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)

  return (
    <ProFormCaptcha
      captchaTextRender={(paramsTiming: boolean, paramsCount: number) => {
        return paramsTiming ? (
          <FormattedMessage id="admin.table.account.codeDownload" values={{ count: paramsCount }} />
        ) : (
          <FormattedMessage id="admin.table.account.getCode" />
        )
      }}
      countDown={59}
      fieldProps={{ style: { marginRight: 0 } }}
      captchaProps={{ loading, style: { position: 'absolute', right: 8, color: Theme.colorPrimary }, type: 'link' }}
      // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
      // throw new Error("获取验证码错误")
      onGetCaptcha={async (phoneOrEmail) => {
        // await waitTime(1000);
        const result = await callGT4().catch(() => {
          // 阻止发送验证码
          throw {}
        })
        if (result?.captcha_id) {
          setLoading(true)
          // 校验完毕，把验证码参数传递出去
          await onSend?.(result, phoneOrEmail)
          setLoading(false)
          captchaRef?.current?.startTiming()
        } else {
          captchaRef?.current?.endTiming()
          // 阻止发送验证码
          throw new Error('获取验证码错误')
        }
      }}
      fieldRef={captchaRef}
      {...res}
    />
  )
}

export default FormCaptcha
