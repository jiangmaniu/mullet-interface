import { observer } from 'mobx-react'
import { useMemo } from 'react'

import { useTheme } from '@/context/themeProvider'
import useQuoteColor from '@/pages/webapp/hooks/useQuoteColor'
import { formatNum } from '@/utils'
import { getCurrentDepth } from '@/utils/wsUtil'

import { useIntl } from '@umijs/max'
import CustomArrowButton from '../../../Base/CustomArrowButton'
import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'
import BuySellButton from '../../BuySellModal/BuySellButton'
import MarginTypeAndLeverageBtn from './MarginTypeAndLeverageBtn'

const BuySellPrice = observer(() => {
  const { cn, theme } = useTheme()
  const { askColor, bidColor, quoteWrapperClassName, bid, ask, low, high, spread } = useQuoteColor()

  const depth = getCurrentDepth()
  const hasDepth = useMemo(() => Number(depth?.asks?.length || 0) > 0 && Number(depth?.bids?.length || 0) > 0, [depth])

  if (hasDepth) return <></>

  return (
    <View className={cn('mb-3', quoteWrapperClassName)}>
      <View className={cn('flex items-center flex-row rounded-md gap-x-[6px] border-b border-t')} borderColor="weak">
        <View className={cn('relative flex-1 overflow-hidden bg-gray-50')}>
          <View
            className={cn(
              'h-[26px] text-base font-dingpro-medium text-center rounded-tl-[6px] border-[0px] rounded-tr-[0px] rounded-br-[0px] min-h-[26px] overflow-hidden z-2',
              bidColor
            )}
          >
            {bid ? formatNum(bid) : '--'}
          </View>
          <View
            className={cn(
              'bg-gray-50 items-center text-center justify-center border-l border-r rounded-bl h-[16px] -z-1 text-[9px] text-weak font-dingpro-medium'
            )}
            borderColor="weak"
          >
            L:
            {formatNum(low)}
          </View>
        </View>
        <View>
          <Text size="sm" color="secondary" leading="base" weight="medium">
            {spread}
          </Text>
        </View>
        <View className={cn('relative flex-1 overflow-hidden bg-gray-50')}>
          <View
            className={cn(
              'h-[26px] text-base font-dingpro-medium text-center rounded-tr-[6px] border-[0px] rounded-tl-[0px] rounded-bl-[0px] min-h-[26px] overflow-hidden',
              askColor
            )}
          >
            {ask ? formatNum(ask) : '--'}
          </View>
          <View
            className={cn(
              'bg-gray-50 items-center text-center justify-center text-[9px] text-weak font-dingpro-medium border-l border-r rounded-br rounded-tr h-[16px] -z-1'
            )}
            borderColor="weak"
          >
            H:
            {formatNum(high)}
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

  const depth = getCurrentDepth()
  const hasDepth = useMemo(() => depth?.asks?.length && depth?.asks.length > 0 && depth?.bids?.length && depth?.bids.length > 0, [depth])

  if (hasDepth) {
    return (
      <View className={cn('flex-row justify-between items-center pl-3 pt-3')}>
        <View className={cn('flex-1 flex-row')}>
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
    )
  }

  return (
    <View className={cn('mt-3')}>
      <View className={cn('flex-row justify-between items-center pb-[10px]')}>
        <MarginTypeAndLeverageBtn noDepth />
      </View>
      <View className={cn('flex-row mx-3 border mb-2 p-[5px] rounded-[9px]')} borderColor="weak">
        <BuySellButton position="modal" btnHeight={32} />
      </View>
    </View>
  )
}

export default observer(Header)
