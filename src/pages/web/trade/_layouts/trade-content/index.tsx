'use client'

import { useEffect } from 'react'
import { useNetwork, useTitle } from 'ahooks'
import { useStores } from '@/context/mobxProvider'
import { TradeLayout } from '../grid-layout'
import { TradeLayoutKey } from '../grid-layout/types'
import { Overview } from '../../_comps/overview'
import { TradeMarket } from '../../_comps/market'
import { OrderPriceDepthBooks } from '../../_comps/order-book'
import { AccountDetails } from '../../_comps/account'
import { TradeActionPanel } from '../../_comps/action-panel'
import { NewTradeRecords } from '../../_comps/records'
import { PositionDashboard } from '../../_comps/position-dashboard'

export const TradeContent = () => {
  return (
    <TradeLayout
      slots={{
        // [TradeLayoutKey.Tabs]: (
        //   <div className="h-full bg-red-500">
        //     {/* <TradingPairTabs /> */}
        //     tabs
        //   </div>
        // ),
        [TradeLayoutKey.Overview]: (
          <div className="h-full">
            <Overview />
          </div>
        ),
        [TradeLayoutKey.Tradingview]: (
          <div className="h-full">
            <TradeMarket />
          </div>
        ),
        [TradeLayoutKey.Orderbooks]: (
          <div className="h-full ">
            <OrderPriceDepthBooks />
          </div>
        ),
        [TradeLayoutKey.Account]: (
          <div className="h-full">
            <AccountDetails />
          </div>
        ),
        [TradeLayoutKey.Action]: (
          <div className="h-full ">
            <TradeActionPanel />
          </div>
        ),
        [TradeLayoutKey.Position]: <div className="h-full">{<NewTradeRecords />}</div>,
        [TradeLayoutKey.MarginRate]: (
          <div className="h-full ">
            <PositionDashboard />
          </div>
        )
      }}
    />
  )
}
