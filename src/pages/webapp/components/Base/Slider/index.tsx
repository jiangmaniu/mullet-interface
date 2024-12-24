import { Slider as AntdSlider } from 'antd'
import { SliderSingleProps } from 'antd/es/slider'
import { useEffect, useMemo, useState } from 'react'

type IProps = Omit<SliderSingleProps, 'marks' | 'max' | 'min' | 'step' | 'value' | 'onChange'> & {
  onChange?: (value: any) => void
  disabled?: boolean
  value?: any
  /** 标记断点 */
  marks?: any[]
  max?: any
  min?: any
  step?: number
  /** 格式化展示单位 */
  unit?: string
  /** 滑动结束 */
  onSlidingComplete?: (value: any) => void
}

export default function Slider({
  unit = 'X',
  disabled,
  max = 100,
  min = 0,
  onChange,
  value,
  marks = [],
  step = 1,
  onSlidingComplete,
  ...res
}: IProps) {
  const [sliderValue, setSliderValue] = useState<any>([1])

  const trackMarks = useMemo(() => {
    return marks.reduce((acc, mark) => {
      acc[mark] = `${mark}${unit}`
      return acc
    }, {} as Record<number, string>)
  }, [marks, unit])

  useEffect(() => {
    if (value) {
      setSliderValue([value])
    }
  }, [value])

  return (
    <AntdSlider
      max={max}
      min={min}
      step={step}
      value={sliderValue}
      marks={trackMarks}
      onChangeComplete={(value) => {
        onSlidingComplete?.(value)
      }}
      onChange={onChange}
      tooltip={{ placement: 'bottom', formatter: (value) => `${value}${unit}` }}
      disabled={disabled}
      {...res}
    />
  )
}
