import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'
import Button from '@/pages/webapp/components/Base/Button'
import InputNumber from '@/pages/webapp/components/Base/Form/InputNumber'
import { View } from '@/pages/webapp/components/Base/View'

type IProps = {
  isFull?: boolean
}

/** 下单手数 */
function OrderVolume({ isFull }: IProps) {
  const { cn, theme } = useTheme()
  const intl = useIntl()
  const { trade } = useStores()
  const { setOrderVolumeTag, orderVolumeTag, orderType } = trade

  const {
    step,
    countPrecision,
    maxOpenVolume,
    vmax,
    vmin,
    d,
    isBuy,
    orderVolume,
    disabledInput,
    // 方法
    setSl,
    setSp,
    setOrderVolume,
    resetSpSl,
    getInitPriceValue,
    setInputing
  } = useTrade()

  const onChange = (value: any) => {
    const val = Math.min(Number(value), maxOpenVolume)
    setOrderVolume(val || '')
  }

  const precision = countPrecision
  const value = String(orderVolume)
  const max = Math.min(vmax, maxOpenVolume)
  const min = vmin
  const disabled = disabledInput

  const onAdd = () => {
    if (orderVolume && (isBuy ? Number(orderVolume) < vmax : Number(orderVolume) <= 5)) {
      const c = (((Number(orderVolume) + step) * 100) / 100).toFixed(countPrecision)
      setOrderVolume(c)
    }
  }

  const onMinus = () => {
    if (orderVolume && (isBuy ? Number(orderVolume) > vmin : Number(orderVolume) > step)) {
      const c = (((Number(orderVolume) - step) * 100) / 100).toFixed(countPrecision)
      setOrderVolume(c)
    }
  }

  const fontSize = useMemo(() => {
    if (value && isFull) return 18
    if (value && !isFull) return 16
    return 14
  }, [isFull, value])

  return (
    <View>
      <InputNumber
        // rightText={intl.formatMessage({id:"pages.trade.Max"})}
        placeholder={intl.formatMessage({ id: 'pages.trade.OrderVolume' })}
        height={50}
        fixedTrigger="onChange"
        onChange={onChange}
        value={value}
        disabled={disabled}
        onAdd={onAdd}
        onMinus={onMinus}
        max={max}
        min={min}
        precision={precision}
        fontSize={16}
        onFocus={() => {
          setInputing(true)
        }}
        style={{ fontSize, lineHeight: 22 }}
      />
      <View className={cn('items-center gap-x-2  justify-between flex-row')}>
        {['0.01', '0.02', '0.05', '0.1'].map((item) => {
          const isActive = item === orderVolumeTag
          return (
            <Button
              onClick={() => {
                if (disabled || Number(item) > Number(maxOpenVolume)) {
                  return
                }
                setOrderVolumeTag(item)
                onChange?.(item)
              }}
              size="xs"
              key={item}
              containerClassName={cn('flex-1')}
              height={24}
              isDebounce={false}
              className={cn('p-0')}
              style={{
                ...(isActive
                  ? { borderColor: theme.colors.Button.defaultActiveBorder }
                  : {
                      backgroundColor: theme.colors.gray[50],
                      borderWidth: 0
                    })
              }}
              textClassName={cn('text-[12px]', !isActive && 'text-weak', 'font-medium')}
            >
              {item}
            </Button>
          )
        })}
      </View>
    </View>
  )
}

export default observer(OrderVolume)
