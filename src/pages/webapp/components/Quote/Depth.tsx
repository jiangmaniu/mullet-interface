import { useIntl } from '@umijs/max'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useCallback, useMemo, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { formatNum, getPrecisionByNumber } from '@/utils'
import { getCurrentDepth, useGetCurrentQuoteCallback } from '@/utils/wsUtil'

import { useLang } from '@/context/languageProvider'
import { Text } from '../Base/Text'
import { View } from '../Base/View'

type ModeType = 'BUY_SELL' | 'BUY' | 'SELL'

const RenderBuyList = observer(({ mode }: { mode: ModeType }) => {
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const { orderType, setOrderPrice: _setOrderPrice } = trade

  const showAll = mode !== 'BUY_SELL'
  const getCurrentQuote = useGetCurrentQuoteCallback()
  const quote = getCurrentQuote()
  const depth = getCurrentDepth()
  //  bids 从上往下对应（第一个 是卖一） 作为买盘展示在下面（卖价 买盘）
  const bids = toJS(depth?.bids || [])

  const list = showAll ? bids : bids.slice(0, 10)
  const maxAmount = Math.max(...list.map((item) => item.amount))

  const setOrderPrice = useCallback(
    (price: number) => {
      if (orderType === 'MARKET_ORDER') return
      _setOrderPrice(price)
    },
    [orderType, _setOrderPrice]
  )
  return (
    <>
      {list
        .filter((v) => v)
        .map((item, idx) => {
          // const total = item.price * item.amount
          const pencent = (item.amount / maxAmount) * 100
          const digits = quote.digits
          const amountDigits = getPrecisionByNumber(item.amount)
          return (
            <View key={idx} onClick={() => setOrderPrice(item.price)} className="relative">
              <View style={cn('mb-[3px] flex-row items-center py-[3px] pr-1 justify-between h-5')} key={idx}>
                <Text color="green" font="dingpro-medium" size="xs" style={cn('leading-[15px]')}>
                  {formatNum(item.price, { precision: digits })}
                </Text>
                <Text color="primary" size="xs" font="dingpro-medium" style={cn('leading-[15px]')}>
                  {amountDigits >= 8 ? formatNum(item.amount, { precision: 8 }) : formatNum(item.amount)}
                </Text>
              </View>
              <View
                style={{
                  background: theme.colors.depthBuyBg,
                  height: 18,
                  position: 'absolute',
                  top: 1,
                  right: 0,
                  width: `${pencent >= 100 ? 100 : pencent}%`
                }}
              />
            </View>
          )
        })}
    </>
  )
})

const RenderSellList = observer(({ mode }: { mode: ModeType }) => {
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const { orderType, setOrderPrice: _setOrderPrice } = trade

  const showAll = mode !== 'BUY_SELL'
  const getCurrentQuote = useGetCurrentQuoteCallback()
  const quote = getCurrentQuote()
  const depth = getCurrentDepth()
  // asks 从下往上对应（倒数第一个 是买一） 作为卖盘展示在上面， 倒过来 从大到小（倒过来后，从后往前截取12条）(买价 卖盘)
  const asks = toJS(depth?.asks || []).reverse()
  const list = showAll ? asks : asks.slice(-10) // 获取倒数10条数据
  const maxAmount = Math.max(...list.map((item) => item.amount))

  const setOrderPrice = useCallback(
    (price: number) => {
      if (orderType === 'MARKET_ORDER') return
      _setOrderPrice(price)
    },
    [orderType, _setOrderPrice]
  )
  return (
    <>
      {list
        .filter((v) => v)
        .map((item, idx) => {
          // const total = item.price * item.amount
          const pencent = (item.amount / maxAmount) * 100
          const digits = quote.digits
          const amountDigits = getPrecisionByNumber(item.amount)
          return (
            <View key={idx} onClick={() => setOrderPrice(item.price)} className="relative">
              <View style={cn('mb-[3px] flex-row items-center py-[3px] pr-1 justify-between h-5')} key={idx}>
                <Text color="red" size="xs" font="dingpro-medium" style={cn('leading-[15px]')}>
                  {formatNum(item.price, { precision: digits })}
                </Text>
                <Text color="primary" size="xs" font="dingpro-medium" style={cn('leading-[15px]')}>
                  {amountDigits >= 8 ? formatNum(item.amount, { precision: 8 }) : formatNum(item.amount)}
                </Text>
              </View>
              <View
                style={{
                  background: theme.colors.depthSellBg,
                  height: 18,
                  position: 'absolute',
                  top: 2,
                  right: 0,
                  width: `${pencent >= 100 ? 100 : pencent}%`
                }}
              />
            </View>
          )
        })}
    </>
  )
})

function Depth() {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const [mode, setMode] = useState<ModeType>('BUY_SELL')
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'

  const getCurrentQuote = useGetCurrentQuoteCallback()
  const quote = getCurrentQuote()

  const depth = getCurrentDepth()
  const hasDepth = useMemo(() => depth?.asks?.length && depth?.asks.length > 0 && depth?.bids?.length && depth?.bids.length > 0, [depth])

  const modeList: Array<{ key: ModeType; icon: string }> = [
    {
      key: 'BUY_SELL',
      icon: 'pankou-maimai'
    },
    {
      key: 'BUY',
      icon: 'pankou-mai'
    },
    {
      key: 'SELL',
      icon: 'pankou-mai1'
    }
  ]

  const SellPrice = (
    <Text font="dingpro-medium" size="base" color="red" className={cn('leading-4')}>
      {formatNum(quote.bid)}
    </Text>
  )

  return (
    <>
      {hasDepth && (
        <View className={cn('w-[150px] pl-5 pr-3', !isZh && 'pl-3')}>
          <View className={cn('flex-row pt-4 pb-1 items-center justify-between')}>
            <Text color="weak" size="xs" className={cn('leading-4')}>
              {intl.formatMessage({ id: 'pages.trade.Price' })}
            </Text>
            <Text color="weak" size="xs" className={cn('leading-4')}>
              {intl.formatMessage({ id: 'pages.trade.Number' })}
            </Text>
          </View>
          {mode === 'SELL' && (
            <>
              <RenderSellList mode={mode} />
              <View className={cn('my-1')}>{SellPrice}</View>
            </>
          )}
          {mode === 'BUY_SELL' && (
            <>
              <RenderSellList mode={mode} />
              <View className={cn('items-center my-2 justify-center')}>
                {SellPrice}
                {/* <Text color="weak" weight="medium" className={cn('text-[10px] leading-[14px]')}>
                  {formatNum(quote.ask)}
                </Text> */}
              </View>
              <RenderBuyList mode={mode} />
            </>
          )}
          {mode === 'BUY' && (
            <>
              <View className={cn('my-1')}>{SellPrice}</View>
              <RenderBuyList mode={mode} />
            </>
          )}
          <View className={cn('flex-row items-center justify-end gap-x-3 my-1')}>
            {modeList.map((item, idx) => (
              <View
                key={idx}
                onClick={() => {
                  setMode(item.key)
                }}
              >
                <View
                  className={cn('rounded-[2px] flex items-center justify-center size-6')}
                  style={{
                    backgroundColor: item.key === mode ? theme.colors.gray[50] : 'transparent'
                  }}
                >
                  <Iconfont name={item.icon} className={cn('cursor-pointer', item.key === mode ? 'opacity-100' : 'opacity-30')} size={22} />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  )
}

export default observer(Depth)
