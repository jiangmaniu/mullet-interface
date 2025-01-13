import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useQuoteColor from '@/pages/webapp/hooks/useQuoteColor'
import { formatNum } from '@/utils'
import { getCurrentDepth, getCurrentQuote } from '@/utils/wsUtil'

import Button from '../../../Base/Button'
import CustomArrowButton from '../../../Base/CustomArrowButton'
import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'
import MarginTypeAndLeverageBtn from './MarginTypeAndLeverageBtn'

const BuySellPrice = observer(() => {
  const { cn, theme } = useTheme()
  const { bidColorStyle, askColorStyle, bid, ask, low, high, spread } = useQuoteColor()

  const depth = getCurrentDepth()
  const hasDepth = useMemo(() => Number(depth?.asks?.length || 0) > 0 && Number(depth?.bids?.length || 0) > 0, [depth])

  if (hasDepth) return <></>

  return (
    <View className={cn('mb-3')}>
      <View className={cn('flex items-center flex-row rounded-md gap-x-[6px] border-b border-t')} borderColor="weak">
        <View className={cn('relative flex-1 overflow-hidden bg-gray-50')}>
          <Button
            textClassName={cn('text-base font-dingpro-medium')}
            textStyle={bidColorStyle}
            height={26}
            className={cn('rounded-tl-[6px] border-[0px] rounded-tr-[0px] rounded-br-[0px] min-h-[26px] overflow-hidden z-2')}
            style={bidColorStyle}
          >
            {bid ? formatNum(bid) : '--'}
          </Button>
          <View className={cn('bg-gray-50 items-center justify-center border-l border-r rounded-bl h-[16px] -z-1')} borderColor="weak">
            <Text className={cn('text-[9px]')} color="weak" font="dingpro-medium">
              L:
              {formatNum(low)}
            </Text>
          </View>
        </View>
        <View>
          <Text size="sm" color="secondary" leading="base" weight="medium">
            {spread}
          </Text>
        </View>
        <View className={cn('relative flex-1 overflow-hidden bg-gray-50')}>
          <Button
            textClassName={cn('text-base font-dingpro-medium')}
            textStyle={askColorStyle}
            height={26}
            className={cn('rounded-tr-[6px] border-[0px] rounded-tl-[0px] rounded-bl-[0px] min-h-[26px] overflow-hidden')}
            style={askColorStyle}
          >
            {ask ? formatNum(ask) : '--'}
          </Button>
          <View
            className={cn('bg-gray-50 items-center justify-center border-l border-r rounded-br rounded-tr h-[16px] -z-1')}
            borderColor="weak"
          >
            <Text className={cn('text-[9px]')} color="weak" font="dingpro-medium">
              H:
              {formatNum(high)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
})

/** 交易头部区域 */
function Header() {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { trade } = useStores()
  const quoteInfo = getCurrentQuote()

  // const getCurrentDepth = useGetCurrentDepthCallback()
  // const depth = getCurrentDepth()
  // const hasDepth = useMemo(() => depth?.asks?.length && depth?.asks.length > 0 && depth?.bids?.length && depth?.bids.length > 0, [depth])

  return (
    <View className={cn('mt-3 px-3')}>
      <BuySellPrice />

      <View className={cn('flex-row justify-between items-center')}>
        <View className={cn('flex-1 flex-row mr-3')}>
          <CustomArrowButton
            leftText={intl.formatMessage({ id: 'mt.kaikong' })}
            rightText={intl.formatMessage({ id: 'mt.kaiduo' })}
            // onChange={(key) => {
            //   trade.setBuySell(key === 'left' ? 'SELL' : 'BUY')
            // }}
          />
        </View>
        <MarginTypeAndLeverageBtn />
      </View>
    </View>
  )
}

export default observer(Header)
