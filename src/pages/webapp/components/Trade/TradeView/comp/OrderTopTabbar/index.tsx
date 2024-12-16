import { useIntl } from '@umijs/max'
import { useMemo } from 'react'

import { useStores } from '@/context/mobxProvider'
import Tabs from '@/pages/webapp/components/Base/Tabs'

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

  const handleReset = () => {
    // 重置交易数据
    trade.resetTradeAction()
  }

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
        />
        <OrderTabItem position={position} />
      </>
    )
  }, [position])

  return <>{renderTabs}</>
}
