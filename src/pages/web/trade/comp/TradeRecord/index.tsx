import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useRef, useTransition } from 'react'

import Checkbox from '@/components/Base/Checkbox'
import Popup from '@/components/Base/Popup'
import Tabs from '@/components/Base/Tabs'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'
import SwitchPcOrWapLayout from '@/layouts/SwitchPcOrWapLayout'
import { IRecordTabKey } from '@/mobx/trade'
import { formatNum, toFixed } from '@/utils'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

import OpenTipsModal from '../Modal/OpenTipsModal'
import FundRecordList from './comp/FundRecordList'
import HistoryCloseList from './comp/HistoryCloseList'
import HistoryPendingList from './comp/HistoryPendingList'
import HistoryPositionList from './comp/HistoryPositionList'
import PendingList from './comp/PendingList'
import PositionList from './comp/PositionList'

type IProps = {
  trigger?: JSX.Element
}

function TradeRecord({ trigger }: IProps) {
  const intl = useIntl()
  const popupRef = useRef()
  const { ws, trade } = useStores()
  const { isPc } = useEnv()
  const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
  const { showActiveSymbol, setShowActiveSymbol } = trade

  const tradeList = trade.positionList
  const pendingList = trade.pendingList
  const stopLossProfitList = trade.stopLossProfitList
  const tabKey = trade.recordTabKey
  const quoteInfo = getCurrentQuote() // 保留，取值才会触发mobx更新

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
    // trade.getStopLossProfitList()
  }, [trade.currentAccountInfo?.id])

  // 当前筛选列表的持仓总浮动盈亏
  const totalProfit = trade.getCurrentAccountFloatProfit(currentPositionList)
  const totalProfitShow = formatNum(toFixed(totalProfit))

  const tabItems: { key: IRecordTabKey; label: any }[] = [
    { key: 'POSITION', label: `${intl.formatMessage({ id: 'mt.chicang' })}(${tradeListLen})` },
    { key: 'PENDING', label: `${intl.formatMessage({ id: 'mt.guadan' })}(${pendingListLen})` },
    { key: 'HISTORY_PENDING', label: intl.formatMessage({ id: 'mt.lishiweituo' }) },
    { key: 'HISTORY_CLOSE', label: intl.formatMessage({ id: 'mt.lishichengjiao' }) },
    { key: 'HISTORY_POSITION', label: intl.formatMessage({ id: 'mt.lishicangwei' }) },
    { key: 'FUND_RECORD', label: intl.formatMessage({ id: 'mt.zijinliushui' }) }

    // { key: 'STOPLOSS_PROFIT', label: `${intl.formatMessage({ id: 'mt.zhiyingzhisun' })}(${stopLossProfitListLen})` },
  ]

  const currentLabelName = tabItems.find((item) => item.key === tabKey)?.label

  const onCheckBoxChange = (e: any) => {
    setShowActiveSymbol(e.target.checked)
  }

  const renderTabs = () => {
    return (
      <Tabs
        items={tabItems}
        tabBarExtraContent={
          <div className="flex items-center mr-2">
            {showActiveSymbol && !!totalProfit && tabKey === 'POSITION' && (
              <span className="mr-5 text-sm text-secondary">
                <span className="pr-[5px]">{activeSymbolName}</span>
                <FormattedMessage id="mt.fudongyingkui" />
                <span className={cn('pl-2 !font-dingpro-medium', totalProfit > 0 ? 'text-green' : 'text-red')}>
                  {totalProfit > 0 ? '+' + totalProfitShow : totalProfitShow} USD
                </span>
              </span>
            )}
            {tabKey !== 'FUND_RECORD' && (
              <Checkbox onChange={onCheckBoxChange} className="max-xl:hidden">
                <span className="text-primary text-sm">
                  <FormattedMessage id="mt.zhizhanshidangqian" />
                </span>
              </Checkbox>
            )}
            {/* 接口暂时不支持 */}
            {/* {tabKey === 'POSITION' && (
              <div className="flex items-center border border-gray-250 py-[6px] px-[10px] rounded-lg ml-5 cursor-pointer">
                <img src="/img/shandian.png" width={14} height={14} />
                <span className="text-xs text-primary pl-[3px]">
                  <FormattedMessage id="mt.quanbupingcang" />
                </span>
              </div>
            )} */}
          </div>
        }
        onChange={(key) => {
          startTransition(() => {
            trade.setTabKey(key as IRecordTabKey)
          })
        }}
        tabBarGutter={46}
        tabBarStyle={{ paddingLeft: 27 }}
        size="small"
        activeKey={trade.recordTabKey}
        marginBottom={0}
      />
    )
  }

  const renderTabContent = () => {
    return (
      <div className="pb-[50px] h-[479px]">
        {tabKey === 'POSITION' && <PositionList parentPopup={popupRef.current} />}
        {tabKey === 'PENDING' && <PendingList parentPopup={popupRef.current} />}
        {tabKey === 'HISTORY_PENDING' && <HistoryPendingList />}
        {tabKey === 'HISTORY_CLOSE' && <HistoryCloseList />}
        {tabKey === 'HISTORY_POSITION' && <HistoryPositionList />}
        {tabKey === 'FUND_RECORD' && <FundRecordList />}
      </div>
    )
  }

  const borderClassName = useEmotionCss(({ token }) => {
    return {
      '&::after': {
        content: "''",
        background: 'var(--divider-line-color)',
        width: 1,
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 10
      }
    }
  })

  return (
    <>
      <SwitchPcOrWapLayout
        pcComponent={
          <div className={cn('pt-1 mb-3 bg-primary relative z-[1]', borderClassName)}>
            {renderTabs()}
            {renderTabContent()}
          </div>
        }
        wapComponent={
          <Popup title={currentLabelName} trigger={trigger} ref={popupRef} position="bottom" height="80vh">
            {renderTabs()}
            <div className="h-[70vh] overflow-y-auto pb-10">{renderTabContent()}</div>
          </Popup>
        }
      />
      {/* 平仓成功弹窗 */}
      <OpenTipsModal />
    </>
  )
}

export default observer(TradeRecord)
