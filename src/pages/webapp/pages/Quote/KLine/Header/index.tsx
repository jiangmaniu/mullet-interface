import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'

import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import FuturesModal from '@/pages/webapp/components/Quote/FuturesModal'
import SelectSymbolBtn from '@/pages/webapp/components/Quote/SelectSymbolBtn'
import { formatNum } from '@/utils'
import { getCurrentQuote } from '@/utils/wsUtil'

function Header() {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const res: any = getCurrentQuote()

  return (
    <View className={cn('px-4')}>
      <SelectSymbolBtn />
      <View className={cn('mt-1 items-center justify-between flex-row gap-2 flex overflow-hidden')}>
        <View>
          <Text color="primary" className={cn('text-[28px] font-dingpro-medium leading-9')}>
            {res.bid ? formatNum(res.bid) : '--'}
          </Text>
          <View className={cn('items-center flex-row mt-1')}>
            <FuturesModal
              trigger={
                <View className={cn('bg-gray-50 rounded flex-row py-1 px-[5px] mr-2')}>
                  <Text size="xs" className={cn('leading-4')}>
                    {intl.formatMessage({ id: 'pages.trade.Contract attribute' })}
                  </Text>
                  <Iconfont name="hangqing-xiaoanniu-gengduo" size={16} />
                </View>
              }
            />
            <Text size="sm" color={res.percent > 0 ? 'green' : 'red'} className={cn('font-semibold')}>
              {res.percent > 0 ? `+${res.percent}%` : `${res.percent}%`}
            </Text>
          </View>
        </View>
        <View className={cn('overflow-hidden gap-1 flex-1 flex  items-center justify-end')}>
          <View className={cn('flex flex-row gap-x-3 justify-start ')}>
            <View className={cn('items-start flex-shrink flex flex-col')}>
              <View className={cn('flex items-center')}>
                <Text color="weak" className={cn('text-[10px] leading-4')}>
                  {intl.formatMessage({ id: 'pages.trade.Open Price' })}
                </Text>
                <Text color="weak" className={cn('text-[10px] leading-[14px]')}>
                  {formatNum(res.open)}
                </Text>
              </View>
              <View className={cn('items-center flex mt-2')}>
                <Text color="weak" className={cn('text-[10px] leading-4')}>
                  {intl.formatMessage({ id: 'pages.trade.24 high price' })}
                </Text>
                <Text color="weak" className={cn('text-[10px] leading-[14px]')}>
                  {formatNum(res.high)}
                </Text>
              </View>
            </View>
            <View className={cn('items-start flex-shrink flex flex-col')}>
              <View className={cn('flex items-center')}>
                <Text color="weak" className={cn('text-[10px] leading-4')}>
                  {intl.formatMessage({ id: 'pages.trade.Close Price' })}
                </Text>
                <Text color="weak" className={cn('text-[10px] leading-[14px]')}>
                  {formatNum(res.close)}
                </Text>
              </View>
              <View className={cn('items-center mt-2 flex')}>
                <Text color="weak" className={cn('text-[10px] leading-4')}>
                  {intl.formatMessage({ id: 'pages.trade.24 low price' })}
                </Text>
                <Text color="weak" className={cn('text-[10px] leading-[14px]')}>
                  {formatNum(res.low)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default observer(Header)
