import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import InputNumber from '@/pages/webapp/components/Base/Form/InputNumber'
import Slider from '@/pages/webapp/components/Base/Slider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import useFocusEffect from '@/pages/webapp/hooks/useFocusEffect'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { addMargin, extractMargin } from '@/services/api/tradeCore/order'
import { formatNum, getPrecisionByNumber, toFixed } from '@/utils'
import { message } from '@/utils/message'
import { covertProfit } from '@/utils/wsUtil'
import { useModel } from '@umijs/max'
import { Segmented } from 'antd'
import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { RenderTabRef } from '.'
import { Params } from '../TopTabbar/types'

type IProps = {
  rawItem: Order.BgaOrderPageListItem
  close?: () => void
  setTabKey?: (value: Params['tabKey']) => void
}

type MarginType = 'ADD' | 'MINUS'

const RenderMarginTab = forwardRef((props: IProps, ref: ForwardedRef<RenderTabRef>) => {
  const { rawItem, close, setTabKey } = props
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { fetchUserInfo } = useModel('user')
  const [marginTypeActiveKey, setMarginTypeActiveKey] = useState<MarginType>('ADD')

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

  const [count, setCount] = useState<any>('')
  // const [marginSliderValue, setMarginSliderValue] = useState(0) // 保证金
  const [margin, setMargin] = useState<any>(0)

  const { trade } = useStores()
  const { currentAccountInfo } = trade

  const orderVolume = useMemo(() => Number(item.orderVolume || 0), [item.orderVolume]) // 手数
  const precision = currentAccountInfo.currencyDecimal
  const isAddMargin = marginTypeActiveKey === 'ADD'

  const { availableMargin } = trade.accountBalanceInfo

  useEffect(() => {
    setCount(orderVolume)
  }, [orderVolume])

  useEffect(() => {
    setMargin(0)
    // setMarginSliderValue(0)
  }, [marginTypeActiveKey])

  const marginOptions: Array<{ value: MarginType; label: string }> = [
    {
      value: 'ADD',
      label: t('pages.position.Add Margin')
    },
    {
      value: 'MINUS',
      label: t('pages.position.Minus Margin')
    }
  ]

  // 保证金确认
  const submitMargin = useCallback(async () => {
    if (!margin) return message.info(t('pages.trade.Input Margin'))
    const params = {
      [isAddMargin ? 'addMargin' : 'extractMargin']: margin,
      bagOrderId: item?.id // 持仓订单号
    }
    const reqFn = isAddMargin ? addMargin : extractMargin
    // @ts-ignore
    const res = await reqFn(params)
    const success = res.success

    if (success) {
      // 关闭弹窗
      close?.()
      // 刷新持仓单
      trade.getPositionList()
      // 刷新账户信息
      await fetchUserInfo(true)
      message.info(t('common.operate.Op Success'))
    }
  }, [item, t, close, trade, fetchUserInfo])

  useImperativeHandle(ref, () => ({
    submit: submitMargin
  }))

  useFocusEffect(
    useCallback(() => {
      // TopTabbar.summit 需要
      setTabKey?.('MARGIN')
    }, [])
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)

  // 增加、减少保证金
  const renderMarginTab = useMemo(() => {
    const orderMargin = item?.orderMargin || 0 // 订单追加的保证金
    const orderBaseMargin = item?.orderBaseMargin || 0 // 订单基础保证金，减少的保证金不能低于基础保证金
    const avaMargin = Number(isAddMargin ? availableMargin : toFixed(orderMargin - orderBaseMargin, getPrecisionByNumber(orderMargin))) // 增加、减少保证金的可用额度

    return (
      <>
        {
          <View className={cn('mt-3')}>
            <Segmented
              className="account"
              // rootClassName="border-gray-700 border-[0.5px] rounded-[26px]"
              onChange={(value: any) => {
                setMarginTypeActiveKey(value)
              }}
              value={marginTypeActiveKey}
              options={marginOptions}
            />
            <View className={cn('mt-3')}>
              <InputNumber
                placeholder={t('pages.position.Input Margin')}
                height={42}
                value={String(margin || '')}
                onChange={(v: any) => {
                  setMargin(v)
                  setSliderValue(v ? (v / avaMargin) * 100 : 0) // 计算滑块值
                }}
                onlyPositive
                fixedTrigger="always"
                max={avaMargin}
                min={0.01}
                disabled={!avaMargin}
                precision={precision}
                containerClassName="!mb-0"
              />
              <View className={cn('mb-3 p-2')}>
                <Slider
                  unit="%"
                  marks={['0', '25', '50', '75', '100']}
                  step={1}
                  min={0}
                  max={100}
                  onSlidingComplete={(value: any) => {
                    // 可用保证金*百分比
                    setMargin(toFixed((value / 100) * avaMargin, precision))
                  }}
                  onChange={(value: any) => {
                    setSliderValue(value)
                  }}
                  value={sliderValue}
                  disabled={!avaMargin}
                />
              </View>
              <View>
                <Text size="xs" color="secondary" className={cn('mb-1')}>
                  {isAddMargin ? t('pages.position.Max Add Margin') : t('pages.position.Max Minus Margin')}{' '}
                  {formatNum(avaMargin, { precision })} USD
                </Text>
                {/* <Text size="xs" color="secondary">
                    {t('pages.position.Add Margin ForcePrice')} 486,302.00 USD
                  </Text> */}
              </View>
            </View>
          </View>
        }
      </>
    )
  }, [marginTypeActiveKey, isAddMargin, precision, availableMargin, item, margin, marginOptions, sliderValue])

  return <>{renderMarginTab}</>
})

export default RenderMarginTab
