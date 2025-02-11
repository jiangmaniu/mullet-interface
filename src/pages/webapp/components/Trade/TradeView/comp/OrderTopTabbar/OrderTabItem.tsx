/* eslint-disable simple-import-sort/imports */
import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useMemo } from 'react'

import { SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import Switch from '@/pages/webapp/components/Base/Switch'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { formatNum } from '@/utils'
import { getCurrentDepth } from '@/utils/wsUtil'

import useMargin from '@/hooks/useMargin'
import useQuote from '@/pages/webapp/hooks/trade/useQoute'
import { IPosition } from '.'
import SetSpSl from '../SetSpSl'
import OrderVolume from './OrderVolume'
import PendingPrice from './PendingPrice'

type IProps = {
  position?: IPosition
}

/** 交易订单Tab */
function OrderTabItem({ position }: IProps) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { trade } = useStores()
  const {
    orderType,
    orderSpslChecked,
    setOrderQuickPlaceOrderChecked,
    orderQuickPlaceOrderChecked,
    setOrderVolume,
    setOrderPrice,
    maxOpenVolume // 最大可开仓量
  } = trade

  const availableMargin = trade.accountBalanceInfo.availableMargin

  /**
   *  useTrade 分成 useOpenVolumn、useOrderType、useQuote
   * */
  const isMarketOrder = useMemo(() => orderType === 'MARKET_ORDER', [orderType]) // 市价单
  const { vmin, getInitPriceValue, isBuy } = useQuote() // 行情相关：价格、小数位、买卖方向
  // 尽量从 trade 中取数据和方法

  // 接口计算预估保证金
  const expectedMargin = useMargin()

  const depth = getCurrentDepth()
  const hasDepth = useMemo(() => depth?.asks?.length && depth?.asks.length > 0 && depth?.bids?.length && depth?.bids.length > 0, [depth])

  // 切换品种、买卖重置内容
  useEffect(() => {
    setOrderVolume(vmin)
  }, [vmin])

  useEffect(() => {
    !isMarketOrder && setOrderPrice(getInitPriceValue())
  }, [isMarketOrder])

  return (
    <View className={cn('flex-1 px-3', position === 'PAGE' && 'px-3', !!hasDepth && position === 'PAGE' && 'pr-0')}>
      {/* <ScrollView showsVerticalScrollIndicator={false} className={cn('flex-1')} contentContainerStyle={{ paddingBottom: 20 }} bounces={false}> */}
      <View className={cn('mt-2')}>
        {isMarketOrder && (
          <TextField
            // value={}
            disabled
            readOnly
            className={'text-sm font-medium text-primary'}
            height={40}
            textAlign="center"
            containerClassName={'mb-3'}
            placeholder={intl.formatMessage({ id: 'pages.trade.OrderType MarketOrder' })}
          />
        )}
        {!isMarketOrder && <PendingPrice />}
        <View className={cn('items-end justify-between flex-row w-full')}>
          <Text color="primary" weight="medium">
            {isBuy ? intl.formatMessage({ id: 'pages.trade.Buy Lot' }) : intl.formatMessage({ id: 'pages.trade.Sell Lot' })}
          </Text>
          <View className={cn('items-end flex-row')}>
            <Text color="weak" size="xs" className={cn('pr-1')}>
              {intl.formatMessage({ id: 'pages.trade.Max Open Volume' })}
            </Text>
            <Text color="primary" size="xs" font="dingpro-medium" weight="medium">
              {Number(maxOpenVolume) < 0 || maxOpenVolume === Infinity ? '--' : maxOpenVolume}{' '}
              {intl.formatMessage({ id: 'pages.trade.Lot' })}
            </Text>
          </View>
        </View>
        <View className={cn('mt-2')}>
          {/* 下单手数 */}
          <OrderVolume isFull={position === 'MODAL'} />

          {/* k线页面 快速下单-弹窗展示 */}
          {position === 'MODAL' && (
            <View className={cn('mt-2 flex-row items-center justify-end')}>
              <Text size="xs" color="weak">
                {intl.formatMessage({ id: 'pages.trade.Estimated Margin' })}
              </Text>
              <Text size="xs" color="primary" className={cn('px-1')}>
                {expectedMargin || '--'} {SOURCE_CURRENCY}
              </Text>
              {/* <View className={cn('h-2 w-[1px] mx-1', { backgroundColor: theme.colors.Divider.primary })} /> */}
              {/* @TODO 计算公式？ */}
              {/* <Text size="xs" color="weak" className={cn('px-1')}>
                  {intl.formatMessage({id:"pages.trade.Fee"})}
                </Text>
                <Text size="xs" color="primary">
                  0.3254 USD
                </Text> */}
            </View>
          )}
        </View>
        {/* 止盈止损 */}
        <View className={cn('mt-[14px]')}>
          <SetSpSl isFull={position === 'MODAL'} />
        </View>
      </View>
      {/* 交易页面展示 */}
      {position === 'PAGE' && (
        <View className={cn('mt-4')}>
          <View className={cn('flex-row justify-between items-center mb-1')}>
            <Text color="weak">{intl.formatMessage({ id: 'pages.trade.Available Margin' })}</Text>
            <Text color="primary" weight="medium" font="dingpro-medium">
              {formatNum(availableMargin, { precision: trade.currentAccountInfo.currencyDecimal })} {SOURCE_CURRENCY}
            </Text>
          </View>
          <View className={cn('flex-row justify-between items-center mb-1')}>
            <Text color="weak">{intl.formatMessage({ id: 'pages.trade.Estimated Margin' })}</Text>
            <Text color="primary" weight="medium" font="dingpro-medium">
              {expectedMargin || '--'} {SOURCE_CURRENCY}
            </Text>
          </View>
        </View>
      )}
      {/* k线页面 快速下单-弹窗展示 */}
      {position === 'MODAL' && (
        <View className={cn('flex-row items-center justify-between', !orderSpslChecked && 'mt-5')}>
          <View className={cn('flex-col items-start gap-x-2 flex')}>
            <Text color="primary" size="base" weight="medium">
              {intl.formatMessage({ id: 'pages.trade.Quick place order' })}
            </Text>
            <Text color="weak" size="xs">
              {intl.formatMessage({ id: 'pages.trade.Close quick place order tips' })}
            </Text>
          </View>
          <Switch
            onChange={(checked) => {
              setOrderQuickPlaceOrderChecked(checked)
            }}
            checked={orderQuickPlaceOrderChecked}
          />
        </View>
      )}
      {/* </ScrollView> */}
    </View>
  )
}

export default observer(OrderTabItem)
