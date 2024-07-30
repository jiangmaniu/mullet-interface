import { ProFormDigit as FormDigit } from '@ant-design/pro-components'
import { useIntl } from '@umijs/max'
import { GetProps } from 'antd'

import { useLang } from '@/context/languageProvider'

type IProps = GetProps<typeof FormDigit> & {
  /**标签label加上星号提示必填 */
  requiredLabel?: boolean
  autoFocus?: boolean
  placeholder?: string
}

export default function ProFormDigit({ label, requiredLabel = false, required, placeholder, fieldProps, ...res }: IProps) {
  const { lng } = useLang()
  const intl = useIntl()
  const isZh = lng === 'zh-TW'
  const prefix = intl.formatMessage({ id: 'common.pleaseInput' })

  const msg = `${prefix}${!isZh ? ' ' : ''}${label}`

  return (
    <FormDigit
      fieldProps={{ autoComplete: 'off', style: { width: '100%' }, size: 'large', ...fieldProps }}
      label={label}
      placeholder={placeholder || msg}
      rules={[{ required, message: msg }]}
      {...res}
    />
  )
}
