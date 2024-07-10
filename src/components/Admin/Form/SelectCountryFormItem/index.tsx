import { useIntl } from '@umijs/max'
import { FormInstance } from 'antd'

import AreaCodeSelect from '@/components/Form/AreaCodeSelect'

import ProFormText from '../ProFormText'

type IProps = {
  form: FormInstance
  height?: number
  placeholder?: string
  label?: React.ReactNode
}

export default function SelectCountryFormItem({ form, height = 49, placeholder, label }: IProps) {
  const intl = useIntl()
  return (
    <>
      <AreaCodeSelect
        name="countryName"
        form={form}
        selectProps={{
          allowClear: false,
          fieldProps: { size: 'large' },
          style: { height },
          placeholder: placeholder || intl.formatMessage({ id: 'mt.xuanzeguojia' }),
          label: label || intl.formatMessage({ id: 'mt.juzhuguojiadiqu' })
        }}
        onChange={(value, option) => {
          form.setFieldValue('countryName', option['data-item']?.label)
          form.setFieldValue('country', option['data-item']?.abbr) // 国家简称
        }}
      />
      {/* 隐藏表单提交 */}
      <ProFormText name="country" hidden />
    </>
  )
}
