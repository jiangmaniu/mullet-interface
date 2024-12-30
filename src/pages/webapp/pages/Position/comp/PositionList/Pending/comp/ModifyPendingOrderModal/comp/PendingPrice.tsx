import { useTheme } from '@/context/themeProvider'
import InputNumber, { InputNumberProps } from '@/pages/webapp/components/Base/Form/InputNumber'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { observer } from 'mobx-react'

type IProps = InputNumberProps & {
  /** 价格范围 */
  priceRange?: React.ReactNode
  showPriceTipRedColor?: boolean
}

/** 挂单价格 */
function PendingPrice({ priceRange, showPriceTipRedColor, ...res }: IProps) {
  const { cn } = useTheme()
  const { t } = useI18n()

  return (
    <View className={cn('mb-3 w-full')}>
      <View className={cn('flex-row items-center justify-between mb-2')}>
        <Text color="primary" weight="medium">
          {t('pages.trade.Price')}
        </Text>
        <View className={cn('flex-row')}>
          <Text color="weak" size="xs">
            {t('pages.trade.Price Range')}
          </Text>
          <Text color={showPriceTipRedColor ? 'red' : 'primary'} weight="medium" size="xs" className={cn('pl-1')}>
            {priceRange} USD
          </Text>
        </View>
      </View>
      <InputNumber placeholder={t('pages.trade.Price')} height={46} {...res} />
    </View>
  )
}

export default observer(PendingPrice)
