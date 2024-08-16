import { CaretDownOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { useState } from 'react'

type IProps = {
  title: string | React.JSX.Element
  onChange: (value: string) => void
  options: {
    value: string
    label: string | React.JSX.Element
  }[]
  defaultValue: string
  children: React.ReactNode
}
export const CardContainer = ({ title, defaultValue, onChange, options, children }: IProps) => {
  const [value, setValue] = useState(defaultValue)
  return (
    <div className=" border border-gray-150 rounded-2xl flex flex-col xl:gap-5 gap-2 pt-5 pb-6.5 px-5 bg-white">
      {/* Header */}
      <div className=" flex flex-row justify-between items-center">
        <span className=" text-xl text-primary font-medium">{title}</span>
        <Select
          style={{ width: 68, height: 24 }}
          value={value}
          onChange={onChange}
          options={options}
          variant="borderless"
          labelRender={(option) => <span className="text-sm text-gray-600">{option.label}</span>}
          suffixIcon={<CaretDownOutlined className=" text-gray-600" />}
        />
      </div>
      {children}
    </div>
  )
}
