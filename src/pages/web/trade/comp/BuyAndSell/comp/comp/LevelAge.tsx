import { useIntl } from '@umijs/max'
import { useEffect, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import Slider from '@/components/Web/Slider'

type IProps = {
  initialValue?: number
}

export default function LevelAge({ initialValue }: IProps) {
  const intl = useIntl()
  const [value, setValue] = useState<any>(0)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div>
      <InputNumber
        placeholder={intl.formatMessage({ id: 'mt.gangganbeishu' })}
        rootClassName="!z-50 mt-3"
        classNames={{ input: 'text-center' }}
        value={value}
        onChange={(v) => {
          setValue(v)
        }}
        max={30}
        min={0}
        unit={<span className="relative left-3 text-gray-220 text-lg">x</span>}
      />
      <div className="flex flex-col pt-1 mx-3">
        <div>
          <Slider
            value={value}
            min={0}
            max={30}
            marks={{
              0: '0x',
              6: '6x',
              10: '10x',
              20: '20x',
              30: '30x'
            }}
            tooltip={{ placement: 'bottom', formatter: (value) => `${value}x` }}
            onChange={(v) => {
              setValue(v)
            }}
          />
        </div>
      </div>
    </div>
  )
}
