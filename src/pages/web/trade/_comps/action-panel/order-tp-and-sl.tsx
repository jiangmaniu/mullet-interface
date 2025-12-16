import { useStores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'
import { Trans } from '@/libs/lingui/react/macro'
import { NumberInput, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { Switch } from '@/libs/ui/components/switch'
import { cn } from '@/libs/ui/lib/utils'
import { COMMON_PERCENT_DISPLAY_DECIMALS } from '@/libs/utils/format'
import { BNumber } from '@/libs/utils/number/b-number'
import { observer } from 'mobx-react'
import { useState } from 'react'

export const TradeActionPanelTpAndSl = observer(() => {
  const { trade, ws } = useStores()
  const { setOrderSpslChecked, orderSpslChecked, orderType, currentAccountInfo } = trade
  return (
    <div className="gap-xl flex flex-col">
      {/* 止盈止损 */}
      <div className="">
        <Switch
          checked={orderSpslChecked}
          onCheckedChange={(checked) => {
            setOrderSpslChecked(checked)
            // 重置值
            trade.resetSpSl()
          }}
        >
          <Trans>止盈/止损</Trans>
        </Switch>
      </div>

      {orderSpslChecked && (
        <div className="flex flex-col gap-xl">
          <SetTakeProfit />
          <SetStopLoss />
        </div>
      )}
    </div>
  )
})

const SetTakeProfit = observer(() => {
  let { disabledTrade, spValue, sp_scope, isBuy, slValue, onSpAdd, onSpMinus, onSlAdd, onSlMinus, setSl, setSp } = useTrade()
  const [tpPercent, setTpPercent] = useState('')

  return (
    <div className="flex flex-col gap-medium">
      <div className={'gap-xl flex-1 flex items-center'}>
        <NumberInput
          className="flex-1"
          min={0}
          decimalScale={2}
          value={spValue}
          placeholder={({ isFocused }) => {
            // return <>{isFocused || spValue ? '止盈价格' : '0 '}</>
            return <Trans>止盈价格</Trans>
          }}
          onValueChange={({ value }, { source }) => {
            if (source === NumberInputSourceType.EVENT) {
              setSp(value)

              // const diffPrice = isBuy ? BNumber.from(value).minus(sp_scope) : BNumber.from(sp_scope).minus(value)

              // const tpSlPercent = diffPrice?.gt(0)
              //   ? diffPrice?.div(sp_scope)?.multipliedBy(100)?.decimalPlaces(COMMON_PERCENT_DISPLAY_DECIMALS)?.toString()
              //   : '0'
            }
          }}
          size={'md'}
        />

        <NumberInput
          className={'w-[80px]'}
          value={tpPercent}
          onValueChange={({ value, floatValue }, { source }) => {
            if (source === NumberInputSourceType.EVENT) {
              setTpPercent(value)

              const spRate = BNumber.from(value).div(100)
              if (spRate?.lte(0)) {
                setSp('')
              } else {
                const pricePercent = isBuy ? BNumber.from(1).plus(spRate) : BNumber.from(1).minus(spRate)
                setSp(pricePercent.multipliedBy(sp_scope).toString())
              }
            }
          }}
          min={0}
          max={100}
          decimalScale={COMMON_PERCENT_DISPLAY_DECIMALS}
          size={'md'}
          placeholder={({ isFocused }) => {
            return <>{isFocused ? <Trans>百分比</Trans> : '0 '}</>
          }}
          RightContent={'%'}
        />
      </div>
      <div>
        <SetTakeProfitLabel />
      </div>
    </div>
  )
})

const SetTakeProfitLabel = observer(() => {
  const { isBuy, sp_scope, spFlag, spValueEstimate } = useTrade()
  return (
    <div className="flex justify-between gap-2">
      <div className="text-paragraph-p3 flex items-start gap-1">
        <span className={cn(spFlag ? 'text-status-danger' : 'text-content-5')}>
          <Trans>范围</Trans>
        </span>
        <span className="text-content-1">
          {BNumber.toFormatNumber(sp_scope, {
            prefix: isBuy ? '≥' : '≤',
            volScale: 2
          })}
        </span>
      </div>

      {!spFlag && spValueEstimate && (
        <div className="text-paragraph-p3 flex items-start gap-1">
          <Trans>预计盈亏</Trans>
          <span className="text-content-1">
            {BNumber.toFormatNumber(spValueEstimate, {
              volScale: 2,
              unit: 'USDC'
            })}
          </span>
        </div>
      )}
    </div>
  )
})

const SetStopLoss = observer(() => {
  let { disabledTrade, spValue, isBuy, slValue, onSpAdd, onSpMinus, sl_scope, onSlAdd, onSlMinus, setSl, setSp } = useTrade()
  const [slPercent, setSlPercent] = useState('')
  return (
    <div className="flex flex-col gap-medium">
      <div className={'gap-xl flex-1 flex items-center'}>
        <NumberInput
          className="flex-1"
          min={0}
          decimalScale={2}
          value={slValue}
          placeholder={({ isFocused }) => {
            // return <>{isFocused || spValue ? '止盈价格' : '0 '}</>
            return <Trans>止损价格</Trans>
          }}
          onValueChange={({ value }, { source }) => {
            if (source === NumberInputSourceType.EVENT) {
              setSl(value)
            }
          }}
          size={'md'}
        />

        <NumberInput
          min={0}
          max={100}
          decimalScale={COMMON_PERCENT_DISPLAY_DECIMALS}
          className={'w-[80px]'}
          value={slPercent}
          onValueChange={({ value, floatValue }, { source }) => {
            if (source === NumberInputSourceType.EVENT) {
              setSlPercent(value)

              const slRate = BNumber.from(value).div(100)
              if (slRate?.lte(0)) {
                setSl('')
              } else {
                const pricePercent = isBuy ? BNumber.from(1).plus(slRate) : BNumber.from(1).minus(slRate)
                setSl(pricePercent.multipliedBy(sl_scope).toString())
              }
            }
          }}
          size={'md'}
          placeholder={({ isFocused }) => {
            return <>{isFocused ? <Trans>百分比</Trans> : '0 '}</>
          }}
          RightContent={'%'}
        />
      </div>

      <div>
        <SetStopLossLabel />
      </div>
    </div>
  )
})
const SetStopLossLabel = observer(() => {
  const { isBuy, sl_scope, slFlag, slValueEstimate } = useTrade()
  return (
    <div className="flex justify-between gap-2">
      <div className="text-paragraph-p3 flex items-start gap-1">
        <span className={cn(slFlag ? 'text-status-danger' : 'text-content-4')}>
          <Trans>范围</Trans>
        </span>
        <span className="text-content-1">
          {BNumber.toFormatNumber(sl_scope, {
            prefix: isBuy ? '≤' : '≥',
            volScale: 2
          })}
        </span>
      </div>

      {!slFlag && slValueEstimate && (
        <div className="text-paragraph-p3 flex items-start gap-1">
          <Trans>预计盈亏</Trans>
          <span className="text-content-1">
            {BNumber.toFormatNumber(slValueEstimate, {
              volScale: 2,
              unit: 'USDC'
            })}
          </span>
        </div>
      )}
    </div>
  )
})
