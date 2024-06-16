import { Slider as AntdSlider } from 'antd'
import { SliderSingleProps } from 'antd/es/slider'

type IProps = SliderSingleProps

export default function Slider({ ...res }: IProps) {
  return (
    <AntdSlider
      max={100}
      min={0}
      step={1}
      marks={{
        0: '0%',
        25: '25%',
        50: '50%',
        75: '75%',
        100: '100%'
      }}
      tooltip={{ placement: 'bottom', formatter: (value) => `${value}%` }}
      {...res}
    />
  )
}
