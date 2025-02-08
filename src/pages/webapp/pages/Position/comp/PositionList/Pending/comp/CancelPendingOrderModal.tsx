import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum } from '@/utils'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'

type IProps = {
  trigger?: JSX.Element
  item: Order.OrderPageListItem
}

export type CancelPendingOrderModalRef = {
  show: () => void
  close: () => void
}

/** 撤销挂单 */
function CancelPendingOrderModal({ trigger, item }: IProps, ref: ForwardedRef<CancelPendingOrderModalRef>) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade } = useStores()
  const { currentAccountInfo } = trade

  const bottomSheetModalRef = useRef<SheetRef>(null)

  const close = () => {
    bottomSheetModalRef.current?.sheet?.dismiss()
  }

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close
  }))

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height={'55%'}
      trigger={trigger}
      title={t('pages.position.Cancel Pending Order Title')}
      buttonBlock={false}
      children={
        <View className={cn('px-5 flex-1 mt-3')}>
          <View className={cn('mb-3')}>
            <Text size="sm" leading="xl" color="secondary">
              {t('pages.position.Cancel Pending Order Desc')}
            </Text>
          </View>
          <View className={cn('flex-row')}>
            <View className={cn('flex-row w-full items-center rounded-xl border px-3 py-4')} borderColor="weak">
              <SymbolIcon src={item.imgUrl} width={32} height={32} />
              <View className={cn('pl-3')}>
                <View className={cn('flex-row items-center')}>
                  <Text size="base" weight="medium" className={cn('font-medium')}>
                    {item.symbol}
                  </Text>
                  <Text size="sm" weight="medium" color={item.buySell === 'BUY' ? 'green' : 'red'} className={cn('font-medium pl-2')}>
                    {item.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')} {item.orderVolume}
                  </Text>
                </View>
                <Text size="xs">
                  {t('pages.position.Pending Order Price')} {formatNum(item.limitPrice)}
                </Text>
              </View>
            </View>
          </View>
          <View className={cn('flex-row mt-2')}>
            <View
              className={cn('px-[6px] py-2')}
              style={{
                backgroundColor: theme.colors.gray[50]
              }}
            >
              <Text size="sm" color="secondary" weight="medium" leading="base">
                {currentAccountInfo.synopsis?.abbr} {currentAccountInfo.accountGroupId}
              </Text>
            </View>
          </View>
        </View>
      }
      onConfirm={async () => {
        await trade.cancelOrder({ id: item.id })
        close()
      }}
    />
  )
}

export default observer(forwardRef(CancelPendingOrderModal))
