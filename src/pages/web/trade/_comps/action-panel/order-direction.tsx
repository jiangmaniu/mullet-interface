import { useStores } from '@/context/mobxProvider'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { observer } from 'mobx-react'
import { startTransition } from 'react'
import { TRADE_ORDER_DIRECTION_OPTIONS, TradeOrderDirectionEnum } from '../../_options/order'
import { cn } from '@/libs/ui/lib/utils'
import { Trans } from '@/libs/lingui/react/macro'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'
import { BNumber } from '@/libs/utils/number/b-number'

export const TradeActionPanelOrderDirection = observer(() => {
  const { trade } = useStores()
  const activeSymbolInfo = trade.activeSymbolInfo

  const quoteInfo = useCurrentQuote(trade.activeSymbolName)
  return (
    <div className={cn('flex gap-medium relative')}>
      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-0.5',
          'rounded-xs bg-white h-5 text-paragraph-p3 flex justify-center items-center text-content-foreground'
        )}
      >
        {BNumber.toFormatNumber(quoteInfo?.spread)}
      </div>

      <div
        className={cn('flex flex-1 flex-col gap-xs py-small px-3xl rounded-small text-button-2 text-content-4 bg-button', {
          'bg-market-rise text-content-foreground': trade.buySell === TradeOrderDirectionEnum.BUY,
          'cursor-pointer': trade.buySell !== TradeOrderDirectionEnum.BUY
        })}
        onClick={() => {
          startTransition(() => {
            trade.setBuySell(TradeOrderDirectionEnum.BUY)
          })
        }}
      >
        <div className="text-center">
          <Trans>买入/做多</Trans>
        </div>

        <div className="text-center">{BNumber.toFormatNumber(quoteInfo?.bid, { volScale: activeSymbolInfo.symbolDecimal })}</div>
      </div>

      <div
        className={cn('flex flex-1 flex-col gap-xs py-small px-3xl rounded-small text-button-2 text-content-4 bg-button', {
          'bg-market-fall text-content-1': trade.buySell === TradeOrderDirectionEnum.SELL,
          'cursor-pointer': trade.buySell !== TradeOrderDirectionEnum.SELL
        })}
        onClick={() => {
          startTransition(() => {
            trade.setBuySell(TradeOrderDirectionEnum.SELL)
          })
        }}
      >
        <div className="text-center">
          <Trans>卖出/做空</Trans>
        </div>

        <div className="text-center">{BNumber.toFormatNumber(quoteInfo?.ask, { volScale: activeSymbolInfo.symbolDecimal })}</div>
      </div>
    </div>
  )
})
