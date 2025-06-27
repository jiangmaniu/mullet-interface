import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import CurrentPrice from '@/pages/web/trade/comp/TradeRecord/comp/PositionList/comp/CurrentPrice'
import MarginRate from '@/pages/web/trade/comp/TradeRecord/comp/PositionList/comp/MarginRate'
import Button from '@/pages/webapp/components/Base/Button'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum, toFixed } from '@/utils'
import { cn } from '@/utils/cn'
import { useInViewport } from 'ahooks'
import { observer } from 'mobx-react'
import { useRef, useState } from 'react'
import { ListItem } from './PositionModal/PositionContent'
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

const MarginRateComp = observer(({ item }: { item: Order.BgaOrderPageListItem }) => {
  const { t } = useI18n()
  const { trade } = useStores()

  return <ListItem label={t('mt.baozhengjinlv')} align="end" value={<MarginRate item={item} />} />
})

const ProfitYieldRate = observer(({ item }: { item: Order.BgaOrderPageListItem }) => {
  const { t } = useI18n()
  const { trade } = useStores()
  const precision = trade.currentAccountInfo.currencyDecimal
  const calcInfo = trade.positionListSymbolCalcInfo.get(item.id)
  const profit = calcInfo?.profit
  let yieldRate = calcInfo?.yieldRate

  const formatProfit = formatNum(profit, { precision })

  return (
    <View className={cn('flex-row items-center justify-between w-full')}>
      <View className={cn('items-start flex-col gap-y-1')}>
        <Text color="secondary" size="xs">
          {t('mt.fudongyingkui')}(USD)
        </Text>
        <Text size="xl" weight="medium" font="dingpro-medium" color={Number(profit) ? (Number(profit) > 0 ? 'green' : 'red') : 'weak'}>
          {Number(profit) ? (Number(profit) > 0 ? '+' + formatProfit : formatProfit) : '0.00'}
        </Text>
      </View>
      <View className={cn('items-end flex-col gap-y-1')}>
        <Text color="secondary" size="xs">
          {t('mt.shouyilv')}
        </Text>
        <Text
          size="xl"
          weight="medium"
          font="dingpro-medium"
          color={parseInt(yieldRate) ? (parseInt(yieldRate) > 0 ? 'green' : 'red') : 'weak'}
        >
          {yieldRate ? yieldRate : '0.00%'}
        </Text>
      </View>
    </View>
  )
})

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
      <View style={cn('flex-row items-center justify-between')}>
        <View style={cn('flex-row items-center')}>
          <SymbolIcon width={32} height={32} src={item?.imgUrl} />
          <View style={cn('pl-2')}>
            <Text size="base" color="primary" weight="medium" style={cn('pr-1')}>
              {item?.alias || item?.symbol}
            </Text>
            <View style={cn('flex-row items-center gap-x-[6px]')}>
              <View
                className={cn('flex-row items-center rounded p-[1px]')}
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
              <View
                className={cn('flex-row items-center rounded p-[1px]')}
                style={{
                  borderWidth: 1,
                  borderColor: '#B4B4B4'
                }}
              >
                <Text size="xs" style={cn('text-center')}>
                  {item?.marginType === 'CROSS_MARGIN'
                    ? t('common.enum.MarginType.CROSS_MARGIN')
                    : t('common.enum.MarginType.ISOLATED_MARGIN')}
                  {item?.leverageMultiple ? `${item?.leverageMultiple}X ` : ''}
                </Text>
              </View>
              {(item?.takeProfit || item?.stopLoss) && (
                <View style={cn('flex-row items-center')}>
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
          </View>
        </View>
        <img src="/img/right-icon.png" className={cn('size-5')} />
      </View>
      <View style={cn('flex-row my-3')}>
        <ProfitYieldRate item={item} />
      </View>
      <View className={cn('flex-row justify-between items-center')}>
        <ListItem label={t('pages.position.Open Position Volume')} value={formatNum(item?.orderVolume, { precision })} />
        {/* 全仓使用基础保证金 */}
        <ListItem
          label={t('mt.baozhengjin')}
          align="center"
          value={formatNum(item?.marginType === 'CROSS_MARGIN' ? item?.orderBaseMargin : item?.orderMargin, { precision })}
        />
        {/* 保证金率 */}
        <MarginRateComp item={item} />
      </View>
      <View className={cn('flex-row justify-between items-center')}>
        <ListItem
          label={t('pages.position.Open Position Price')}
          align="start"
          value={toFixed(item?.startPrice, item?.symbolDecimal, false)}
        />
        {/* 标记价 */}
        <ListItem label={t('mt.biaojijia')} align="center" value={<CurrentPrice item={item} />} />
        <ListItem label={t('pages.trade.Fee')} align="end" value={formatNum(item?.handlingFees, { precision, isTruncateDecimal: false })} />
      </View>
      <View className={cn('flex flex-row items-center gap-x-2 mt-[13px]')}>
        <Button
          size="xs"
          containerClassName={cn('flex-1 h-full')}
          className={cn('bg-[#F3F5F6]')}
          onClick={() => {
            onPress(item, 'SPSL')
          }}
        >
          {t('mt.gengduoshezhi')}
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
          <Button size="xs" className={cn('bg-[#F3F5F6]')} containerClassName={cn('flex-1')} loading={loading4}>
            {t('pages.position.Market Price Close Position Btn')}
          </Button>
        </div>
      </View>
    </div>
  )
}

export default observer(PositionItem)
