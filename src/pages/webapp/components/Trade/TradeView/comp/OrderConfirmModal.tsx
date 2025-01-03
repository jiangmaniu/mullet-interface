import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getCurrentQuote } from '@/utils/wsUtil'

import useMargin from '@/hooks/useMargin'
import CheckBox from '../../../Base/CheckBox'
import SheetModal, { SheetRef } from '../../../Base/SheetModal'
import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'
import SymbolIcon from '../../../Quote/SymbolIcon'

type IProps = {
  trigger?: JSX.Element
  onConfirm: () => Promise<any>
}

export type OrderConfirmModalRef = {
  show: () => void
  close: () => void
}

/** 订单确认弹窗 */
function OrderConfirmModal({ trigger, onConfirm }: IProps, ref: ForwardedRef<OrderConfirmModalRef>) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { trade } = useStores()
  const { buySell, orderVolume, marginType } = trade
  const isBuy = buySell === 'BUY'

  const quoteInfo = getCurrentQuote()
  const prepaymentConf = quoteInfo?.prepaymentConf
  const mode = prepaymentConf?.mode
  const isFixedMargin = mode === 'fixed_margin' // 固定预付款
  const isFixedLeverage = mode === 'fixed_leverage' // 固定杠杆
  const isFloatLeverage = mode === 'float_leverage' // 浮动杠杆

  const leverage = useMemo(() => {
    if (isFixedMargin) {
      // 固定预付款
      return intl.formatMessage({ id: 'pages.trade.Fixed Margin Abbr' })
    } else if (isFixedLeverage) {
      return `${prepaymentConf?.fixed_leverage?.leverage_multiple}X`
    } else if (isFloatLeverage) {
      return `${trade.leverageMultiple || 2}X`
    }
    return ''
  }, [isFixedMargin, isFixedLeverage, isFloatLeverage, trade.leverageMultiple])

  const symbolInfo = trade.getActiveSymbolInfo(trade.activeSymbolName, trade.symbolListAll)
  // const { expectedMargin } = useTrade()

  // 接口计算预估保证金
  const expectedMargin = useMargin()

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height={'50%'}
      trigger={trigger}
      title={intl.formatMessage({ id: 'pages.trade.Confirm Order Title' })}
      confirmText={isBuy ? intl.formatMessage({ id: 'pages.trade.Confirm buy' }) : intl.formatMessage({ id: 'pages.trade.Confirm sell' })}
      confirmButtonType={isBuy ? 'success' : 'danger'}
      onConfirm={onConfirm}
      children={
        <View className={cn('px-5')}>
          <View className={cn('flex-row')}>
            <View className={cn('flex-row w-full items-center')}>
              <SymbolIcon src={symbolInfo.imgUrl} width={32} height={32} />
              <View className={cn('pl-3')}>
                <View className={cn('flex-row items-center')}>
                  <Text size="base" weight="medium" className={cn('font-medium')}>
                    {symbolInfo.symbol}
                  </Text>
                  <Text size="sm" weight="medium" color={isBuy ? 'green' : 'red'} className={cn('font-medium pl-2')}>
                    {isBuy
                      ? intl.formatMessage({ id: 'common.enum.TradeBuySell.BUY' })
                      : intl.formatMessage({ id: 'common.enum.TradeBuySell.SELL' })}
                  </Text>
                </View>
                <Text size="sm" className={cn('font-medium')}>
                  {marginType === 'CROSS_MARGIN'
                    ? intl.formatMessage({ id: 'common.enum.MarginType.CROSS_MARGIN' })
                    : intl.formatMessage({ id: 'common.enum.MarginType.ISOLATED_MARGIN' })}
                </Text>
              </View>
            </View>
          </View>
          <View className={cn('items-center flex-row mt-6 mb-3 justify-between')}>
            <View className={cn('items-center flex flex-col')}>
              <Text size="base" weight="medium" color={isBuy ? 'green' : 'red'}>
                {leverage}
              </Text>
              <Text size="sm" color="weak">
                {intl.formatMessage({ id: 'pages.trade.Leverage' })}
              </Text>
            </View>
            <View className={cn('items-center flex flex-col')}>
              <Text size="base" weight="medium">
                {orderVolume}
              </Text>
              <Text size="sm" color="weak">
                {intl.formatMessage({ id: 'pages.trade.OrderVolume' })}
              </Text>
            </View>
            {/* @TODO */}
            {/* <View className={cn('items-center')}>
              <Text size="base" weight="medium">
                100
              </Text>
              <Text size="sm" color="weak">
                {intl.formatMessage({id:'pages.trade.Fee'})}USD
              </Text>
            </View> */}
            <View className={cn('items-center flex flex-col')}>
              <Text size="base" weight="medium">
                {expectedMargin} USD
              </Text>
              <Text size="sm" color="weak">
                {intl.formatMessage({ id: 'pages.trade.Estimated Margin' })}
              </Text>
            </View>
          </View>
          <View className={cn('flex-row mt-5')}>
            <CheckBox
              onChange={(checked) => {
                console.log('checked', checked)
                trade.setOrderConfirmChecked(checked)
              }}
              // checked
              label={intl.formatMessage({ id: 'pages.trade.Order Comfirm No Tip Checked' })}
            />
          </View>
        </View>
      }
    />
  )
}

export default observer(forwardRef(OrderConfirmModal))
