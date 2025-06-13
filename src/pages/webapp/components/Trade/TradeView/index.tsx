import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import usePageVisibility from '@/hooks/usePageVisibility'
import useDisabled from '@/pages/webapp/hooks/trade/useDisabled'
import useSubmitOrder from '@/pages/webapp/hooks/trade/useSubmitOrder'
import Button from '../../Base/Button'
import { Text } from '../../Base/Text'
import { View } from '../../Base/View'
import Depth from '../../Quote/Depth'
import Header from './comp/Header'
import OrderConfirmModal, { OrderConfirmModalRef } from './comp/OrderConfirmModal'
import OrderTopTabbar from './comp/OrderTopTabbar'

export const BottomButton = observer(() => {
  const intl = useIntl()
  const { trade } = useStores()
  const isBuy = trade.isBuy
  const { orderVolume } = trade
  const { disabledTrade } = useDisabled()
  const { onSubmitOrder, onCheckSubmit } = useSubmitOrder()

  const orderConfirmModal = useRef<OrderConfirmModalRef>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // 提交订单
  const handleSubmitOrder = async () => {
    setSubmitLoading(true)
    // 关闭二次确认弹窗
    orderConfirmModal.current?.close?.()
    await onSubmitOrder()
    setSubmitLoading(false)
  }

  const handleConfirm = async () => {
    // if (!onCheckSubmit()) return
    // 提醒弹窗
    if (trade.orderConfirmChecked) {
      // 直接下单，不在二次确认
      handleSubmitOrder()
    } else {
      // 弹窗再次确认下单
      orderConfirmModal.current?.show()
    }
  }
  return (
    <>
      {/*  */}
      <Button size="large" type={isBuy ? 'success' : 'danger'} onClick={handleConfirm} loading={submitLoading}>
        <Text color="reverse" weight="medium" size="base">
          {disabledTrade
            ? intl.formatMessage({ id: 'pages.trade.Account Disabled' })
            : `${
                isBuy ? intl.formatMessage({ id: 'pages.trade.Buy btn' }) : intl.formatMessage({ id: 'pages.trade.Sell btn' })
              } ${intl.formatMessage({ id: 'pages.trade.xx lot' }, { count: Number(orderVolume) })}`}
        </Text>
      </Button>
      <OrderConfirmModal ref={orderConfirmModal} onConfirm={handleSubmitOrder} />
    </>
  )
})

function TradeView() {
  const { cn } = useTheme()

  const { trade, ws } = useStores()
  const { activeSymbolName } = trade

  useEffect(() => {
    if (activeSymbolName) {
      trade.setActiveSymbolName(activeSymbolName)
    }
  }, [activeSymbolName])

  useEffect(() => {
    // 重置交易状态
    trade.resetTradeAction()
    trade.setOrderType('MARKET_ORDER')
    trade.subscribeCurrentAndPositionSymbol({ cover: true })

    return () => {
      // 离开当前页面的时候，取消行情订阅
      ws.closePosition()
    }
  }, [activeSymbolName])

  usePageVisibility(
    () => {
      // 用户从后台切换回前台时执行的操作
      trade.subscribeCurrentAndPositionSymbol({ cover: true })
    },
    () => {
      // 用户从前台切换到后台时执行的操作
    }
  )

  return (
    <View
      className={cn('overflow-y-auto pb-[80px]')}
      style={{
        height: 'calc(100vh - 200px)'
      }}
    >
      <div className={cn('flex-1 pb-8 overflow-y-auto')}>
        <Header />
        <View className={cn('flex-1 flex-row')}>
          <View className={cn('flex-1')}>
            <OrderTopTabbar />
          </View>
          <Depth />
        </View>
      </div>
      {/* <View
        className={cn(
          'px-3 fixed w-full',
          isPwaApp ? (isSafari ? 'bottom-[100px]' : 'bottom-[80px]') : 'bottom-[60px]'
        )}
      >
        <View className={cn('mt-2')}>
          <BottomButton />
        </View>
      </View> */}
    </View>
  )
}

export default observer(TradeView)
