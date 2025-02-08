import { SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import OrderVolume from '@/pages/webapp/components/Trade/TradeView/comp/OrderTopTabbar/OrderVolume'
import PendingPrice from '@/pages/webapp/components/Trade/TradeView/comp/OrderTopTabbar/PendingPrice'
import FullModeSpSl from '@/pages/webapp/components/Trade/TradeView/comp/SetSpSl/FullModeSpSl'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum } from '@/utils'
import { observer } from 'mobx-react'

export type IFormValues = {
  /** 价格 */
  limitPrice?: any
  /** 手数 */
  orderVolume?: any
  /** 止损 */
  stopLoss?: any
  /** 止盈 */
  takeProfit?: any
}
export type OnValueChange = (value: IFormValues) => void
type IProps = {
  item: Order.OrderPageListItem
  // spslInfo: IModifyPending
  /** 监听输入框值变化 */
  onValueChange?: OnValueChange
}

export const RenderPendingTab = observer((props: IProps) => {
  const { cn } = useTheme()
  const { t } = useI18n()
  const item = props.item || {}
  const { trade } = useStores()

  const buySell = item.buySell as API.TradeBuySell
  const isBuy = buySell === 'BUY'

  const maxOpenVolume = trade.maxOpenVolume

  const {
    // 使用全局变量保存值，方便在hooks中实时计算，避免多个地方修改
    expectedMargin
  } = useTrade({
    limitStopItem: item
  })

  return (
    <View className={cn('mt-3')}>
      <PendingPrice />
      {/* <PendingPrice
        onChange={(value) => {
          if (Number.isNaN(Number(value))) {
            return
          }
          const val = Number(value) > 0 ? value : ''
          setLimitPrice(val)
        }}
        value={String(limitPrice || '')}
        priceRange={
          <>
            {priceRangeSymbol} {formatNum(priceTip)}
          </>
        }
        showPriceTipRedColor={showPriceTipRedColor}
      /> */}
      {/* 手数 */}
      <View className={cn('items-center mb-2 justify-between flex-row w-full')}>
        <Text color="primary" weight="medium">
          {isBuy ? t('pages.trade.Buy Lot') : t('pages.trade.Sell Lot')}
        </Text>
        <View className={cn('items-center flex-row')}>
          <Text color="weak" size="xs" className={cn('pr-1')}>
            {t('pages.trade.Max Open Volume')}
          </Text>
          <Text color="primary" size="xs" weight="medium">
            {Number(maxOpenVolume) < 0 ? '--' : maxOpenVolume} {t('pages.trade.Lot')}
          </Text>
        </View>
      </View>
      <OrderVolume />
      <View className={cn('mt-3 flex-row gap-x-3 items-center justify-end')}>
        <View className={cn('flex-row items-center')}>
          <Text color="weak" size="xs" className={cn('pr-2')}>
            {t('pages.trade.Estimated Margin')}
          </Text>
          <Text color="primary" size="xs" weight="medium">
            {formatNum(expectedMargin, { precision: trade.currentAccountInfo.currencyDecimal })} {SOURCE_CURRENCY}
          </Text>
        </View>
        {/* <View className={cn('flex-row items-center')}>
            <Text color="weak" size="xs" className={cn('pr-2')}>
              {t('pages.trade.Fee')}
            </Text>
            <Text color="primary" size="xs" weight="medium">
              121.212
            </Text>
          </View> */}
      </View>
    </View>
  )
})

export const RenderSpSlTab = observer(() => {
  return <FullModeSpSl useOuterTrade />
})
