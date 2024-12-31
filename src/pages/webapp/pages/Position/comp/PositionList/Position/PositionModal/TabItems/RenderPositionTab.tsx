import { ORDER_TYPE, TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import InputNumber from '@/pages/webapp/components/Base/Form/InputNumber'
import Slider from '@/pages/webapp/components/Base/Slider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import useFocusEffect from '@/pages/webapp/hooks/useFocusEffect'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { toFixed } from '@/utils'
import { message } from '@/utils/message'
import { getCurrentQuote } from '@/utils/wsUtil'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { RenderTabRef } from '.'
import { Params } from '../TopTabbar/types'

type IProps = {
  rawItem: Order.BgaOrderPageListItem
  setSwipeEnabled?: (value: boolean) => void
  close?: () => void
  setTabKey?: (value: Params['tabKey']) => void
}

const CurrentPrice = observer(({ buySell, symbol }: any) => {
  const quoteInfo = getCurrentQuote(symbol)

  const currentPrice = useMemo(() => {
    // 标记价
    const currentPrice = buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask // 价格需要取反方向的
    return currentPrice
  }, [buySell, symbol, quoteInfo])

  return (
    <Text size="xs" weight="medium">
      {currentPrice} USD
    </Text>
  )
})

const RenderSliderComp = memo(
  ({
    rawItem: item,
    setCount,
    count,
    setSwipeEnabled
  }: {
    rawItem: Order.BgaOrderPageListItem
    setCount: (value: number) => void
    count: number
    setSwipeEnabled?: (value: boolean) => void
  }) => {
    const { cn, theme } = useTheme()

    const orderVolume = useMemo(() => Number(item.orderVolume || 0), [item.orderVolume]) // 手数
    const conf = useMemo(() => item?.conf, [item])
    const vmin = useMemo(() => conf?.minTrade || 0.01, [conf])

    const [sliderValue, setSliderValue] = useState(0)

    useEffect(() => {
      setSliderValue((count / orderVolume) * 100)
    }, [count])

    const renderSlider = useMemo(() => {
      return (
        <Slider
          unit="%"
          marks={['0', '25', '50', '75', '100']}
          step={1}
          min={0}
          max={100}
          onChange={(value: any) => {
            // 可平仓手数*百分比
            const vol = toFixed((value / 100) * orderVolume, 2, false)
            // 不能小于最小手数
            setCount(Number(vol) < vmin ? vmin : vol)
            setSliderValue(value)
          }}
          onSlidingComplete={(value) => {
            setSwipeEnabled?.(true)
          }}
          value={sliderValue}
        />
      )
    }, [sliderValue, vmin, orderVolume])

    return <View className={cn('mb-3 p-2')}>{renderSlider}</View>
  }
)

const RenderPositionTab = forwardRef((props: IProps, ref: ForwardedRef<RenderTabRef>) => {
  const { rawItem, close, setTabKey } = props
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade } = useStores()
  const { fetchUserInfo } = useModel('user')
  const item = rawItem

  const [count, setCount] = useState<any>('')

  const orderVolume = useMemo(() => Number(item.orderVolume || 0), [item.orderVolume]) // 手数

  const symbol = useMemo(() => item.symbol, [item.symbol])

  useEffect(() => {
    if (rawItem.orderVolume) {
      setCount(String(rawItem.orderVolume))
    }
  }, [rawItem.orderVolume])

  useFocusEffect(
    useCallback(() => {
      // TopTabbar.summit 需要
      setTabKey?.('CLOSE_POSITION')
    }, [])
  )

  // 平仓确认
  const submitPosition = useCallback(async () => {
    const reg = /^\d+(\.\d{0,2})?$/
    const countErrorMsg = t('pages.trade.Input Volume Error')
    if (!count) return message.info(t('pages.trade.Input Volume'))
    if (!reg.test(String(count))) {
      message.info(countErrorMsg)
      return
    }
    if (count > orderVolume) {
      message.info(countErrorMsg)
      return
    }
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
      close?.()

      // 更新账户余额信息
      fetchUserInfo(true)
    }
  }, [count, orderVolume, symbol, item, t, trade.createOrder, close, fetchUserInfo])

  useImperativeHandle(ref, () => ({
    submit: submitPosition
  }))

  return (
    <View className={cn('mt-5')}>
      <InputNumber
        rightText={t('pages.trade.Max')}
        placeholder={t('pages.trade.OrderVolume')}
        label={
          <View className={cn('items-center flex justify-between flex-row w-full')}>
            <Text size="sm" weight="medium">
              {t('pages.position.Close Position Volume')}
            </Text>
            <View className={cn('flex-row items-center gap-x-1')}>
              <Text size="xs" color="secondary">
                {t('pages.position.Close Position Price')}
              </Text>
              <CurrentPrice buySell={item.buySell} symbol={symbol} />
            </View>
          </View>
        }
        height={42}
        value={count}
        onChange={(value) => {
          if (Number(value) > orderVolume) return
          setCount(value)
        }}
        onAdd={() => {
          if (count >= orderVolume) return
          const c = (Number(count) + 0.01).toFixed(2)
          setCount(c)
        }}
        onMinus={() => {
          if (count <= 0.01) return
          const c = (Number(count) - 0.01).toFixed(2)
          setCount(c)
        }}
        max={orderVolume}
        min={0.01}
      />
      <View className={cn('mt-8')}>
        <RenderSliderComp setSwipeEnabled={props.setSwipeEnabled} rawItem={rawItem} setCount={setCount} count={count} />

        <View className={cn('flex-row items-center justify-center gap-x-1')}>
          <Text size="xs" color="secondary">
            {t('pages.position.Available Close Position Volume')}
          </Text>
          <Text size="xs" color="primary" weight="medium">
            {orderVolume}
            {t('pages.trade.Lot')}
          </Text>
        </View>
      </View>
    </View>
  )
})

export default RenderPositionTab
