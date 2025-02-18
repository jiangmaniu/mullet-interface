import { CaretDownOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'

import { cn } from '@/utils/cn'

type IProps = {
  title: string | React.JSX.Element
  subtitle?: string | React.JSX.Element
  onChange: (value: string) => void
  options?: {
    value: string
    label: string | React.JSX.Element
  }[]
  defaultValue?: string
  style?: clsx.ClassValue
  children: React.ReactNode
}
export const CardContainer = ({ title, subtitle, defaultValue, onChange, options, children, style }: IProps) => {
  const [value, setValue] = useState(defaultValue)
  const handleOnChange = (value: string) => {
    setValue(value)
    onChange(value)
  }
  return (
    <div className={cn(' border border-gray-150 rounded-2xl flex flex-col xl:gap-5 gap-2 pt-5 pb-6.5 px-5 bg-white', style)}>
      {/* Header */}
      <div className=" flex flex-row justify-between items-center">
        <span className=" text-xl text-primary font-medium">{title}</span>
        {options && (
          <Select
            style={{ width: 68, height: 24 }}
            value={value}
            onChange={handleOnChange}
            options={options}
            variant="borderless"
            labelRender={(option) => <span className="text-sm text-gray-600">{option.label}</span>}
            suffixIcon={<CaretDownOutlined className=" text-gray-600" />}
          />
        )}
        {subtitle}
      </div>
      {children}
    </div>
  )
}
