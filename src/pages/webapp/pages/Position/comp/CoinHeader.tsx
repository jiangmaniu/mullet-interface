import { Enums } from '@/constants/enum'
import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'

export type ISymbolItem = {
  imgUrl: string
  symbol: string
  buySell: string
  leverageMultiple?: number
  orderVolume?: number
  marginType?: API.MarginType
  startPrice?: number
  tradePrice?: number
}

type IProps<T extends ISymbolItem> = {
  item: T
}

export default function CoinHeader<T extends ISymbolItem>({ item }: IProps<T>) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  if (!item) return <></>

  return (
    <View className={cn('items-center flex-row')}>
      <SymbolIcon width={30} height={30} src={item.imgUrl} />
      <View className={cn('pl-2')}>
        <View className={cn('flex-row items-center')}>
          <Text size="base" color="primary" weight="semibold" className={cn('leading-4 pr-1')}>
            {item.symbol}
          </Text>
          <Text size="sm" color={item.buySell === 'BUY' ? 'green' : 'red'} weight="medium" leading="base">
            {item.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')}&nbsp;
            {item.leverageMultiple ? `${item.leverageMultiple}X ` : ''}
            {/* {item.orderVolume} */}
          </Text>
        </View>
        <View className={cn('flex-row items-center')}>
          <Text size="xs" className={cn('leading-4')}>
            {item.marginType === 'CROSS_MARGIN' ? t('common.enum.MarginType.CROSS_MARGIN') : t('common.enum.MarginType.ISOLATED_MARGIN')}
          </Text>
          {
            // @ts-ignore
            item.type && (
              <>
                <View className={cn('h-2 w-[1px] mx-[6px]')} style={{ backgroundColor: theme.colors.Divider.heavy }} />
                <Text size="xs" weight="medium">
                  {/* @ts-ignore */}
                  {t(`${Enums.OrderType?.[item.type as keyof typeof Enums.OrderType]?.key}`) || '-'}
                </Text>
              </>
            )
          }
          {/* <Text size="xs" weight="medium">
            {item.startPrice || '--'}
          </Text>
          <View className={cn('px-1')}>
            <Iconfont name="hangqing-biandong" size={14} />
          </View>
          <Text size="xs" weight="medium">
            {item.tradePrice || '--'}
          </Text> */}
          {/* <View className={cn('flex-row items-center ml-1')}>
            <View
              className={cn('rounded-tl rounded-bl w-[17px] h-[14px] items-center justify-center', {
                backgroundColor: theme.colors.green.DEFAULT
              })}
            >
              <Text size="xxs" weight="medium" leading="xs" color="white">
                TP
              </Text>
            </View>
            <View
              className={cn('rounded-tr rounded-br w-[17px] h-[14px] items-center justify-center', {
                backgroundColor: theme.colors.red.DEFAULT
              })}
            >
              <Text size="xxs" weight="medium" leading="xs" color="white">
                SL
              </Text>
            </View>
          </View> */}
        </View>
      </View>
    </View>
  )
}
