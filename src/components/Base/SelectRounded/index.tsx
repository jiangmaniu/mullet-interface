import './style.less'

import { CaretDownOutlined } from '@ant-design/icons'
import { useIntl } from '@umijs/max'
import { Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'

export type RawValueType = string | number
export interface LabelInValueType {
  label: React.ReactNode
  value: RawValueType
  /** @deprecated `key` is useless since it should always same as `value` */
  key?: React.Key
}

type IProps = {
  defaultValue?: string
  value?: any
  onChange: ((value: any, option: DefaultOptionType | DefaultOptionType[]) => void) | undefined
  options?: DefaultOptionType[] | undefined
  labelRender?: ((props: LabelInValueType) => React.ReactNode) | undefined
  optionRender?: ((option: DefaultOptionType) => React.ReactNode) | undefined
  variant?: 'outlined' | 'borderless' | 'filled' | undefined
}

export default function SelectRounded({ defaultValue, value, onChange, options, labelRender, optionRender, variant = undefined }: IProps) {
  const intl = useIntl()
  return (
    <Select
      className="rounded-select"
      style={{ width: 132, height: 38 }}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange as any}
      variant={variant}
      options={options}
      labelRender={labelRender}
      optionRender={optionRender}
      suffixIcon={<CaretDownOutlined style={{ color: 'black' }} />}
    />
  )
}
