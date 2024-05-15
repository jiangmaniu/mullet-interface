import { ProFormText as FormText } from '@ant-design/pro-components'
import type { ProFormFieldItemProps } from '@ant-design/pro-form/es/typing'
import { useIntl } from '@umijs/max'

import { useLang } from '@/context/languageProvider'

type IProps = ProFormFieldItemProps & {
  /**标签label加上星号提示必填 */
  requiredLabel?: boolean
  autoFocus?: boolean
  placeholder?: string
}

export default function ProFormText({ label, requiredLabel = false, required, placeholder, fieldProps, ...res }: IProps) {
  const { lng } = useLang()
  const intl = useIntl()
  const isZh = lng === 'zh-TW'
  const prefix = intl.formatMessage({ id: 'common.pleaseInput' })

  const msg = `${prefix}${!isZh ? ' ' : ''}${label}`

  return (
    <FormText
      fieldProps={{ autoComplete: 'off', size: 'large', ...fieldProps }}
      label={label}
      placeholder={placeholder || msg}
      rules={[{ required, message: msg }]}
      {...res}
    />
  )
}
