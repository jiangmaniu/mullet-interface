import { useIntl } from '@umijs/max'
import { FormInstance } from 'antd'

import AreaCodeSelect from '@/components/Form/AreaCodeSelect'

import { useEffect, useState } from 'react'
import ProFormText from '../ProFormText'

type IProps = {
  form: FormInstance
  height?: number
  placeholder?: string
  label?: React.ReactNode
  defaultAreaCode?: Common.AreaCodeItem
}

export default function SelectCountryFormItem({ form, height = 49, placeholder, label, defaultAreaCode }: IProps) {
  const intl = useIntl()

  const [option, setOption] = useState<any>(null)

  useEffect(() => {
    // validateNonEmptyFields(form)
    if (option?.['data-item']) {
      const label = intl.locale === 'zh-TW' ? option['data-item'].nameCn : option['data-item'].nameEn
      form.setFieldValue('countryName', label)
      form.setFieldValue('country', option['data-item']?.abbr) // 国家简称
    } else if (defaultAreaCode) {
      form.setFieldValue('countryName', intl.locale === 'zh-TW' ? defaultAreaCode?.nameCn : defaultAreaCode?.nameEn || '')
      form.setFieldValue('country', defaultAreaCode?.abbr || '')
    }
  }, [intl.locale, option, defaultAreaCode])

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
          setOption(option)
          // form.setFieldValue('countryName', option['data-item']?.label)
          // form.setFieldValue('country', option['data-item']?.abbr) // 国家简称
        }}
      />
      {/* 隐藏表单提交 */}
      <ProFormText name="country" hidden />
    </>
  )
}
