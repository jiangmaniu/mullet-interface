import { ProFormSelect as FormSelect } from '@ant-design/pro-components'
import { useIntl } from '@umijs/max'
import { GetProps } from 'antd'

import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { useLang } from '@/context/languageProvider'

type IProps = GetProps<typeof FormSelect> & {
  /**标签label加上星号提示必填 */
  requiredLabel?: boolean
}

export default function ProFormSelect({ label, requiredLabel = false, required = false, disabled, fieldProps, ...res }: IProps) {
  const { lng } = useLang()
  const intl = useIntl()
  const isZh = lng === 'zh-TW'
  const prefix = intl.formatMessage({ id: 'common.pleaseSelect' })

  const msg = `${prefix}${!isZh ? ' ' : ''}${label}`

  return (
    <FormSelect
      showSearch
      label={label}
      placeholder={msg}
      fieldProps={{ suffixIcon: <SelectSuffixIcon opacity={0.5} disabled={disabled} />, size: 'large', ...fieldProps }}
      rules={[{ required, message: msg }]}
      disabled={disabled}
      // required={requiredLabel}
      {...res}
    />
  )
}
