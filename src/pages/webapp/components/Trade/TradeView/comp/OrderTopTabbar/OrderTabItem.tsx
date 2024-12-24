/* eslint-disable simple-import-sort/imports */
import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useMemo } from 'react'

import { SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import Switch from '@/pages/webapp/components/Base/Switch'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { formatNum } from '@/utils'
import { getCurrentDepth } from '@/utils/wsUtil'

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
  const { buySell, orderType, orderSpslChecked, setOrderQuickPlaceOrderChecked, orderQuickPlaceOrderChecked } = trade
  // const [activeTag, setActiveTag] = useState<any>('')
  // const tabKey = orderType
  // const position = props.position // 组件的位置

  const availableMargin = trade.accountBalanceInfo.availableMargin

  const {
    expectedMargin,
    maxOpenVolume,
    vmin,
    isMarketOrder,
    isBuy,
    d,
    symbol,

    // 方法
    // setSl,
    // setSp,
    setOrderVolume,
    setOrderPrice,
    onAdd,
    onMinus,
    resetSpSl,
    getInitPriceValue
  } = useTrade()

  const depth = getCurrentDepth()
  const hasDepth = useMemo(() => depth?.asks?.length && depth?.asks.length > 0 && depth?.bids?.length && depth?.bids.length > 0, [depth])

  // 切换品种、买卖重置内容
  useEffect(() => {
    resetSpSl()
    setOrderVolume(vmin)
    setOrderPrice(getInitPriceValue())
  }, [symbol, buySell, orderType, vmin])

  useEffect(() => {
    // 取消勾选了止盈止损，重置值
    if (!orderSpslChecked) {
      resetSpSl()
    }
  }, [orderSpslChecked])

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
              {Number(maxOpenVolume) < 0 ? '--' : maxOpenVolume} {intl.formatMessage({ id: 'pages.trade.Lot' })}
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
                {expectedMargin} {SOURCE_CURRENCY}
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
              {expectedMargin} {SOURCE_CURRENCY}
            </Text>
          </View>
        </View>
      )}
      {/* k线页面 快速下单-弹窗展示 */}
      {position === 'MODAL' && (
        <View className={cn('flex-row items-center justify-between', !orderSpslChecked && 'mt-5')}>
          <View className={cn('flex-row items-center gap-x-2')}>
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
