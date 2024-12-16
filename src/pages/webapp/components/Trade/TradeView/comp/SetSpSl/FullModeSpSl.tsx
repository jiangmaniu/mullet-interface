import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import { SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'
import InputNumber from '@/pages/webapp/components/Base/Form/InputNumber'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { formatNum } from '@/utils'

type IFormValues = {
  /** 止盈价格展示值 */
  spPriceShow?: any
  /** 止损价格展示值 */
  slPriceShow?: any
  /** 预估盈利金额展示值 */
  spAmountShow?: any
  /** 预估亏损金额展示值 */
  slAmountShow?: any
}

const spPriceShowFormat = (value: string) => {
  return Number(value) > 0 ? `+${value}` : value
}

type IProps = {
  /** 使用外部(父组件）初始化的 useTrade */
  useOuterTrade?: boolean
  setValues?: (sl: number, tp: number) => void
  marketItem?: Order.BgaOrderPageListItem
}

const ProfitScope = observer(() => {
  const { cn, theme } = useTheme()
  const intl = useIntl()

  const { spFlag, isBuy, sp_scope, d, rangeSymbol } = useTrade()

  return (
    <View className={cn('flex-row items-end')}>
      <Text size="sm" weight="medium" color="primary" className={cn('pr-2')}>
        {intl.formatMessage({ id: 'pages.trade.Sp' })}
      </Text>
      <Text size="xs" font="dingpro-medium" color={spFlag ? 'red' : 'weak'}>
        {intl.formatMessage({ id: 'pages.trade.Range' })} {isBuy ? rangeSymbol[0] : rangeSymbol[1]} {formatNum(sp_scope, { precision: d })}{' '}
        {SOURCE_CURRENCY}
      </Text>
    </View>
  )
})
const StopLossScope = observer(() => {
  const { cn, theme } = useTheme()
  const intl = useIntl()

  const { slFlag, isBuy, sl_scope, d, rangeSymbol } = useTrade()

  return (
    <View className={cn('flex-row items-end')}>
      <Text size="sm" weight="medium" color="primary" className={cn('pr-2')}>
        {intl.formatMessage({ id: 'pages.trade.Sl' })}
      </Text>
      <Text size="xs" font="dingpro-medium" color={slFlag ? 'red' : 'weak'}>
        {intl.formatMessage({ id: 'pages.trade.Range' })} {isBuy ? rangeSymbol[1] : rangeSymbol[0]} {formatNum(sl_scope, { precision: d })}{' '}
        USD
      </Text>
    </View>
  )
})

/** 全屏模式展示 下单止盈止损设置 */
function FullModeSpSl({ useOuterTrade = false, setValues, marketItem }: IProps) {
  const { trade } = useStores()
  const { orderType } = trade
  const { cn, theme } = useTheme()
  const intl = useIntl()

  // 缓存按价格或者金额展示的值，用于恢复表单展示
  const [formData, setFormData] = useState<IFormValues>({
    // 止盈
    spPriceShow: '',
    spAmountShow: '',
    // 止损
    slPriceShow: '',
    slAmountShow: ''
  })

  // 记录计算过的值
  const updateValue = (key: keyof IFormValues, value: any) => {
    setFormData({
      ...formData,
      [key]: String(value)
    })
  }

  let {
    d,
    step,
    setSp,
    setSl,
    setSpAmount,
    setSlAmount,
    spValueEstimate,
    slValueEstimate,
    spValuePrice,
    slValuePrice,
    setInputing,
    disabledInput: disabled
  } = useTrade({
    marketItem
  })

  useEffect(() => {
    if (setValues) {
      setValues(Number(slValuePrice || 0), Number(spValuePrice || 0))
    }
  }, [setValues, slValuePrice, spValuePrice])

  return (
    <View className={cn('pt-3 w-full')}>
      <View>
        <ProfitScope />
        <View className={cn('items-center pt-2 flex-row justify-between gap-x-2')}>
          <View className={cn('flex-1')}>
            <InputNumber
              // @ts-ignore @TODO 待替换
              textAlign="center"
              onFocus={() => {
                setInputing(true)
              }}
              step={step}
              // status={spFlag ? 'error' : undefined}
              placeholder={intl.formatMessage({ id: 'pages.trade.Price' })}
              disabled={disabled}
              value={String(spValuePrice || '')}
              precision={d}
              // @ts-ignore @TODO 待替换
              onEndEditing={(value) => {
                if (Number.isNaN(Number(value))) {
                  return
                }

                const val = Number(value) > 0 ? value : ''
                setSp(val)
              }}
              style={['text-[13px] leading-5']}
            />
          </View>
          <View className={cn('flex-1')}>
            <InputNumber
              // @ts-ignore @TODO 待替换
              textAlign="center"
              onFocus={() => {
                setInputing(true)
              }}
              step={step}
              placeholder={intl.formatMessage({ id: 'pages.trade.Estimated profit' })}
              disabled={disabled}
              precision={d}
              // value={!spLeftFocus && !spRightFocus ? spValueEstimate : spRightFocus ? spAmount : spLeftFocus ? spValueEstimate : spPrice}
              value={String(spValueEstimate)}
              // @ts-ignore @TODO 待替换
              onEndEditing={(value) => {
                if (Number.isNaN(Number(value))) {
                  return
                }
                const val = Number(value) > 0 ? value : ''
                setSpAmount(val)
              }}
              style={['text-[13px] leading-5']}
            />
          </View>
        </View>
      </View>
      <View>
        <StopLossScope />
        <View className={cn('items-center pt-2 flex-row justify-between gap-x-2')}>
          <View className={cn('flex-1')}>
            <InputNumber
              // @ts-ignore @TODO 待替换
              textAlign="center"
              onFocus={() => {
                setInputing(true)
              }}
              step={step}
              // status={slFlag ? 'error' : undefined}
              placeholder={intl.formatMessage({ id: 'pages.trade.Price' })}
              disabled={disabled}
              precision={d}
              value={String(slValuePrice || '')}
              // @ts-ignore @TODO 待替换
              onEndEditing={(value) => {
                if (Number.isNaN(Number(value))) {
                  return
                }

                const val = Number(value) > 0 ? value : ''
                setSl(val)
              }}
              style={['text-[13px] leading-5']}
            />
          </View>
          <View className={cn('flex-1')}>
            <InputNumber
              // @ts-ignore @TODO 待替换
              textAlign="center"
              onFocus={() => {
                setInputing(true)
              }}
              step={step}
              placeholder={intl.formatMessage({ id: 'pages.trade.Estimated loss' })}
              disabled={disabled}
              precision={d}
              min={-999999999999}
              value={String(slValueEstimate || '')}
              // @ts-ignore @TODO 待替换
              onEndEditing={(value) => {
                if (Number.isNaN(Number(value))) {
                  return
                }
                const val = Math.abs(Number(value)) // value 可能为负数, 这里取绝对值
                setSlAmount(val)
              }}
              style={['text-[13px] leading-5']}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default observer(FullModeSpSl)
