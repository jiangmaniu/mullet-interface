import { TRADE_BUY_SELL } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { ColorType, Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum, toFixed } from '@/utils'
import { calcYieldRate, covertProfit, getCurrentQuote } from '@/utils/wsUtil'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { IFormValues } from './TabItems'
import { Params } from './TopTabbar/types'

type IProps = {
  item: Order.BgaOrderPageListItem
  visible?: boolean
  close?: () => void
  children?: React.ReactNode
}

export type PositionModalRef = {
  show: (params: { tabKey: Params['tabKey']; cb?: () => void }) => void
  close: () => void
  visible: boolean | undefined
}

const ListItem = ({
  label,
  value,
  align,
  valueColor
}: {
  label: React.ReactNode
  value: any
  align?: 'end' | 'start' | 'center'
  valueColor?: ColorType
}) => {
  const { cn, theme } = useTheme()

  const textClassName = cn(align === 'end' && 'text-right', align === 'center' && 'text-center')

  return (
    <View className={cn('mb-3 flex-1 flex flex-col', align === 'end' && 'items-end', align === 'center' && 'items-center')}>
      <Text color="secondary" size="xs" leading="base" className={textClassName}>
        {label}
      </Text>
      <Text color={valueColor || 'primary'} size="xs" leading="sm" className={textClassName}>
        {value}
      </Text>
    </View>
  )
}

// 利润组件
export const ModalProfit = ({ profit, precision }: { profit: number | undefined; precision?: number }) => {
  const profitFormat = Number(profit) ? formatNum(profit, { precision }) : profit || '-'

  return (
    <Text size="xl" weight="medium" font="dingpro-medium" color={Number(profit) > 0 ? 'green' : 'red'}>
      {Number(profit) > 0 ? '+' + profitFormat : profitFormat}
    </Text>
  )
}

// 收益率组件
export const ModalYieldRate = ({ yieldRate, precision }: { yieldRate: string; precision?: number }) => {
  return (
    <Text size="xs" weight="medium" font="dingpro-medium" color={Number(yieldRate) > 0 ? 'green' : 'red'}>
      {yieldRate}
    </Text>
  )
}

const PositionContent = ({ item: rawItem, children }: IProps) => {
  const [pageActive, setPageActive] = useState(false)

  useEffect(() => {
    setPageActive(true)

    return () => {
      setPageActive(false)
    }
  }, [])

  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade, ws } = useStores()
  const { fetchUserInfo } = useModel('user')
  const precision = trade.currentAccountInfo.currencyDecimal
  const [formData, setFormData] = useState({} as IFormValues)
  const tabbarRef = useRef<any>(null)

  /**
   * 在组件内部管理 item 状态变化，避免重渲染
   * item 根据  covertProfit 变化
   */
  const item = useMemo(() => {
    if (!rawItem) {
      return rawItem
    }

    rawItem.profit = covertProfit(rawItem) as number // 浮动盈亏

    // 全仓使用基础保证金
    if (rawItem.marginType === 'CROSS_MARGIN') {
      rawItem.orderMargin = rawItem.orderBaseMargin
    }

    return rawItem
  }, [rawItem, covertProfit])

  const symbol = item?.symbol
  const quoteInfo = getCurrentQuote(symbol)
  // 标记价
  const currentPrice = useMemo(
    () => (item?.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask), // 价格需要取反方向的
    [item?.buySell, quoteInfo?.bid, quoteInfo?.ask]
  )

  const orderMargin = useMemo(
    () => (item?.orderMargin ? formatNum(item?.orderMargin, { precision }) : '--'),
    [item?.orderMargin, precision]
  )
  // const spslInfo = useModifySpSl(item)

  const profit = useMemo(() => {
    return item?.profit as number // 浮动盈亏
  }, [item?.profit])

  const yieldRate = useMemo(() => {
    return calcYieldRate(item, precision) // 收益率
  }, [item?.profit, precision])

  return (
    <View className={cn('flex-1 overflow-y-auto')}>
      {pageActive && (
        <>
          <View className={cn('px-4')}>
            <View className={cn('flex-row w-full items-center rounded-xl pb-3')}>
              <SymbolIcon src={item?.imgUrl} width={32} height={32} />
              <View className={cn('pl-3 flex-row items-center justify-between flex-1')}>
                <View>
                  <View className={cn('flex-row items-center')}>
                    <Text size="base" weight="medium" className={cn('font-medium')}>
                      {item?.alias || item?.symbol}
                    </Text>
                    <Text size="sm" weight="medium" color={item?.buySell === 'BUY' ? 'green' : 'red'} className={cn('font-medium pl-2')}>
                      {item?.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')}{' '}
                      {item?.leverageMultiple ? `${item?.leverageMultiple}X ` : ''}
                      {item?.orderVolume}
                    </Text>
                  </View>
                  <Text size="xs">
                    {item?.marginType === 'CROSS_MARGIN'
                      ? t('common.enum.MarginType.CROSS_MARGIN')
                      : t('common.enum.MarginType.ISOLATED_MARGIN')}
                  </Text>
                </View>
                <View className={cn('flex flex-col items-end')}>
                  <ModalProfit profit={profit} precision={precision} />
                  <ModalYieldRate yieldRate={yieldRate} precision={precision} />
                </View>
              </View>
            </View>
            <View className={cn('flex-row mb-4 justify-between items-center')}>
              <Text size="xs" color="secondary">
                {item?.createTime}
              </Text>
              <Text size="xs" color="secondary">
                {t('pages.position.Floating P&L')}(USD)/{t('pages.position.Yield Rate')}
              </Text>
            </View>
            <View className={cn('flex-row flex justify-between items-center')}>
              <ListItem label={t('pages.position.Open Position Volume')} value={item?.orderVolume} />
              <ListItem
                label={t('pages.position.Open Position Price')}
                align="center"
                value={toFixed(item?.startPrice, item?.symbolDecimal, false)}
              />
              <ListItem
                label={t('pages.position.Current Market Price')}
                valueColor={quoteInfo?.bidDiff > 0 ? 'green' : 'red'}
                value={formatNum(currentPrice, { precision: item?.symbolDecimal })}
                align="end"
              />
            </View>
            <View className={cn('flex-row justify-between items-center')}>
              <ListItem label={t('pages.trade.Margin')} value={orderMargin} />
              <ListItem
                label={t('pages.trade.Fee')}
                align="center"
                value={formatNum(item?.handlingFees, { precision, isTruncateDecimal: false })}
              />
              <ListItem
                label={t('pages.position.Stock Fee')}
                value={formatNum(item?.interestFees, { precision, isTruncateDecimal: false })}
                align="end"
              />
            </View>
            <View className={cn('flex-row items-center')}>
              <ListItem label={t('pages.position.Position No')} value={item?.id} />
            </View>
          </View>
          {children}
        </>
      )}
    </View>
  )
}

export default memo(observer(PositionContent), (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id
})
