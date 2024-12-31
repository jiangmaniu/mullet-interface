import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'

import { SOURCE_CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'
import InputNumber from '@/pages/webapp/components/Base/Form/InputNumber'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { formatNum } from '@/utils'

type IProps = {}

/** 挂单价格 */
function PendingPrice({ ...res }: IProps) {
  const { cn } = useTheme()
  const intl = useIntl()

  const { trade } = useStores()
  const { orderType, orderPrice: price, setOrderPrice } = trade

  const {
    step2,
    d,
    priceTip,
    priceRangeSymbol,
    // price,
    showPriceTipRedColor,
    disabledInput
    // 方法
    // setOrderPrice
  } = useTrade()

  const onChange = (value?: string) => {
    if (value) {
      setOrderPrice(value)
    }
  }

  const onAdd = () => {
    console.log('onAdd')
    if (price && Number(price) >= 0) {
      const c = (((Number(price) + step2) * 100) / 100).toFixed(d)
      setOrderPrice(c)
    } else {
      setOrderPrice(priceTip)
    }
  }

  const onMinus = () => {
    console.log('onMinus')
    if (price && Number(price) > 0) {
      const c = (((Number(price) - step2) * 100) / 100).toFixed(d)
      setOrderPrice(c)
    } else {
      setOrderPrice(priceTip)
    }
  }

  const priceRange = (
    <>
      {priceRangeSymbol} {formatNum(priceTip)}
    </>
  )

  const disabled = disabledInput

  return (
    <View className={cn('w-full')}>
      <View className={cn('flex-row items-center justify-between mb-2')}>
        <Text color="primary" weight="medium">
          {intl.formatMessage({ id: 'pages.trade.Price' })}
        </Text>
        <View className={cn('flex-row')}>
          <Text color="weak" size="xs">
            {intl.formatMessage({ id: 'pages.trade.Price Range' })}
          </Text>
          <Text font="dingpro-medium" color={showPriceTipRedColor ? 'red' : 'primary'} weight="medium" size="xs" className={cn('pl-1')}>
            {priceRange} {SOURCE_CURRENCY}
          </Text>
        </View>
      </View>
      <InputNumber
        placeholder={intl.formatMessage({ id: 'pages.trade.Price' })}
        height={46}
        fixedTrigger="onChange"
        onChange={onChange}
        // status={showPriceTipRedColor ? 'error' : undefined}
        onAdd={onAdd}
        onMinus={onMinus}
        value={price}
        // priceRange={priceRange}
        // showPriceTipRedColor={showPriceTipRedColor}
        disabled={disabled}
        className="text-base"
        {...res}
      />
    </View>
  )
}

export default observer(PendingPrice)
