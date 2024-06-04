import { FormattedMessage, useIntl } from '@umijs/max'
import { Checkbox } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useMemo, useRef, useState } from 'react'

import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { toFixed } from '@/utils'
import { covertProfit } from '@/utils/wsUtil'

import OpenTipsModal from '../Modal/OpenTipsModal'
import HistoryList from './HistoryList'
import PendingOrder from './PendingOrder'
import Position from './Position'

type IProps = {
  trigger?: JSX.Element
}

function TradeRecord({ trigger }: IProps) {
  const intl = useIntl()
  const [tabKey, setTabKey] = useState(1)
  const [showActiveSymbol, setShowActiveSymbol] = useState(false)
  const popupRef = useRef()
  const { ws, global } = useStores()
  const { tradeList, pendingList, quotes, symbols } = ws

  const activeSymbolName = global.activeSymbolName
  const currentPositionList = showActiveSymbol ? tradeList.filter((v) => v.symbol === activeSymbolName) : tradeList
  const currentPendingList = showActiveSymbol ? pendingList.filter((v) => v.symbol === activeSymbolName) : pendingList

  const tradeListLen = currentPositionList?.length
  const pendingListLen = currentPendingList?.length

  // 持仓总浮动盈亏
  const totalProfit = currentPositionList.length
    ? currentPositionList
        .map((item) => {
          const profit = covertProfit(quotes, symbols, item) // 浮动盈亏
          // @ts-ignore
          item.profit = profit
          return item
        })
        // @ts-ignore
        .reduce((total, current) => total + Number(current.profit || 0), 0)
    : 0

  const TabItems: any = [
    { key: 1, label: `${intl.formatMessage({ id: 'mt.chicang' })}(${tradeListLen})` },
    { key: 2, label: `${intl.formatMessage({ id: 'mt.guadan' })}(${pendingListLen})` },
    { key: 3, label: intl.formatMessage({ id: 'mt.lishichengjiao' }) }
  ]

  const labelName = {
    1: <FormattedMessage id="mt.chicang" />,
    2: <FormattedMessage id="mt.guadan" />,
    3: <FormattedMessage id="mt.lishichengjiao" />
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
            {tabKey === 1 && (
              <div className="flex items-center border border-gray-250 py-[6px] px-[10px] rounded-lg ml-5 cursor-pointer">
                <img src="/img/shandian.png" width={14} height={14} />
                <span className="text-xs text-gray pl-[3px]">
                  <FormattedMessage id="mt.quanbupingcang" />
                </span>
              </div>
            )}
          </div>
        }
        onChange={(key: any) => {
          setTabKey(key)
        }}
        tabBarGutter={46}
        tabBarStyle={{ paddingLeft: 27 }}
        size="small"
      />
    )
  }, [tradeListLen, pendingListLen, showActiveSymbol, totalProfit, tabKey])

  const renderTabContent = useMemo(() => {
    return (
      <div className="px-2 pb-1 pt-1">
        {tabKey === 1 && <Position parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
        {tabKey === 2 && <PendingOrder parentPopup={popupRef.current} showActiveSymbol={showActiveSymbol} />}
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
