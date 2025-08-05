import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import Slider from '@/components/Web/Slider'
import { useStores } from '@/context/mobxProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'

type IProps = {
  onChange?: (value: any) => void
}

// 杠杆选择
function LevelAge({ onChange }: IProps) {
  const { trade } = useStores()
  const intl = useIntl()
  const [value, setValue] = useState<any>(1)
  const leverageMultiple = trade.leverageMultiple

  const quoteInfo = useCurrentQuote(trade.activeSymbolName)
  const symbolConf = quoteInfo?.symbolConf
  const prepaymentConf = symbolConf?.prepaymentConf
  const minLever = Number(prepaymentConf?.float_leverage?.min_lever || 1)
  const maxLever = Number(prepaymentConf?.float_leverage?.max_lever || 30)

  useEffect(() => {
    setValue(leverageMultiple || 1)
  }, [leverageMultiple])

  // 只展示最小和最大范围即可，不展示梯度
  const marks = [minLever, maxLever]
  const marksMap = useMemo(() => {
    let retMap: any = {}
    marks.forEach((item) => {
      retMap[item] = `${item}x`
    })
    return retMap
  }, [minLever, maxLever])

  return (
    <div>
      <InputNumber
        showAddMinus
        showFloatTips={false}
        placeholder={intl.formatMessage({ id: 'mt.gangganbeishu' })}
        rootClassName="!z-50 mt-3"
        classNames={{ input: 'text-center' }}
        value={value}
        onChange={(v: any) => {
          let value = v
          if (value > maxLever) {
            value = maxLever
          }
          if (value < minLever) {
            value = minLever
          }
          setValue(value)
          onChange?.(value)
        }}
        max={maxLever}
        min={minLever}
        hiddenPrecision={false}
        step={1}
        disabled={false}
        height={40}
      />
      <div className="flex flex-col pt-1 mx-3">
        <div>
          <Slider
            value={value}
            min={minLever}
            max={maxLever}
            marks={marksMap}
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
