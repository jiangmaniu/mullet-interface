import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo } from 'react'

import InputNumber from '@/components/Base/InputNumber'
import { useStores } from '@/context/mobxProvider'
import useTrade from '@/hooks/useTrade'

// 下单手数
function OrderVolume() {
  const intl = useIntl()
  const { trade } = useStores()
  const { disabledTrade, isBuy, orderVolume, vmax, vmaxShow, vmin, countPrecision, setOrderVolume, onAdd, onMinus } = useTrade()

  const disabled = disabledTrade || trade.disabledTradeAction()

  const renderVolume = useMemo(() => {
    return (
      <InputNumber
        showAddMinus
        autoFocus={false}
        direction="column"
        classNames={{ input: '!text-lg !pl-[5px]', minus: '-top-[2px]', tips: '!top-[70px]' }}
        height={52}
        textAlign="left"
        placeholder={intl.formatMessage({ id: 'mt.shoushu' })}
        label={isBuy ? intl.formatMessage({ id: 'mt.mairushoushu' }) : intl.formatMessage({ id: 'mt.maichushoushu' })}
        unit={intl.formatMessage({ id: 'mt.lot' })}
        value={orderVolume}
        max={vmax}
        min={vmin}
        precision={countPrecision}
        hiddenPrecision={false}
        onChange={(value) => {
          setOrderVolume(value || '')
        }}
        onAdd={onAdd}
        onMinus={onMinus}
        tips={
          <>
            <FormattedMessage id="mt.shoushufanwei" />
            <span className="pl-1">
              {vmin}-{vmaxShow}
            </span>
          </>
        }
        disabled={disabled}
      />
    )
  }, [disabled, countPrecision, vmin, vmax, vmaxShow, orderVolume, isBuy, onAdd, onMinus])

  return <>{renderVolume}</>
}

export default observer(OrderVolume)
