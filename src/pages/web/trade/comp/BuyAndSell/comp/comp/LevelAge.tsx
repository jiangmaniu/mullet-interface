import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import Slider from '@/components/Web/Slider'
import useCurrentQuote from '@/hooks/useCurrentQuote'

type IProps = {
  initialValue?: number
  onChange?: (value: any) => void
}

// 杠杆选择
function LevelAge({ initialValue, onChange }: IProps) {
  const intl = useIntl()
  const [value, setValue] = useState<any>(0)
  const { prepaymentConf } = useCurrentQuote()
  const isFixedMargin = prepaymentConf?.mode === 'fixed_margin' // 固定保证金模式，没有杠杆

  useEffect(() => {
    setValue(initialValue || 6)
  }, [initialValue])

  if (isFixedMargin) return

  return (
    <div>
      <InputNumber
        placeholder={intl.formatMessage({ id: 'mt.gangganbeishu' })}
        rootClassName="!z-50 mt-3"
        classNames={{ input: 'text-center' }}
        value={value}
        onChange={(v) => {
          setValue(v)
          onChange?.(v)
        }}
        max={30}
        min={0}
        unit={isFixedMargin ? undefined : <span className="relative left-3 text-gray-220 text-base">x</span>}
        disabled={false}
      />
      <div className="flex flex-col pt-1 mx-3">
        <div>
          <Slider
            value={value}
            min={0}
            max={30}
            marks={{
              0: '0x',
              10: '10x',
              20: '20x',
              30: '30x'
            }}
            tooltip={{ placement: 'bottom', formatter: (value: any) => `${value}x` }}
            onChange={(v) => {
              setValue(v)
              onChange?.(v)
            }}
            disabled={isFixedMargin}
          />
        </div>
      </div>
    </div>
  )
}

export default observer(LevelAge)
