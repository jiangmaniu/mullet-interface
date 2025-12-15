import { useStores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'
import { Trans } from '@/libs/lingui/react/macro'
import { NumberInput, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { Switch } from '@/libs/ui/components/switch'
import { observer } from 'mobx-react'

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
          <SetTP />
          <SetSL />
        </div>
      )}
    </div>
  )
})

function SetTP() {
  let { disabledTrade, spValue, slValue, onSpAdd, onSpMinus, onSlAdd, onSlMinus, setSl, setSp } = useTrade()
  return (
    <div className={'gap-xl flex items-center'}>
      <NumberInput
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
          }
        }}
        size={'md'}
      />

      <NumberInput
        className={'w-[80px]'}
        // value={accountPercent}
        onValueChange={({ value }, { source }) => {
          // if (source === NumberInputSourceType.EVENT) {
          //   setAccountPercent(value)
          // }
        }}
        size={'md'}
        placeholder={({ isFocused }) => {
          return <>{isFocused ? <Trans>百分比</Trans> : '0 '}</>
        }}
        RightContent={'%'}
      />
    </div>
  )
}

function SetSL() {
  let { disabledTrade, spValue, slValue, onSpAdd, onSpMinus, onSlAdd, onSlMinus, setSl, setSp } = useTrade()
  return (
    <div className={'gap-xl flex items-center'}>
      <NumberInput
        min={0}
        decimalScale={2}
        value={spValue}
        placeholder={({ isFocused }) => {
          // return <>{isFocused || spValue ? '止盈价格' : '0 '}</>
          return <Trans>止损价格</Trans>
        }}
        onValueChange={({ value }, { source }) => {
          if (source === NumberInputSourceType.EVENT) {
            setSp(value)
          }
        }}
        size={'md'}
      />

      <NumberInput
        className={'w-[80px]'}
        // value={accountPercent}
        onValueChange={({ value }, { source }) => {
          // if (source === NumberInputSourceType.EVENT) {
          //   setAccountPercent(value)
          // }
        }}
        size={'md'}
        placeholder={({ isFocused }) => {
          return <>{isFocused ? <Trans>百分比</Trans> : '0 '}</>
        }}
        RightContent={'%'}
      />
    </div>
  )
}
