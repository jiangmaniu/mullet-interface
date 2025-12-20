import { useStores } from '@/context/mobxProvider'
import { Trans } from '@/libs/lingui/react/macro'
import { NumberInput, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { observer } from 'mobx-react'
import { TradeOrderTypeEnum } from '../../_options/order'
import useTrade from '@/hooks/useTrade'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { cn } from '@/libs/ui/lib/utils'

export const TradeActionPanelOrderPrice = observer(() => {
  const { trade } = useStores()
  const { disabledTrade, orderPrice, setOrderPrice, isBuy, onPriceMinus, onPriceAdd } = useTrade()
  const selectedOrderType = trade.orderType
  const quoteInfo = useCurrentQuote(trade.activeSymbolName)

  const isSellOrder = trade.buySell === 'SELL'
  const isBuyOrder = trade.buySell === 'BUY'

  const handleSetLatestPrice = () => {
    if (isBuyOrder) {
      setOrderPrice(quoteInfo?.bid)
    } else {
      setOrderPrice(quoteInfo?.ask)
    }
  }

  const isMarket = selectedOrderType === TradeOrderTypeEnum.MARKET

  if (isMarket) {
    return (
      <div className={cn('rounded-small border border-default py-large px-xl', 'text-paragraph-p2')}>
        <span className="text-content-5">
          <Trans>以当前最优价</Trans>
        </span>
      </div>
    )
  }

  return (
    <div>
      <NumberInput
        placeholder="0.00"
        value={orderPrice}
        size="md"
        labelText={<Trans>价格</Trans>}
        RightContent={
          <>
            <div className="text-paragraph-p2 flex gap-1">
              <div className={'text-brand-primary cursor-pointer'} onClick={handleSetLatestPrice}>
                最新
              </div>
            </div>
          </>
        }
        disabled={disabledTrade}
        onValueChange={({ value }, { source }) => {
          if (isMarket) {
            return
          }

          if (source === NumberInputSourceType.EVENT) {
            setOrderPrice(value)
          }
        }}
      />
    </div>
  )
})
