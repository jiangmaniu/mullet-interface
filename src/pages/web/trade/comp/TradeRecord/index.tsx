import { FormattedMessage, useIntl } from '@umijs/max'
import { Checkbox } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { toFixed } from '@/utils'

import OpenTipsModal from '../Modal/OpenTipsModal'
import HistoryList from './HistoryList'
import PendingOrder from './PendingOrder'
import Position from './Position'
import StopLossProfitList from './StopLossProfitList'

type IProps = {
  trigger?: JSX.Element
}

function TradeRecord({ trigger }: IProps) {
  const intl = useIntl()
  const [tabKey, setTabKey] = useState(1)
  const [showActiveSymbol, setShowActiveSymbol] = useState(false)
  const popupRef = useRef()
  const { ws, trade } = useStores()
  const { quotes, symbols } = ws
  const tradeList = trade.positionList
  const pendingList = trade.pendingList
  const stopLossProfitList = trade.stopLossProfitList

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

  // 持仓总浮动盈亏
  const totalProfit = 0
  // const totalProfit = currentPositionList?.length
  //   ? currentPositionList
  //       .map((item: any) => {
  //         const profit = covertProfit(quotes, symbols, item) // 浮动盈亏
  //         // @ts-ignore
  //         item.profit = profit
  //         return item
  //       })
  //       // @ts-ignore
  //       .reduce((total, current) => total + Number(current.profit || 0), 0)
  //   : 0

  const TabItems: any = [
    { key: 1, label: `${intl.formatMessage({ id: 'mt.chicang' })}(${tradeListLen})` },
    { key: 2, label: `${intl.formatMessage({ id: 'mt.guadan' })}(${pendingListLen})` },
    { key: 4, label: `${intl.formatMessage({ id: 'mt.zhiyingzhisun' })}(${stopLossProfitListLen})` },
    { key: 3, label: intl.formatMessage({ id: 'mt.lishichengjiao' }) }
  ]

  const labelName = {
    1: <FormattedMessage id="mt.chicang" />,
    2: <FormattedMessage id="mt.guadan" />,
    3: <FormattedMessage id="mt.lishichengjiao" />,
    4: <FormattedMessage id="mt.zhiyingzhisun" />
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
            {showActiveSymbol && !!totalProfit && tabKey === 1 && (
              <span className="mr-5 text-sm text-gray-secondary">
                <span className="pr-[5px]">{activeSymbolName}</span>
                <FormattedMessage id="mt.fudongyingkui" />
                <span className={classNames('pl-2', totalProfit > 0 ? 'text-green' : 'text-red')}>
                  {totalProfit > 0 ? '+' + toFixed(totalProfit) : toFixed(totalProfit)} USD
                </span>
              </span>
            )}
            {/* 历史成交没有这个按钮 */}
            {tabKey !== 3 && (
              <Checkbox onChange={onCheckBoxChange} className="max-xl:hidden">
                <span className="text-gray text-xs">
                  <FormattedMessage id="mt.zhizhanshidangqian" />
                </span>
              </Checkbox>
            )}
            {/* @TODO 接口暂时不支持 */}
            {/* {tabKey === 1 && (
              <div className="flex items-center border border-gray-250 py-[6px] px-[10px] rounded-lg ml-5 cursor-pointer">
                <img src="/img/shandian.png" width={14} height={14} />
                <span className="text-xs text-gray pl-[3px]">
                  <FormattedMessage id="mt.quanbupingcang" />
                </span>
              </div>
            )} */}
          </div>
        }
        onChange={(key: any) => {
          setTabKey(key)

          if (key === 1) {
            // 持仓
            trade.getPositionList()
          } else if (key === 2) {
            // 挂单
            trade.getPendingList()
          } else if (key === 4) {
            // 止盈止损
            trade.getStopLossProfitList()
          }
        }}
        tabBarGutter={46}
        tabBarStyle={{ paddingLeft: 27 }}
        size="small"
      />
    )
  }, [tradeListLen, pendingListLen, stopLossProfitListLen, showActiveSymbol, totalProfit, tabKey])

  const renderTabContent = useMemo(() => {
    return (
      <div className="px-2 pb-1 mb-6 pt-1">
        {tabKey === 1 && <Position parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
        {tabKey === 2 && <PendingOrder parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
        {tabKey === 4 && <StopLossProfitList parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
        {tabKey === 3 && <HistoryList showActiveSymbol={showActiveSymbol} />}
      </div>
    )
  }, [tabKey, showActiveSymbol, popupRef.current])

  return (
    <>
      <SwitchPcOrWapLayout
        pcComponent={
          <div className="pt-1 mb-3 bg-white border border-gray-180 relative z-[1]">
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
