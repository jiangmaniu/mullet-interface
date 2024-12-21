import { useIntl } from '@umijs/max'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { useStores } from '@/context/mobxProvider'
import Tabs from '@/pages/webapp/components/Base/Tabs'

import { getCurrentDepth } from '@/utils/wsUtil'
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
export function OrderTopTabbar({ position = 'PAGE' }: IProps) {
  const intl = useIntl()
  const { trade } = useStores()
  const hasDepthRef = useRef(false)

  const depth = getCurrentDepth()
  const hasDepth = useMemo(() => depth?.asks?.length && depth?.asks.length > 0 && depth?.bids?.length && depth?.bids.length > 0, [depth])

  const handleReset = useCallback(() => {
    // 重置交易数据
    trade.resetTradeAction()
  }, [])

  useEffect(() => {
    hasDepthRef.current = !!hasDepth
  }, [hasDepth])

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
            trade.setOrderSpslChecked(false)
            // 重置交易数据
            handleReset()
          }}
          stretch
          fixedActiveLineWidth={hasDepthRef.current ? 30 : 100}
        />
      </>
    )
  }, [hasDepthRef.current])

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
