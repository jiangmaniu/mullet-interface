import { useStores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'
import { Trans } from '@/libs/lingui/react/macro'
import { NumberInput, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { observer } from 'mobx-react'
import { useState } from 'react'

export const TradeActionPanelOrderAmount = observer(() => {
  const [orderAmount, setOrderAmount] = useState('')

  const { trade } = useStores()
  const { disabledTrade, isBuy, orderVolume, vmax, vmaxShow, vmin, countPrecision, setOrderVolume, onAdd, onMinus } = useTrade()

  return (
    <div>
      <div className="flex flex-col gap-medium">
        <div className="text-paragraph-p3 flex justify-between items-center">
          <div className="text-content-4">{isBuy ? <Trans>买数手数</Trans> : <Trans>卖出手数</Trans>}</div>
          <div className="flex gap-1">
            <div className="text-content-4">
              <Trans>范围</Trans>
            </div>
            <div>
              {vmin}-{vmaxShow}
            </div>
          </div>
        </div>

        <NumberInput
          hideLabel
          decimalScale={2}
          min={vmin}
          max={vmax}
          value={orderVolume}
          placeholder="0.00"
          labelText={<Trans>数量</Trans>}
          onValueChange={({ value }, { source }) => {
            if (source === NumberInputSourceType.EVENT) {
              setOrderVolume(value)
            }
          }}
          size={'md'}
        />
      </div>
    </div>
  )
})
