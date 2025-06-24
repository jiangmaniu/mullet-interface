import Iconfont from '@/components/Base/Iconfont'
import { SOURCE_CURRENCY } from '@/constants'
import { TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import Button from '@/pages/webapp/components/Base/Button'
import ActivityIndicator from '@/pages/webapp/components/Base/Loading/ActivityIndicator'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum } from '@/utils'
import { useGetCurrentQuoteCallback } from '@/utils/wsUtil'
import { useInViewport } from 'ahooks'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'
import { Params } from './PositionModal/TopTabbar/types'

type IProps = {
  item: Order.BgaOrderPageListItem
  modalVisible?: boolean // 弹窗是否打开
  onPress: (item: Order.BgaOrderPageListItem, tabKey: Params['tabKey'], cb?: () => void) => Promise<void>
}

// Profit 组件用于隔离利润渲染
const Profit = observer(({ precision, item }: { precision?: number; item: Order.BgaOrderPageListItem }) => {
  // item 根据  covertProfit 变化
  // const profit = covertProfit(item) as number // 浮动盈亏

  // 使用worker计算的值
  const { trade } = useStores()
  const positionListSymbolCalcInfo = trade.positionListSymbolCalcInfo
  const calcInfo = positionListSymbolCalcInfo.get(item.id)
  const profit = calcInfo?.profit || 0

  const profitFormat = Number(profit) ? formatNum(profit, { precision }) : profit || '-'

  return (
    <Text size="base" color={Number(profit) > 0 ? 'green' : 'red'} weight="medium" leading="xl">
      {Number(profit) > 0 ? '+' + profitFormat : profitFormat}
    </Text>
  )
})

// CurrentPrice 组件用于隔离当前价格渲染
const CurrentPrice = observer(({ buySell, symbol }: { buySell: string; symbol?: string }) => {
  const getCurrentQuote = useGetCurrentQuoteCallback()
  const quoteInfo = getCurrentQuote(symbol)
  // 标记价
  const currentPrice = buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask // 价格需要取反方向的

  return (
    <>
      {/* <Text size="xs" weight="medium" color={quoteInfo?.bidDiff > 0 ? 'green' : 'red'}> */}
      <Text size="xs" weight="medium">
        {currentPrice || '--'}
      </Text>
    </>
  )
})

// 添加检查元素是否在视口内的函数
const isElementInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// 持仓Item
function PositionItem({ item, modalVisible = false, onPress }: IProps) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade, ws } = useStores()
  const { currentAccountInfo } = trade
  const symbol = item.symbol
  const itemRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const precision = currentAccountInfo.currencyDecimal

  const enableIsolated = trade.currentAccountInfo.enableIsolated

  const [loading4, setLoading4] = useState(false)

  const [inViewport] = useInViewport(itemRef)

  // @ts-ignore
  // const visible = item.visible
  const visible = inViewport

  // useEffect(() => {
  //   const checkVisibility = () => {
  //     if (itemRef.current) {
  //       setIsVisible(isElementInViewport(itemRef.current))
  //     }
  //   }

  //   // 初始检查
  //   checkVisibility()

  //   // 添加滚动事件监听
  //   window.addEventListener('scroll', checkVisibility)
  //   window.addEventListener('resize', checkVisibility)

  //   return () => {
  //     window.removeEventListener('scroll', checkVisibility)
  //     window.removeEventListener('resize', checkVisibility)
  //   }
  // }, [])

  return (
    <div
      onClick={(e) => {
        onPress(item, 'CLOSE_POSITION')
      }}
      style={{ background: theme.colors.backgroundColor.primary }}
      className={cn('position-item rounded-xl p-3 pt-2 mb-[10px]')}
      ref={itemRef}
      data-id={item.id}
      // data-visible={isVisible}
      data-inviewport={inViewport}
    >
      <View className={cn('flex-row items-center justify-between')}>
        <View className={cn('items-center flex-row flex-1')}>
          <SymbolIcon width={30} height={30} src={item.imgUrl} />
          <View className={cn('flex flex-col flex-1')}>
            {/* 第一行 */}
            <View className={cn('pl-2 flex flex-row justify-between flex-1 relative top-[3px]')}>
              <View className={cn('flex-row items-center')}>
                <Text size="base" color="primary" font="pf-bold" className={cn('pr-1')}>
                  {item.alias || symbol}
                </Text>
                <Text size="sm" color={item.buySell === 'BUY' ? 'green' : 'red'} weight="medium">
                  {item.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')}{' '}
                  {item.leverageMultiple ? `${item.leverageMultiple}X ` : ''}
                  {item.orderVolume}
                </Text>
              </View>
              <View>
                {!!visible && !modalVisible ? (
                  <Profit item={item} precision={precision} />
                ) : (
                  <ActivityIndicator size={18} color={theme.colors.textColor.primary} />
                )}
              </View>
            </View>
            {/* 第二行 */}
            <View className={cn('pl-2 flex flex-row justify-between items-center')}>
              <View className={cn('flex-row items-center')}>
                <Text size="xs" className={cn('leading-4')}>
                  {item.marginType === 'CROSS_MARGIN'
                    ? t('common.enum.MarginType.CROSS_MARGIN')
                    : t('common.enum.MarginType.ISOLATED_MARGIN')}
                </Text>
                <View className={cn('h-2 w-[1px] mx-[6px]')} style={{ backgroundColor: theme.colors.Divider.heavy }} />
                <Text size="xs" weight="medium">
                  {formatNum(item.startPrice, { precision: item.symbolDecimal })}
                </Text>
                <View className={cn('px-1')}>
                  <Iconfont name="hangqing-biandong" size={14} />
                </View>
                {!!visible && !modalVisible && <CurrentPrice buySell={item.buySell || ''} symbol={symbol} />}
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
              <View className={cn('justify-end flex-grow')}>
                <Text size="xs" leading="sm">
                  {SOURCE_CURRENCY}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className={cn('flex flex-row items-center gap-x-2 mt-[13px]')}>
        {item.marginType === 'ISOLATED_MARGIN' && (
          <Button
            size="xs"
            containerClassName={cn('flex-1 flex-nowrap h-full')}
            className={cn('flex-1 px-1')}
            onClick={() => {
              onPress(item, 'MARGIN')
            }}
          >
            {t('Position.Adjust margin')}
          </Button>
        )}
        <Button
          size="xs"
          containerClassName={cn('flex-1 h-full')}
          className={cn('flex-1')}
          onClick={() => {
            onPress(item, 'CLOSE_POSITION')
          }}
        >
          {t('pages.position.Part Close Positon Btn')}
        </Button>
        <Button
          size="xs"
          containerClassName={cn('flex-1 h-full')}
          className={cn('flex-1')}
          onClick={() => {
            onPress(item, 'SPSL')
          }}
        >
          {t('pages.trade.Spsl')}
        </Button>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onPress(item, 'CLOSE_MARKET_POSITION', () => {
              if (!trade.positionConfirmChecked) {
                setLoading4(true)
                setTimeout(() => {
                  setLoading4(false)
                }, 2000)
              }
            })
          }}
          className="flex-1 h-full"
        >
          <Button size="xs" containerClassName={cn('flex-1')} loading={loading4}>
            {t('pages.position.Market Price Close Position Btn')}
          </Button>
        </div>
      </View>
    </div>
  )
}

export default observer(PositionItem)
