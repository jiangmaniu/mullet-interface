import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import Slider from '@/components/Web/Slider'
import { useStores } from '@/context/mobxProvider'
import { toFixed } from '@/utils'

type IProps = {
  onChange?: (value: any) => void
  initialValue?: any
  isAdd?: boolean
  /**最大可用保证金 */
  availableMargin: number
}

// 保证金输入
function MarginInput({ onChange, initialValue, isAdd, availableMargin }: IProps, ref: any) {
  const { trade } = useStores()
  const intl = useIntl()
  const [margin, setMargin] = useState<any>(0)
  const [sliderValue, setSliderValue] = useState(0)
  const precision = trade.currentAccountInfo.currencyDecimal

  useEffect(() => {
    setMargin(initialValue || 0)
  }, [initialValue])

  useEffect(() => {
    setSliderValue((margin / availableMargin) * 100)
    onChange?.(margin)
  }, [margin])

  useImperativeHandle(ref, () => {
    return {
      reset: () => {
        setMargin(0)
      }
    }
  })

  return (
    <div>
      <InputNumber
        showAddMinus={false}
        showFloatTips={false}
        label={
          <div className="text-primary font-semibold text-sm mb-1">
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
        min={0.01}
        disabled={!availableMargin}
        height={40}
        precision={precision}
        hiddenPrecision={false}
      />
      <div className="flex flex-col pt-1 mx-3">
        <div>
          <Slider
            onChange={(value: any) => {
              // console.log('value', value)
              // 可用保证金*百分比
              setMargin(toFixed((value / 100) * availableMargin, precision))
              setSliderValue(value)
            }}
            value={sliderValue}
            disabled={!availableMargin}
          />
        </div>
      </div>
    </div>
  )
}

export default observer(forwardRef(MarginInput))
