import { SOURCE_CURRENCY } from '@/constants'
import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import CheckBox from '@/pages/webapp/components/Base/CheckBox'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum } from '@/utils'
import { message } from '@/utils/message'
import { useGetCurrentQuoteCallback } from '@/utils/wsUtil'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'

type IProps = {
  trigger?: JSX.Element
  item: Order.BgaOrderPageListItem
  onClose: () => void
}

// 利润组件
export const ModalProfit = observer(({ profit, precision }: { profit: number | undefined; precision?: number }) => {
  const profitFormat = Number(profit) ? formatNum(profit, { precision }) : profit || '-'

  return (
    <Text size="xl" weight="medium" font="dingpro-medium" color={Number(profit) > 0 ? 'green' : 'red'}>
      {Number(profit) > 0 ? '+' + profitFormat : profitFormat} {SOURCE_CURRENCY}
    </Text>
  )
})

/** 市价平仓确认弹窗 */
function MarketCloseConfirmModal({ trigger, item: rawItem, onClose }: IProps, ref: ForwardedRef<SheetRef>) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const precision = trade.currentAccountInfo.currencyDecimal

  // 使用worker计算的值
  const positionListSymbolCalcInfo = trade.positionListSymbolCalcInfo
  const calcInfo = positionListSymbolCalcInfo.get(rawItem.id)

  /**
   * 在组件内部管理 item 状态变化，避免重渲染
   * item 根据  covertProfit 变化
   */
  const item = useMemo(() => {
    if (!rawItem) {
      return rawItem
    }

    // rawItem.profit = covertProfit(rawItem) as number // 浮动盈亏

    // 使用worker计算的值
    rawItem.profit = calcInfo?.profit || 0

    // 全仓使用基础保证金
    if (rawItem.marginType === 'CROSS_MARGIN') {
      rawItem.orderMargin = rawItem.orderBaseMargin
    }

    return rawItem
  }, [rawItem, calcInfo])

  const symbol = item?.symbol
  const getCurrentQuote = useGetCurrentQuoteCallback()
  const quoteInfo = getCurrentQuote(symbol)

  const profit = useMemo(() => {
    return item?.profit as number // 浮动盈亏
  }, [item?.profit])

  const orderMargin = useMemo(
    () => (item?.orderMargin ? formatNum(item?.orderMargin, { precision }) : '--'),
    [item?.orderMargin, precision]
  )

  const symbolInfo = trade.getActiveSymbolInfo(trade.activeSymbolName, trade.symbolListAll)

  const bottomSheetModalRef = useRef<SheetRef>(null)

  const close = () => bottomSheetModalRef.current?.sheet?.dismiss(onClose)

  useImperativeHandle(ref, () => ({
    sheet: {
      present: () => bottomSheetModalRef.current?.sheet?.present(),
      dismiss: close
    }
    // visible: bottomSheetModalRef.current?.visible ?? false
  }))

  // 标记价
  const currentPrice = useMemo(
    () => (item?.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask), // 价格需要取反方向的
    [item?.buySell, quoteInfo?.bid, quoteInfo?.ask]
  )

  // 保证金确认
  const submitPosition = useCallback(async () => {
    const count = item?.orderVolume || 0

    if (count < 0.01) {
      message.info(t('pages.trade.Input Volume Min Error', { min: 0.01 }))
      return
    }
    // 平仓下一个反方向的单
    const params = {
      symbol,
      buySell: item?.buySell === TRADE_BUY_SELL.BUY ? TRADE_BUY_SELL.SELL : TRADE_BUY_SELL.BUY, // 订单方向
      orderVolume: count,
      tradeAccountId: item?.tradeAccountId,
      executeOrderId: item?.id, // 持仓单号
      type: ORDER_TYPE.MARKET_ORDER // 订单类型
    } as Order.CreateOrder

    console.log('平仓参数', params)

    const res = await trade.createOrder(params)

    if (res.success) {
      // 关闭弹窗
      close()

      // 更新账户余额信息
      fetchUserInfo()
    }
  }, [symbol, item, t, trade.createOrder, close, fetchUserInfo])

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      // height={'45%'}
      autoHeight
      trigger={trigger}
      title={t('pages.trade.Market Price Close Position')}
      confirmText={
        <Text size="base" color="reverse" weight="medium">
          {t('pages.trade.Confirm Close Position')}
          <Text size="base" color="reverse" weight="medium" font="dingpro-medium">
            &nbsp;{formatNum(currentPrice, { precision: item?.symbolDecimal })}
          </Text>
        </Text>
      }
      confirmButtonType={item?.buySell === 'BUY' ? 'success' : 'danger'}
      onConfirm={submitPosition}
      children={
        <View className={cn('mt-5 px-5')}>
          <View className={cn('flex-row justify-between w-full')}>
            <View className={cn('flex-row items-center')}>
              <SymbolIcon src={item?.imgUrl} width={32} height={32} />
              <View className={cn('pl-3')}>
                <View className={cn('flex-row items-center')}>
                  <Text size="base" weight="medium" className={cn('font-medium')}>
                    {item?.alias || item?.symbol}
                  </Text>
                  <Text size="sm" weight="medium" color={item?.buySell === 'BUY' ? 'green' : 'red'} className={cn('font-medium pl-2')}>
                    {item?.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')}
                  </Text>
                </View>
                <Text size="sm" className={cn('font-medium')}>
                  {item.marginType === 'CROSS_MARGIN'
                    ? t('common.enum.MarginType.CROSS_MARGIN')
                    : t('common.enum.MarginType.ISOLATED_MARGIN')}
                </Text>
              </View>
            </View>
            <ModalProfit profit={profit} precision={precision} />
          </View>
          <View className={cn('items-center flex-row mt-6 mb-3 justify-between')}>
            <View className={cn('items-center flex flex-col')}>
              <Text size="base" weight="medium" color={item?.buySell === 'BUY' ? 'green' : 'red'}>
                {item?.leverageMultiple ? `${item?.leverageMultiple}X ` : ''}
              </Text>
              <Text size="sm" color="weak">
                {t('pages.trade.Leverage')}
              </Text>
            </View>
            <View className={cn('items-center flex flex-col')}>
              <Text size="base" weight="medium">
                {item?.orderVolume}
              </Text>
              <Text size="sm" color="weak">
                {t('pages.trade.OrderVolume')}
              </Text>
            </View>
            <View className={cn('items-center flex flex-col')}>
              <Text size="base" font="dingpro-medium" weight="medium">
                {orderMargin} {SOURCE_CURRENCY}
              </Text>
              <Text size="sm" color="weak">
                {t('pages.trade.Margin')}
              </Text>
            </View>
          </View>
          <View className={cn('flex-row mt-5')}>
            <CheckBox
              onChange={(checked) => {
                trade.setPositionConfirmChecked(checked)
              }}
              checked={trade.positionConfirmChecked}
              label={t('pages.trade.Order Comfirm No Tip Checked')}
            />
          </View>
        </View>
      }
    />
  )
}

export default observer(forwardRef(MarketCloseConfirmModal))
