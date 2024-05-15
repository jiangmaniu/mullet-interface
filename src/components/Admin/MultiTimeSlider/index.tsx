import { FormattedMessage } from '@umijs/max'
import { Slider } from 'antd'
import { SliderBaseProps } from 'antd/es/slider'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import { formatMin2Time, groupBy } from '@/utils'

type IProps = SliderBaseProps & {
  /**初始值 */
  value?: number[]
  defaultValue?: number[]
  onChange?: (value: number[]) => void
  label?: React.ReactNode
  disabled?: boolean
  /**是否展示默认marks标志 */
  showDefaultMarks?: boolean
}

export default function MultiTimeSlider({
  value,
  onChange,
  label,
  defaultValue,
  disabled,
  showDefaultMarks = true,
  max,
  min,
  ...res
}: IProps) {
  const [sliderValue, setSliderValue] = useState(defaultValue || [0, 360])

  useEffect(() => {
    if (value?.length) {
      setSliderValue(value)
    }
  }, [value])

  useEffect(() => {
    onChange?.(sliderValue)
  }, [sliderValue])

  // 设置分段标志
  const defaultMarks = {
    // 540: '09:00',
    360: '06:00',
    720: '12:00',
    1080: '18:00',
    1440: '24:00'
  }
  let marks = {
    0: '00:00'
  }

  const maxValue = disabled ? 1440 : max || 1440

  if (max && !disabled) {
    // @ts-ignore
    marks[max] = formatMin2Time(max)
  }

  if (showDefaultMarks || disabled) {
    marks = {
      ...defaultMarks,
      ...marks
    }
  }

  return (
    <div className="px-2 overflow-x-hidden pr-[26px] pl-[14px]">
      <div className="flex items-center justify-between">
        {label}
        <Button
          size="small"
          type="link"
          onClick={() => {
            const lastOne = sliderValue.at(-1)
            // @ts-ignore
            const start = lastOne + 60
            // @ts-ignore
            const end = lastOne + 60 + 120
            if (end <= maxValue) {
              const newValue = sliderValue.concat([start, end])
              setSliderValue(newValue)
            }
          }}
          disabled={disabled}
          className="relative left-4"
        >
          <FormattedMessage id="mt.xinzengduan" />
        </Button>
      </div>
      <Slider
        rootClassName="w-full"
        value={disabled ? [] : sliderValue}
        onChange={(value: any[]) => {
          setSliderValue(value)
        }}
        range={{ draggableTrack: true }}
        marks={marks}
        disabled={disabled}
        max={maxValue}
        step={5}
        min={min}
        tooltip={{ placement: 'bottom', formatter: (value) => formatMin2Time(value) }}
        trackStyle={groupBy(sliderValue, 2)
          .map((item) => [{ backgroundColor: '#183EFC' }, { backgroundColor: 'transparent' }])
          .flat()}
        // handleStyle={[{ backgroundColor: 'yellow' }, { backgroundColor: 'gray' }]}
        // railStyle={{ backgroundColor: '#efefef' }}
        {...res}
      />
    </div>
  )
}
