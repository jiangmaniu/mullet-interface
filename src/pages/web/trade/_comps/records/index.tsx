'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { useEffect, useState } from 'react'

import { Checkbox } from '@/libs/ui/components/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'

import { useStores } from '@/context/mobxProvider'
import { isBoolean } from 'lodash-es'
import { observer } from 'mobx-react'
import PositionList from './PositionList'
import PendingList from './PendingList'
// import HistoryPendingList from '../../comp/TradeRecord/comp/HistoryPendingList'
// import HistoryCloseList from '../../comp/TradeRecord/comp/HistoryCloseList'
import HistoryCloseList from './HistoryCloseList'
import HistoryPendingList from './HistoryPendingList'
// import FundRecordList from '../../comp/TradeRecord/comp/FundRecordList'
import FundRecordList from './FundRecordList'
// import HistoryPositionList from '../../comp/TradeRecord/comp/HistoryPositionList'
import HistoryPositionList from './HistoryPositionList'
// import { CloseAllPositions } from './positions/close-all'

enum TabType {
  POSITIONS = 'positions',
  PENDING = 'pending',
  HISTORY_ORDERS = 'history-orders',
  HISTORY_TRADES = 'history-trades',
  HISTORY_POSITIONS = 'history-positions',
  FUNDING_FLOW = 'funding-flow'
}

export const NewTradeRecords = observer(() => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.POSITIONS)

  const { ws, trade } = useStores()
  const { showActiveSymbol, setShowActiveSymbol } = trade
  const activeSymbolName = trade.activeSymbolName

  const tradeList = trade.positionList
  const currentPositionList = showActiveSymbol ? tradeList?.filter((v: any) => v.symbol === activeSymbolName) : tradeList
  const tradeListLen = currentPositionList?.length

  const pendingList = trade.pendingList
  const currentPendingList = showActiveSymbol ? pendingList?.filter((v: any) => v.symbol === activeSymbolName) : pendingList
  const pendingListLen = currentPendingList?.length

  const TABS_OPTIONS = [
    { key: TabType.POSITIONS, label: <Trans>持仓</Trans>, content: <PositionList />, count: tradeListLen },
    {
      key: TabType.PENDING,
      label: <Trans>挂单</Trans>,
      content: (
        <PendingList
        // parentPopup={popupRef.current}
        />
      ),
      count: pendingListLen
    },
    {
      key: TabType.HISTORY_ORDERS,
      label: <Trans>历史委托</Trans>,
      content: <HistoryPendingList />,
      // <HistoryOrders />
      count: null
    },
    {
      key: TabType.HISTORY_TRADES,
      label: <Trans>历史交易</Trans>,
      content: <HistoryCloseList />,
      // <HistoryTrades />
      count: null
    },
    {
      key: TabType.HISTORY_POSITIONS,
      label: <Trans>历史仓位</Trans>,
      content: <HistoryPositionList />,
      // <HistoryTrades />
      count: null
    },
    {
      key: TabType.FUNDING_FLOW,
      label: <Trans>资金流水</Trans>,
      content: (
        <>
          {/* <FundingFlow /> */}
          <FundRecordList />
        </>
      ),

      count: null
    }
  ]

  const tabActionMap: Record<string, React.ReactNode[]> = {
    [TabType.POSITIONS]: [
      // <CloseAllPositions />
    ]
  }

  useEffect(() => {
    // 获取挂单、持仓、止盈止损接口
    trade.getPositionList()
    trade.getPendingList()
    // trade.getStopLossProfitList()
  }, [trade.currentAccountInfo?.id])

  return (
    <div>
      <Tabs className="bg-primary rounded-large overflow-hidden" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="pr-3 flex justify-between gap-3">
          <div className="flex gap-2">
            {TABS_OPTIONS.map((tab) => {
              return (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label}
                  {!!tab.count && `(${tab.count})`}
                </TabsTrigger>
              )
            })}
          </div>
          <div className="flex items-center px- gap-4">
            {![TabType.FUNDING_FLOW].includes(activeTab) && (
              <Checkbox
                checked={showActiveSymbol}
                htmlFor="trade-only-show-current-pair"
                label={<Trans>只展示当前</Trans>}
                onCheckedChange={(checked) => {
                  if (isBoolean(checked)) setShowActiveSymbol(checked)
                }}
              />
            )}

            {tabActionMap[activeTab]?.map((action, i) => {
              return <div key={i}>{action}</div>
            })}
          </div>
        </TabsList>

        <div className="min-h-[250px] max-w-[calc(100vw-303px)]">
          {TABS_OPTIONS.map((tab) => (
            <TabsContent key={tab.key} value={tab.key}>
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
})
