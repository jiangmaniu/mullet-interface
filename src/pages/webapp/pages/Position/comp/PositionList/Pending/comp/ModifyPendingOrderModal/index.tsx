import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'
import { RecordModalItem } from '@/mobx/trade'
import SheetModal, { SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import SymbolIcon from '@/pages/webapp/components/Quote/SymbolIcon'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum } from '@/utils'
import { message } from '@/utils/message'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { IFormValues } from './TabItem'
import ModifyPendingTopTabbar, { Params } from './TopTabbar'

type IProps = {
  trigger?: JSX.Element
  item: Order.OrderPageListItem
  tabKey: Params['tabKey']
}

export type ModifyPendingOrderModalRef = {
  show: () => void
  close: () => void
}

/** 修改挂单 */
function ModifyPendingOrderModal({ tabKey, trigger, item }: IProps, ref: ForwardedRef<ModifyPendingOrderModalRef>) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const { trade } = useStores()
  const [formData, setFormData] = useState({} as IFormValues)
  const [currentTab, setCurrentTab] = useState<Params['tabKey']>('PENDING')

  const bottomSheetModalRef = useRef<SheetRef>(null)
  const isBuy = item.buySell === 'BUY'
  const orderType = item.type

  const close = () => {
    bottomSheetModalRef.current?.sheet?.dismiss()
  }

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close
  }))

  const {
    setOrderPrice,
    setOrderVolume,
    slFlag,
    spFlag,
    orderVolume,
    price: limitPrice,
    setSp,
    setSl,
    stopLoss,
    takeProfit,
    disabledBtn
  } = useTrade({
    limitStopItem: item
  })

  // 修改挂单
  const onConfirm = async () => {
    const msg = t('pages.trade.SpSl Set Error')

    if (slFlag) {
      message.info(msg)
      return
    }
    if (spFlag) {
      message.info(msg)
      return
    }

    const params = {
      orderId: item.id,
      limitPrice: Number(limitPrice),
      orderVolume: Number(orderVolume),
      takeProfit,
      stopLoss
    } as Order.UpdatePendingOrderParams

    console.log('修改挂单参数', params)

    const res = await trade.modifyPendingOrder(params)

    if (res.success) {
      // 关闭当前弹窗
      close()
    }
  }

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      height={'60%'}
      trigger={trigger}
      onOpenChange={(open) => {
        if (open) {
          setOrderPrice(item.limitPrice || '')
          setOrderVolume(item.orderVolume || '')
          setSp(item.takeProfit || '')
          setSl(item.stopLoss || '')
        } else {
          // 关闭弹窗
          setOrderPrice('')
          setSp('')
          setSl('')
          setOrderVolume('')
          // 重置内容
          trade.setRecordModalItem({} as RecordModalItem)
        }
      }}
      confirmText={t('common.operate.Confirm Modify')}
      disabled={disabledBtn}
      children={
        <View className={cn('flex-1')}>
          <View className={cn('flex-row px-4')}>
            <View className={cn('flex-row w-full items-center rounded-xl pb-2 pt-1')}>
              <SymbolIcon src={item.imgUrl} width={32} height={32} />
              <View className={cn('pl-3')}>
                <View className={cn('flex-row items-center')}>
                  <Text size="base" weight="medium" className={cn('font-medium')}>
                    {item?.alias || item?.symbol}
                  </Text>
                  <Text size="sm" weight="medium" color={item.buySell === 'BUY' ? 'green' : 'red'} className={cn('font-medium pl-2')}>
                    {item.buySell === 'BUY' ? t('common.enum.TradeBuySell.BUY') : t('common.enum.TradeBuySell.SELL')}{' '}
                    {item.leverageMultiple ? `${item.leverageMultiple}X ` : ''}
                    {item.orderVolume}
                  </Text>
                </View>
                <Text size="xs">
                  {t('pages.position.Pending Order Price')} {formatNum(item.limitPrice)}
                </Text>
              </View>
            </View>
          </View>
          <ModifyPendingTopTabbar
            // onValueChange={(values) => {
            //   console.log('values', values)
            //   setFormData({ ...formData, ...values })
            // }}
            item={item}
            tabKey={tabKey}
            onChangeTab={(tabKey) => {
              setCurrentTab(tabKey)
            }}
          />
        </View>
      }
      backgroundStyle={{ backgroundColor: theme.colors.backgroundColor.primary }}
      onConfirm={onConfirm}
      dragOnContent={false}
    />
  )
}

export default observer(forwardRef(ModifyPendingOrderModal))
