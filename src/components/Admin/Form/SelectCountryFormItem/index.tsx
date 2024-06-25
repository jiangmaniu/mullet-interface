import { useIntl } from '@umijs/max'
import { FormInstance } from 'antd'

import AreaCodeSelect from '@/components/Form/AreaCodeSelect'

type IProps = {
  form: FormInstance
}

export default function SelectCountryFormItem({ form }: IProps) {
  const intl = useIntl()
  return (
    <AreaCodeSelect
      name="country"
      // 这里的valueKey=label根据多语言切换展示的值
      valueKey="label"
      form={form}
      selectProps={{
        allowClear: false,
        fieldProps: { size: 'large' },
        style: { height: 49 },
        placeholder: intl.formatMessage({ id: 'mt.xuanzeguojia' }),
        label: intl.formatMessage({ id: 'mt.juzhuguojiadiqu' })
      }}
    />
  )
}
