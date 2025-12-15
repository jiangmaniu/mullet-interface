import { useStores } from '@/context/mobxProvider'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { observer } from 'mobx-react'
import { startTransition } from 'react'
import { TRADE_ORDER_DIRECTION_OPTIONS, TradeOrderDirectionEnum } from '../../_options/order'
import { cn } from '@/libs/ui/lib/utils'

export const TradeActionPanelOrderDirection = observer(() => {
  const { trade } = useStores()
  return (
    <Tabs
      variant="solid"
      size="md"
      value={trade.buySell}
      onValueChange={(value) => {
        startTransition(() => {
          trade.setBuySell(value)
        })
      }}
    >
      <TabsList className="gap-medium">
        {TRADE_ORDER_DIRECTION_OPTIONS.map((option, i) => {
          const isActive = trade.buySell === option.value
          return (
            <TabsTrigger
              block
              contentClassName={cn('', {
                'group-data-[state=active]:bg-market-rise': isActive && option.value === TradeOrderDirectionEnum.BUY,
                'group-data-[state=active]:bg-market-fall group-data-[state=active]:text-content-1':
                  isActive && option.value === TradeOrderDirectionEnum.SELL
              })}
              key={i}
              value={option.value}
            >
              {option.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
})
