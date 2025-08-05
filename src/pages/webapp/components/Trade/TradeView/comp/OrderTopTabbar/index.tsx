import { useIntl } from '@umijs/max'
import { useCallback, useMemo } from 'react'

import { useStores } from '@/context/mobxProvider'
import Tabs from '@/pages/webapp/components/Base/Tabs'

import useCurrentDepth from '@/hooks/useCurrentDepth'
import { observer } from 'mobx-react'
import OrderTabItem from './OrderTabItem'

type Params = {
  tabKey: 'MARKET_ORDER' | 'LIMIT_ORDER' | 'STOP_LIMIT_ORDER'
}

export type IPosition = 'MODAL' | 'PAGE'
type IProps = {
  /** 组件出现的位置 弹窗、页面 */
  position?: IPosition
}

// 行情Tabs
function OrderTopTabbar({ position = 'PAGE' }: IProps) {
  const intl = useIntl()
  const { trade } = useStores()

  const depth = useCurrentDepth()
  const hasDepth = depth?.asks?.length && depth?.asks.length > 0 && depth?.bids?.length && depth?.bids.length > 0

  const handleReset = useCallback(() => {
    // 重置交易数据
    trade.resetTradeAction()
  }, [])

  const renderTabs = useMemo(() => {
    return (
      <>
        <Tabs
          items={[
            { title: intl.formatMessage({ id: 'pages.trade.OrderType MarketOrder' }), key: 'MARKET_ORDER' },
            { title: intl.formatMessage({ id: 'pages.trade.OrderType LimitOrder' }), key: 'LIMIT_ORDER' },
            { title: intl.formatMessage({ id: 'pages.trade.OrderType StopLimitOrder' }), key: 'STOP_LIMIT_ORDER' }
          ]}
          onChange={(key: any) => {
            trade.setOrderType(key)
            // trade.setOrderSpslChecked(false)
            // 重置交易数据
            handleReset()
          }}
          activeKey={trade.orderType}
          stretch
          tabBarGutter={0}
          fixedActiveLineWidth={hasDepth && position === 'PAGE' ? 30 : 100}
        />
      </>
    )
  }, [hasDepth, position, trade.orderType])

  const renderTabItem = useMemo(() => {
    return <OrderTabItem position={position} />
  }, [position])

  return (
    <>
      {renderTabs}
      {renderTabItem}
    </>
  )
}

export default observer(OrderTopTabbar)
