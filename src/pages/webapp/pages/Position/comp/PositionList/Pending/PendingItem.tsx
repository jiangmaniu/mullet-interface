import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum } from '@/utils'
import { observer } from 'mobx-react'
import { forwardRef } from 'react'
import CancelPendingOrderModal from './comp/CancelPendingOrderModal'
import ModifyPendingOrderModal from './comp/ModifyPendingOrderModal'

type IProps = {
  item: Order.OrderPageListItem
}

// 挂单列表Item
function PendingItem({ item }: IProps) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  return (
    <View bgColor="primary" className={cn('rounded-xl py-3 mb-[10px]')}>
      <View style={cn('flex-row items-center px-3 justify-between')}>
        <View style={cn('flex-row items-center')}>
          <SymbolIcon width={32} height={32} src={item?.imgUrl} />
          <View style={cn('pl-2')}>
            <Text size="base" color="primary" weight="medium" style={cn('pr-1')}>
              {item?.alias || item?.symbol}
            </Text>
            <View style={cn('flex-row items-center gap-x-[6px]')}>
              <View
                className={cn('flex-row items-center rounded p-[1px] border')}
                style={{
                  borderWidth: 1,
                  backgroundColor: item.buySell === 'BUY' ? 'rgba(69,164,138,0.2)' : 'rgba(235, 72, 72, 0.2)',
                  borderColor: item.buySell === 'BUY' ? theme.colors.green.DEFAULT : theme.colors.red.DEFAULT
                }}
              >
                <Text size="xs" style={cn('text-center')} color={item.buySell === 'BUY' ? 'green' : 'red'}>
                  {item?.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')}{' '}
                </Text>
              </View>
              <View style={cn('flex-row items-center rounded p-[1px] border border-[#B4B4B4]')}>
                <Text size="xs" style={cn('text-center')}>
                  {item?.marginType === 'CROSS_MARGIN'
                    ? t('common.enum.MarginType.CROSS_MARGIN')
                    : t('common.enum.MarginType.ISOLATED_MARGIN')}
                  {item?.leverageMultiple ? `${item?.leverageMultiple}X ` : ''}
                </Text>
              </View>
              <View style={cn('flex-row items-center rounded px-[2px] py-[1px] border border-[#B4B4B4]')}>
                <Text size="xs" style={cn('text-center')}>
                  {item?.type === 'LIMIT_BUY_ORDER' || item?.type === 'LIMIT_SELL_ORDER'
                    ? t('pages.trade.OrderType LimitOrder')
                    : t('pages.trade.OrderType StopLimitOrder')}
                </Text>
              </View>
              {(item?.takeProfit || item?.stopLoss) && (
                <View style={cn('flex-row items-center')}>
                  <View
                    style={cn('rounded-tl rounded-bl w-[17px] h-[14px] items-center justify-center', {
                      backgroundColor: theme.colors.green.DEFAULT
                    })}
                  >
                    <Text size="xxs" weight="medium" leading="xs" color="white">
                      TP
                    </Text>
                  </View>
                  <View
                    style={cn('rounded-tr rounded-br w-[17px] h-[14px] items-center justify-center', {
                      backgroundColor: theme.colors.red.DEFAULT
                    })}
                  >
                    <Text size="xxs" weight="medium" leading="xs" color="white">
                      SL
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      {/* <View className={cn('border-b my-[10px]')} borderColor="weak" /> */}
      <View style={cn('flex flex-row items-center justify-between px-3 mt-4')}>
        <View style={cn('flex flex-col items-start')}>
          <Text size="xs" color="weak" leading="sm" style={cn('pb-[6px]')}>
            {t('pages.position.Entrusted count')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item?.orderVolume ? formatNum(item?.orderVolume, { precision: 2 }) : '0.00'}
          </Text>
        </View>
        <View style={cn('flex flex-col items-center')}>
          <Text size="xs" color="weak" leading="sm" style={cn('pb-[6px]')}>
            {t('pages.position.Entrusted price')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {formatNum(item?.limitPrice, { precision: 2 }) || '0.00'}
          </Text>
        </View>
        {/* <View style={cn('items-start')}>
          <Text size="xs" color="weak" leading="sm" style={cn('pb-[6px]')}>
            {t('pages.position.Order Close Price')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item?.tradePrice || FIXED_ZERO_VALUE}
          </Text>
        </View>
        <View style={cn('items-end')}>
          <Text size="xs" color="weak" leading="sm" style={cn('pb-[6px]')}>
            {t('pages.position.Order Close Volume')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item?.tradingVolume || FIXED_ZERO_VALUE}
          </Text>
        </View> */}
        <View style={cn('flex-col items-end')}>
          <Text size="xs" color="weak" leading="sm" style={cn('pb-[6px]')}>
            {t('mt.xiadanshijian')}
          </Text>
          <Text size="sm" color="primary" leading="sm">
            {item?.createTime}
          </Text>
        </View>
      </View>
      <View className={cn('pt-3 px-3 flex-row items-center gap-x-2')}>
        <ModifyPendingOrderModal
          trigger={
            <Button className={cn('bg-[#F3F5F6]')} size="xs" containerClassName={cn('flex-1')}>
              {t('common.operate.Modify')}
            </Button>
          }
          item={item}
          tabKey="PENDING"
        />
        <CancelPendingOrderModal
          trigger={
            <Button className={cn('bg-[#F3F5F6]')} size="xs" containerClassName={cn('flex-1')}>
              {t('common.operate.Cancel Order')}
            </Button>
          }
          item={item}
        />
      </View>
    </View>
  )
}

export default observer(forwardRef(PendingItem))
