import { useIntl, useModel } from '@umijs/max'
import { FormInstance } from 'antd'

import AreaCodeSelect, { AreaCodeItem } from '@/components/Form/AreaCodeSelect'

import { useLang } from '@/context/languageProvider'
import { useState } from 'react'
import ProFormText from '../ProFormText'

type IProps = {
  form: FormInstance
  height?: number
  placeholder?: string
  label?: React.ReactNode
  initialValue?: string
}

export default function SelectCountryFormItem({ form, height = 49, placeholder, label, initialValue: _initialValue }: IProps) {
  const intl = useIntl()
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'

  const { list } = useModel('areaList')

  const options = list
    ?.filter((item) => item.areaCode !== '0')
    ?.map((v: AreaCodeItem) => {
      const areaNameZh = v.nameTw
      const areaName = v.nameEn
      const label = isZh ? areaNameZh : areaName || areaNameZh
      return {
        ...v,
        label,
        value: v.id,
        areaCode: `+${v.areaCode}`
      }
    })

  const [initialValue, setInitialValue] = useState('')

  return (
    <>
      <AreaCodeSelect
        name="countryName"
        form={form}
        initialValue={initialValue}
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
