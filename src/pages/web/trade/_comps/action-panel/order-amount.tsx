import { useStores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'
import { Trans } from '@/libs/lingui/react/macro'
import { NumberInput, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { BNumber } from '@/libs/utils/number'
import { observer } from 'mobx-react'
import { renderFallbackAmount } from '@/libs/utils/format/fallback'
import { LOTS_UNIT_LABEL } from '../../_options/trade'

export const TradeActionPanelOrderAmount = observer(() => {
  const { trade } = useStores()
  const { disabledTrade, isBuy, orderVolume, vmax, vmaxShow, vmin, lotVolScale, countPrecision, setOrderVolume, onAdd, onMinus } =
    useTrade()

  return (
    <div>
      <div className="flex flex-col gap-medium">
        <div className="text-paragraph-p3 flex justify-between items-center">
          <div className="text-content-4">{isBuy ? <Trans>买入手数</Trans> : <Trans>卖出手数</Trans>}</div>
          <div className="flex gap-1">
            <div className="text-content-4">
              <Trans>范围</Trans>
            </div>
            <div>
              {BNumber.toFormatNumber(vmin, { volScale: lotVolScale })}-{BNumber.toFormatNumber(vmaxShow, { volScale: lotVolScale })}
            </div>
          </div>
        </div>

        <NumberInput
          hideLabel
          decimalScale={lotVolScale}
          min={vmin}
          max={vmax}
          value={orderVolume}
          placeholder={renderFallbackAmount({ integerValue: 0, decimalValue: 0, volScale: lotVolScale })}
          RightContent={LOTS_UNIT_LABEL}
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
