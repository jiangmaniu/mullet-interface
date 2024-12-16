import { SpinLoading } from 'antd-mobile'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { forwardRef, useMemo } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { formatNum } from '@/utils'
import { getCurrentQuote } from '@/utils/wsUtil'

import useQuoteColor from '../../hooks/useQuoteColor'
import { navigateTo } from '../../utils/navigator'
import { Text } from '../Base/Text'
import { View } from '../Base/View'
import SymbolIcon from './SymbolIcon'

type Item = Account.TradeSymbolListItem
type IProps = {
  item: Item
  /** 点击item */
  onItem?: (item?: Item) => void
}

function QuoteItem({ item, onItem }: IProps, ref: any) {
  const { cn, theme } = useTheme()
  const { up: upColor, down: downColor, isDark } = theme
  const { trade } = useStores()
  const symbol = item?.symbol

  if (!symbol) return null

  const res = getCurrentQuote(symbol)
  // const bid = res.bid // 卖价
  // const ask = res.ask // 买价
  // const per: any = res.percent
  // const hasQuote = res.hasQuote

  const { bid, ask, percent: per, hasQuote, quotes, askDiff, bidDiff } = useMemo(() => res, [res])

  const isMarketOpen = trade.isMarketOpen(symbol)

  const { bidColorStyle, askColorStyle } = useQuoteColor({ item })

  const handleJump = () => {
    // 切换品种
    trade.switchSymbol(symbol)

    if (onItem) {
      onItem(item)
    } else {
      //  跳转到k线页面
      navigateTo('/app/quote/kline')
    }
  }

  return (
    <View
      className={cn('mb-[10px] flex items-center flex-row justify-between py-2 px-2 rounded-xl')}
      bgColor="primary"
      onClick={handleJump}
    >
      <View className={cn('flex flex-col')}>
        <View className={cn('flex flex-row items-center pb-1')}>
          <SymbolIcon src={item.imgUrl} />
          <Text color="primary" size="base" className={cn('ml-1 font-medium')}>
            {item.alias || item.symbol}
          </Text>
          {/* 休市中状态 */}
          {hasQuote && !isMarketOpen && <Iconfont name="hangqing-xiushi" size={20} color="red" style={{ marginLeft: 5 }} />}
        </View>
        <View className={cn('flex flex-row items-center')}>
          <View className={cn('max-w-[54px]')}>
            <Text color="primary" size="xs">
              {item.visible ? dayjs(res.quoteTimeStamp).format('HH:mm:ss') : '--:--:--'}
            </Text>
          </View>
          <View className={cn('h-2 w-[1px] mx-1', { backgroundColor: theme.colors.Divider.primary })} />
          <View className={cn('flex items-center flex-row')}>
            <Iconfont name="hangqing-diancha" size={14} />
            {/* 点差 */}
            <Text color="primary" size="xs">
              {res.spread}
            </Text>
          </View>
          <View className={cn('h-2 w-[1px] mx-1', { backgroundColor: theme.colors.Divider.heavy })} />
          <Text color={(per as number) > 0 ? 'green' : 'red'} size="xs" className={cn('font-medium')}>
            {item.visible && bid ? ((per as number) > 0 ? `+${per}%` : `${per}%`) : '--'}
          </Text>
        </View>
      </View>
      <View className={cn('flex items-center flex-row gap-x-[6px]')}>
        <View className={cn('relative w-[84px] overflow-hidden rounded-md')}>
          {item.visible ? (
            <>
              <View
                onClick={handleJump}
                className={cn(
                  'rounded-md text-center leading-[26px] h-[26px] min-h-[26px] overflow-hidden z-2 text-sm font-dingpro-medium'
                )}
                style={bidColorStyle}
              >
                {bid ? formatNum(bid) : '--'}
              </View>
              <View
                className={cn(
                  'bg-gray-50 relative -top-[3px] pt-[3px] items-center justify-center border-l border-b border-r rounded-bl-md rounded-br-md h-[20px] -z-1'
                )}
                borderColor="weak"
              >
                <Text className={cn('text-[9px]')} color="weak" font="dingpro-medium">
                  L:
                  {formatNum(res.low)}
                </Text>
              </View>
            </>
          ) : (
            <SpinLoading style={{ '--size': '18px' }} />
          )}
        </View>
        <View className={cn('relative w-[84px] overflow-hidden rounded-md')}>
          {item.visible ? (
            <>
              <View
                onClick={handleJump}
                className={cn('rounded-[6px] text-center leading-[26px] h-[26px] min-h-[26px] overflow-hidden text-sm font-dingpro-medium')}
                style={askColorStyle}
              >
                {ask ? formatNum(ask) : '--'}
              </View>
              <View
                className={cn(
                  'bg-gray-50 relative -top-[3px] pt-[3px] items-center justify-center border-l border-b border-r rounded-bl-md rounded-br-md h-[20px] -z-1'
                )}
                borderColor="weak"
              >
                <Text className={cn('text-[9px]')} color="weak" font="dingpro-medium">
                  H:
                  {formatNum(res.high)}
                </Text>
              </View>
            </>
          ) : (
            <SpinLoading style={{ '--size': '18px' }} />
          )}
        </View>
      </View>
    </View>
  )
}

export default observer(forwardRef(QuoteItem))
