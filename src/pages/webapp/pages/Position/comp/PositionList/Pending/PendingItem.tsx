import { TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getCurrentQuote } from '@/utils/wsUtil'
import { observer } from 'mobx-react'
import CancelPendingOrderModal from './comp/CancelPendingOrderModal'
import ModifyPendingOrderModal from './comp/ModifyPendingOrderModal'

type IProps = {
  item: Order.OrderPageListItem
}

// 挂单列表Item
function PendingItem({ item }: IProps) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade } = useStores()
  const { currentAccountInfo } = trade
  const symbol = item.symbol
  const quoteInfo = getCurrentQuote(symbol)

  let currentPrice = item.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid

  if (item.type === 'LIMIT_BUY_ORDER' || item.type === 'LIMIT_SELL_ORDER') {
    // 限价单价格不要取反
    currentPrice = item.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.ask : quoteInfo?.bid
  }

  return (
    <View bgColor="primary" className={cn('rounded-xl py-3 mb-[10px]')}>
      <View className={cn('flex-row items-center px-3 justify-between')}>
        <View className={cn('flex-row items-center')}>
          <SymbolIcon width={24} height={24} src={item.imgUrl} />
          <View className={cn('pl-2 flex-row items-center')}>
            <Text size="base" color="primary" font="pf-bold" className={cn('pr-1')}>
              {item.alias || item.symbol}
            </Text>
            <Text size="sm" color={item.buySell === 'BUY' ? 'green' : 'red'} weight="medium">
              {item.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')}{' '}
              {item.leverageMultiple ? `${item.leverageMultiple}X ` : ''}
            </Text>
            {(item.takeProfit || item.stopLoss) && (
              <View className={cn('flex-row items-center ml-1')}>
                <View
                  className={cn('rounded-tl rounded-bl w-[17px] h-[14px] items-center justify-center')}
                  style={{
                    backgroundColor: theme.colors.green.DEFAULT
                  }}
                >
                  <Text size="xxs" weight="medium" leading="xs" color="white">
                    TP
                  </Text>
                </View>
                <View
                  className={cn('rounded-tr rounded-br w-[17px] h-[14px] items-center justify-center')}
                  style={{
                    backgroundColor: theme.colors.red.DEFAULT
                  }}
                >
                  <Text size="xxs" weight="medium" leading="xs" color="white">
                    SL
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <Text size="sm">
          {item.type === 'LIMIT_BUY_ORDER' || item.type === 'LIMIT_SELL_ORDER'
            ? t('pages.trade.OrderType LimitOrder')
            : t('pages.trade.OrderType StopLimitOrder')}
        </Text>
      </View>
      <View className={cn('border-b my-[10px]')} borderColor="weak" />
      <View className={cn('flex-row items-center justify-between px-3')}>
        <View className={cn('items-start flex flex-col')}>
          <Text size="xs" color="weak" leading="sm" className={cn('pb-[6px]')}>
            {t('pages.position.Entrusted price')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item.limitPrice || '--'}
          </Text>
        </View>
        <View className={cn('items-start flex flex-col')}>
          <Text size="xs" color="weak" leading="sm" className={cn('pb-[6px]')}>
            {t('pages.position.Entrusted count')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item.orderVolume || '--'}
          </Text>
        </View>
        <View className={cn('items-start flex flex-col')}>
          <Text size="xs" color="weak" leading="sm" className={cn('pb-[6px]')}>
            {t('pages.position.Order Close Price')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item.tradePrice || '--'}
          </Text>
        </View>
        <View className={cn('items-end flex flex-col')}>
          <Text size="xs" color="weak" leading="sm" className={cn('pb-[6px]')}>
            {t('pages.position.Order Close Volume')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item.tradingVolume || '--'}
          </Text>
        </View>
      </View>
      <View className={cn('pt-3 px-3 flex-row items-center gap-x-2')}>
        <ModifyPendingOrderModal
          trigger={
            <Button size="xs" containerClassName={cn('flex-1')}>
              {t('common.operate.Modify')}
            </Button>
          }
          item={item}
          tabKey="PENDING"
        />
        <CancelPendingOrderModal
          trigger={
            <Button size="xs" containerClassName={cn('flex-1')}>
              {t('common.operate.Cancel Order')}
            </Button>
          }
          item={item}
        />
      </View>
    </View>
  )
}

export default observer(PendingItem)
