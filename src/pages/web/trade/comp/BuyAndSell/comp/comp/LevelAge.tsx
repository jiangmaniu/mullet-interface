import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import Slider from '@/components/Web/Slider'
import { useStores } from '@/context/mobxProvider'

type IProps = {
  onChange?: (value: any) => void
}

// 杠杆选择
function LevelAge({ onChange }: IProps) {
  const { trade } = useStores()
  const intl = useIntl()
  const [value, setValue] = useState<any>(0)
  const leverageMultiple = trade.leverageMultiple

  useEffect(() => {
    setValue(leverageMultiple || 0)
  }, [leverageMultiple])

  return (
    <div>
      <InputNumber
        showAddMinus
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
        disabled={false}
        height={40}
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
          />
        </div>
      </div>
    </div>
  )
}

export default observer(LevelAge)
