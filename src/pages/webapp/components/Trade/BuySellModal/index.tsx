import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getCurrentQuote } from '@/utils/wsUtil'

import useDisabled from '@/pages/webapp/hooks/trade/useDisabled'
import useSubmitOrder from '@/pages/webapp/hooks/trade/useSubmitOrder'
import Button from '../../Base/Button'
import SheetModal, { SheetRef } from '../../Base/SheetModal'
import { Text } from '../../Base/Text'
import { View } from '../../Base/View'
import SymbolIcon from '../../Quote/SymbolIcon'
import MarginTypeAndLeverageBtn from '../TradeView/comp/MarginTypeAndLeverageBtn'
import OrderConfirmModal, { OrderConfirmModalRef } from '../TradeView/comp/OrderConfirmModal'
import OrderTopTabbar from '../TradeView/comp/OrderTopTabbar'
import BuySellButton from './BuySellButton'

export type BuySellModalRef = {
  show: () => void
  close: () => void
}

const Content = observer(({ close }: { close: () => void }) => {
  const { theme, cn } = useTheme()
  const intl = useIntl()

  const { trade } = useStores()
  const symbolInfo = trade.getActiveSymbolInfo(trade.activeSymbolName, trade.symbolListAll)
  const symbol = symbolInfo.symbol
  const quoteInfo = getCurrentQuote(symbol)
  const bid = quoteInfo.bid // 卖价
  const ask = quoteInfo.ask // 买价
  const per: any = quoteInfo.percent

  return (
    <>
      <View className={cn('w-full flex-1')}>
        <View>
          <View className={cn('flex-row mx-3 mb-[14px]')}>
            <View className={cn('flex-row items-center flex-1 justify-between')}>
              <View className={cn('flex-row gap-x-2 items-center')}>
                <SymbolIcon src={symbolInfo.imgUrl} />
                <Text size="lg" color="primary" weight="medium">
                  {symbol}
                </Text>
                <Text size="base" color={per > 0 ? 'green' : 'red'} weight="medium">
                  {bid ? (per > 0 ? `+${per}%` : `${per}%`) : '--'}
                </Text>
              </View>
              {/* 保证金类型选择、杠杆选择 */}
              <MarginTypeAndLeverageBtn />
            </View>
          </View>
          <View className={cn('flex-row mx-3 border mb-2 p-[5px] rounded-[9px]')} borderColor="weak">
            <BuySellButton position="modal" />
          </View>
        </View>
        <View className={cn('flex-1 overflow-y-auto')}>
          <OrderTopTabbar position="MODAL" />
        </View>
      </View>
    </>
  )
})

const Footer = observer(({ close }: { close: () => void }) => {
  const { theme, cn } = useTheme()
  const intl = useIntl()
  // const { disabledBtn, disabledTrade, onSubmitOrder, onCheckSubmit } = useTrade()
  const { disabledBtn, disabledTrade } = useDisabled()
  const { onSubmitOrder, onCheckSubmit } = useSubmitOrder()
  const { trade } = useStores()
  const { buySell } = trade
  const isBuy = buySell === 'BUY'
  const [submitLoading, setSubmitLoading] = useState(false)

  const orderConfirmModal = useRef<OrderConfirmModalRef>(null)

  // 提交订单
  const handleSubmitOrder = async () => {
    setSubmitLoading(true)

    // 关闭二次确认弹窗
    orderConfirmModal.current?.close?.()
    orderConfirmModal.current?.close?.()
    await onSubmitOrder()
    setSubmitLoading(false)
    close()
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
      <View
        style={{
          backgroundColor: theme.colors.backgroundColor.primary
        }}
      >
        <Button size="large" disabled={disabledBtn} loading={submitLoading} onClick={handleConfirm} type={isBuy ? 'success' : 'danger'}>
          {disabledTrade
            ? intl.formatMessage({ id: 'pages.trade.Account Disabled' })
            : isBuy
            ? intl.formatMessage({ id: 'pages.trade.Confirm buy' })
            : intl.formatMessage({ id: 'pages.trade.Confirm sell' })}
        </Button>
      </View>
      <OrderConfirmModal ref={orderConfirmModal} onConfirm={handleSubmitOrder} />
    </>
  )
})

function BuySellModal(props: any, ref: ForwardedRef<BuySellModalRef>) {
  const bottomSheetModalRef = useRef<SheetRef>(null)

  const { trade } = useStores()
  const { setBuySell, setOrderType, setOrderSpslChecked } = trade

  const close = () => {
    bottomSheetModalRef.current?.sheet?.dismiss()
  }
  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close
  }))

  return (
    <>
      <SheetModal
        onDismiss={() => {
          // 关闭弹窗重置
          setOrderSpslChecked(false)
          setBuySell('BUY')
          setOrderType('MARKET_ORDER')
        }}
        ref={bottomSheetModalRef}
        // height={trade.orderSpslChecked ? '98%' : '80%'}
        autoHeight
        children={<Content close={close} />}
        dragOnContent={false}
        footer={<Footer close={close} />}
      />
    </>
  )
}

export default observer(forwardRef(BuySellModal))
