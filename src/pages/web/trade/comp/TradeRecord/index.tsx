import { FormattedMessage, useIntl } from '@umijs/max'
import { Checkbox } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useStores } from '@/context/mobxProvider'
import useCurrentQuote from '@/hooks/useCurrentQuote'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { IRecordTabKey } from '@/mobx/trade'
import { toFixed } from '@/utils'

import OpenTipsModal from '../Modal/OpenTipsModal'
import HistoryRecord from './HistoryRecord'
import PendingList from './PendingList'
import PositionList from './PositionList'
import StopLossProfitList from './StopLossProfitList'

type IProps = {
  trigger?: JSX.Element
}

function TradeRecord({ trigger }: IProps) {
  const intl = useIntl()
  const [showActiveSymbol, setShowActiveSymbol] = useState(false)
  const popupRef = useRef()
  const { ws, trade } = useStores()
  const tradeList = trade.positionList
  const pendingList = trade.pendingList
  const stopLossProfitList = trade.stopLossProfitList
  const tabKey = trade.recordTabKey
  const quoteInfo = useCurrentQuote() // 保留，取值才会触发mobx更新

  const activeSymbolName = trade.activeSymbolName
  const currentPositionList = showActiveSymbol ? tradeList?.filter((v: any) => v.symbol === activeSymbolName) : tradeList
  const currentPendingList = showActiveSymbol ? pendingList?.filter((v: any) => v.symbol === activeSymbolName) : pendingList
  const currentStopLossProfitList = showActiveSymbol
    ? stopLossProfitList?.filter((v: any) => v.symbol === activeSymbolName)
    : stopLossProfitList

  const tradeListLen = currentPositionList?.length
  const pendingListLen = currentPendingList?.length
  const stopLossProfitListLen = currentStopLossProfitList?.length

  useEffect(() => {
    // 获取挂单、持仓、止盈止损接口
    trade.getPositionList()
    trade.getPendingList()
    trade.getStopLossProfitList()
  }, [trade.currentAccountInfo?.id])

  // 当前筛选列表的持仓总浮动盈亏
  const totalProfit = trade.getCurrentAccountFloatProfit(currentPositionList)

  const TabItems: { key: IRecordTabKey; label: any }[] = [
    { key: 'POSITION', label: `${intl.formatMessage({ id: 'mt.chicang' })}(${tradeListLen})` },
    { key: 'PENDING', label: `${intl.formatMessage({ id: 'mt.guadan' })}(${pendingListLen})` },
    { key: 'STOPLOSS_PROFIT', label: `${intl.formatMessage({ id: 'mt.zhiyingzhisun' })}(${stopLossProfitListLen})` },
    { key: 'HISTORY', label: intl.formatMessage({ id: 'mt.lishichengjiao' }) }
  ]

  const labelName = {
    POSITION: <FormattedMessage id="mt.chicang" />,
    PENDING: <FormattedMessage id="mt.guadan" />,
    STOPLOSS_PROFIT: <FormattedMessage id="mt.zhiyingzhisun" />,
    HISTORY: <FormattedMessage id="mt.lishichengjiao" />
  }[tabKey]

  const onCheckBoxChange = (e: any) => {
    setShowActiveSymbol(e.target.checked)
  }

  const renderTabs = useMemo(() => {
    return (
      <Tabs
        items={TabItems}
        tabBarExtraContent={
          <div className="flex items-center mr-2">
            {showActiveSymbol && !!totalProfit && tabKey === 'POSITION' && (
              <span className="mr-5 text-sm text-gray-secondary">
                <span className="pr-[5px]">{activeSymbolName}</span>
                <FormattedMessage id="mt.fudongyingkui" />
                <span className={classNames('pl-2', totalProfit > 0 ? 'text-green' : 'text-red')}>
                  {totalProfit > 0 ? '+' + toFixed(totalProfit) : toFixed(totalProfit)} USD
                </span>
              </span>
            )}
            {/* 历史成交没有这个按钮 */}
            {tabKey !== 'HISTORY' && (
              <Checkbox onChange={onCheckBoxChange} className="max-xl:hidden">
                <span className="text-gray text-xs">
                  <FormattedMessage id="mt.zhizhanshidangqian" />
                </span>
              </Checkbox>
            )}
            {/* @TODO 接口暂时不支持 */}
            {/* {tabKey === 'POSITION' && (
              <div className="flex items-center border border-gray-250 py-[6px] px-[10px] rounded-lg ml-5 cursor-pointer">
                <img src="/img/shandian.png" width={14} height={14} />
                <span className="text-xs text-gray pl-[3px]">
                  <FormattedMessage id="mt.quanbupingcang" />
                </span>
              </div>
            )} */}
          </div>
        }
        onChange={(key) => {
          trade.setTabKey(key as IRecordTabKey)
        }}
        tabBarGutter={46}
        tabBarStyle={{ paddingLeft: 27 }}
        size="small"
        activeKey={trade.recordTabKey}
      />
    )
  }, [tradeListLen, pendingListLen, stopLossProfitListLen, showActiveSymbol, totalProfit, tabKey])

  const renderTabContent = useMemo(() => {
    return (
      <div className="px-2 pb-1 mb-6 pt-1">
        {tabKey === 'POSITION' && <PositionList parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
        {tabKey === 'PENDING' && <PendingList parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
        {tabKey === 'STOPLOSS_PROFIT' && <StopLossProfitList parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
        {tabKey === 'HISTORY' && <HistoryRecord showActiveSymbol={showActiveSymbol} />}
      </div>
    )
  }, [tabKey, showActiveSymbol, popupRef.current])

  return (
    <>
      <SwitchPcOrWapLayout
        pcComponent={
          <div className="pt-1 mb-3 bg-white relative z-[1]">
            {renderTabs}
            {renderTabContent}
          </div>
        }
        wapComponent={
          <Popup title={labelName} trigger={trigger} ref={popupRef} position="bottom" height="80vh">
            {renderTabs}
            <div className="h-[70vh] overflow-y-auto pb-10">{renderTabContent}</div>
          </Popup>
        }
      />
      {/* 平仓成功弹窗 */}
      <OpenTipsModal />
    </>
  )
}

export default observer(TradeRecord)
