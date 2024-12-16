import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'

import Button from '../../Base/Button'
import { Text } from '../../Base/Text'
import { View } from '../../Base/View'
import Depth from '../../Quote/Depth'
import Header from './comp/Header'
import OrderConfirmModal, { OrderConfirmModalRef } from './comp/OrderConfirmModal'
import { OrderTopTabbar } from './comp/OrderTopTabbar'

const BottomButton = observer(() => {
  const intl = useIntl()
  const { trade } = useStores()
  const isBuy = trade.buySell === 'BUY'
  const { disabledBtn, disabledTrade, onSubmitOrder, onCheckSubmit, orderVolume } = useTrade()
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
    if (!onCheckSubmit()) return
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
      <Button size="large" type={isBuy ? 'success' : 'danger'} disabled={disabledBtn} onClick={handleConfirm} loading={submitLoading}>
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
  const { cn, theme } = useTheme()

  const { trade, ws } = useStores()
  const { activeSymbolName, symbolListAll } = trade
  const symbolInfo = useMemo(() => {
    return symbolListAll.find((item) => item.symbol === activeSymbolName)
  }, [activeSymbolName, symbolListAll.length])

  useEffect(() => {
    // 重置交易状态
    trade.resetTradeAction()
    trade.setOrderType('MARKET_ORDER')

    if (!symbolInfo) return

    // socket
    setTimeout(() => {
      ws.checkSocketReady(() => {
        // 打开行情订阅
        ws.openTrade(
          // 构建参数
          ws.makeWsSymbolBySemi([symbolInfo])[0]
        )
        // 动态订阅汇率品种行情，用于计算下单时保证金等
        ws.subscribeExchangeRateQuote()
      })
    })

    return () => {
      // 离开当前 tab 的时候，取消行情订阅
      ws.closeTrade()
    }
  }, [symbolInfo])

  return (
    <View className={cn('flex-1')}>
      <div className={cn('flex-1 pb-0')}>
        <Header />
        <View className={cn('flex-1 flex-row')}>
          <View className={cn('flex-1')}>
            <OrderTopTabbar />
          </View>
          <Depth />
        </View>
      </div>
      <View className={cn('pb-3 pt-[5px] px-3')}>
        <View className={cn('mt-2')}>
          <BottomButton />
        </View>
      </View>
    </View>
  )
}

export default observer(TradeView)
