import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import Slider from '@/components/Web/Slider'
import { useStores } from '@/context/mobxProvider'
import { toFixed } from '@/utils'

type IProps = {
  onChange?: (value: any) => void
  initialValue?: any
  isAdd?: boolean
}

// 保证金输入
function MarginInput({ onChange, initialValue, isAdd }: IProps) {
  const { trade } = useStores()
  const intl = useIntl()
  const [margin, setMargin] = useState<any>(0)
  const [sliderValue, setSliderValue] = useState(0)
  const { availableMargin } = trade.getAccountBalance()

  useEffect(() => {
    setMargin(initialValue || 0)
  }, [initialValue])

  useEffect(() => {
    setSliderValue((margin / availableMargin) * 100)
    onChange?.(margin)
  }, [margin])

  return (
    <div>
      <InputNumber
        showAddMinus={false}
        label={
          <div className="text-gray font-semibold text-sm mb-1">
            {isAdd ? <FormattedMessage id="mt.zengjiazhengjin" /> : <FormattedMessage id="mt.jianshaobaozhengjin" />}
          </div>
        }
        placeholder={intl.formatMessage({ id: 'mt.qingshurubaozhengjin' })}
        rootClassName="!z-50 mt-3"
        classNames={{ input: 'text-center' }}
        value={margin}
        onChange={(v) => {
          setMargin(v)
        }}
        max={availableMargin}
        min={1}
        disabled={!availableMargin}
        height={40}
      />
      <div className="flex flex-col pt-1 mx-3">
        <div>
          <Slider
            onChange={(value: any) => {
              console.log('value', value)
              // 可用保证金*百分比
              setMargin(toFixed((value / 100) * availableMargin, 2))
              setSliderValue(value)
            }}
            value={sliderValue}
          />
        </div>
      </div>
    </div>
  )
}

export default observer(MarginInput)
