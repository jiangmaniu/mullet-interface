import './style.less'

import { CaretDownOutlined } from '@ant-design/icons'
import { useIntl } from '@umijs/max'
import { Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'

type IProps = {
  defaultValue: string
  onChange: ((value: any, option: DefaultOptionType | DefaultOptionType[]) => void) | undefined
  options?: DefaultOptionType[] | undefined
}

export default function SelectRounded({ defaultValue, onChange, options }: IProps) {
  const intl = useIntl()
  return (
    <Select
      className="rounded-select"
      style={{ width: 132, height: 38 }}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
      suffixIcon={<CaretDownOutlined style={{ color: 'black' }} />}
    />
  )
}
