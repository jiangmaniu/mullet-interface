'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { startTransition, useState } from 'react'

import { GeneralTooltip } from '@/components/tooltip/general'
import { Button } from '@/libs/ui/components/button'
import { Input } from '@/libs/ui/components/input'
import { NumberInput, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { SliderTooltip } from '@/libs/ui/components/slider-tooltip'
import { Switch } from '@/libs/ui/components/switch'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { BNumber } from '@/libs/utils/number'
import { TradeActionPanelOrderPrice } from './order-price'
import { MarginModeModal } from '../modal/margin-mode-modal'

import { SettingLeverageModal } from '../modal/setting-leverage-modal'
import { useStores } from '@/context/mobxProvider'
import { observer } from 'mobx-react'
import { MarginModeSetting } from './margin-mode-setting'
import { TradingLeverage } from './trading-leverage'
import { TRADE_ORDER_TYPE_OPTIONS } from '../../_options/order'
import { TradeActionPanelTpAndSl } from './order-tp-and-sl'
import { TradeActionPanelOrderDirection } from './order-direction'
import { TradeActionPanelOrderSubmit } from './order-submit'
import { TradeActionPanelOrderOverview } from './order-overview'
import { TradeActionPanelOrderAmount } from './order-amount'

export const TradeActionPanel = observer(() => {
  const { trade } = useStores()

  const [selectedOrderType, setSelectedOrderType] = useState(trade.orderType)

  return (
    <div className="rounded-large bg-primary flex h-full flex-col gap-3 p-3">
      <div className="flex flex-col gap-2">
        <div className="gap-xl flex justify-between">
          <div className="flex-1">
            <MarginModeSetting />
          </div>
          <div className="flex-1">
            <TradingLeverage />
          </div>
        </div>

        <Tabs
          value={selectedOrderType}
          onValueChange={(value) => {
            startTransition(() => {
              trade.setOrderType(value)
              // 重置买卖类型
              trade.setBuySell('BUY')
              setSelectedOrderType(value)
            })
          }}
        >
          <TabsList className="gap-medium">
            {TRADE_ORDER_TYPE_OPTIONS.map((option, i) => {
              return (
                <TabsTrigger className="flex-1" key={i} value={option.value}>
                  {option.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* 交易表单 */}
      <div className="gap-xl flex flex-col">
        <TradeActionPanelOrderDirection />

        <TradeActionPanelOrderPrice />

        <TradeActionPanelOrderAmount />

        <TradeActionPanelTpAndSl />

        <TradeActionPanelOrderSubmit />

        <TradeActionPanelOrderOverview />
      </div>
    </div>
  )
})
