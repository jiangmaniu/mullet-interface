import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { IPriceOrAmountType } from '@/mobx/trade'

import SheetModal, { SheetRef } from '../../../Base/SheetModal'
import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'

type IProps = {
  trigger?: JSX.Element
  onChange?: (key: IPriceOrAmountType) => void
  value?: IPriceOrAmountType
}

export type PriceAmountModalRef = {
  show: () => void
  close: () => void
}

function PriceAmountModal({ trigger, onChange, value }: IProps, ref: ForwardedRef<PriceAmountModalRef>) {
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const intl = useIntl()
  const { cn } = useTheme()
  const [selectValue, setSelectValue] = useState<IPriceOrAmountType>('PRICE')

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  useEffect(() => {
    if (value) {
      setSelectValue(value)
    }
  }, [value])

  const typeList: Array<{ key: IPriceOrAmountType; desc: string; label: string }> = [
    {
      key: 'PRICE',
      label: intl.formatMessage({ id: 'pages.trade.Price' }),
      desc: intl.formatMessage({ id: 'pages.trade.Set spSl modal price tips' })
    },
    {
      key: 'AMOUNT',
      label: intl.formatMessage({ id: 'pages.trade.Amount' }),
      desc: intl.formatMessage({ id: 'pages.trade.Set spSl modal amount tips' })
    }
  ]

  return (
    <SheetModal ref={bottomSheetModalRef} trigger={trigger} height="54%" hiddenFooter>
      <View className={cn('mt-1 w-full')}>
        <View className={cn('mx-7 mb-6')}>
          <Text size="xl" color="primary" weight="medium">
            {intl.formatMessage({ id: 'pages.trade.SpSl Type Modal Title' })}
          </Text>
        </View>
        <View className={cn('mx-3')}>
          {typeList.map((item) => (
            <View
              key={item.key}
              onClick={() => {
                onChange?.(item.key)
                setSelectValue(item.key)
                bottomSheetModalRef.current?.sheet?.dismiss()
              }}
            >
              <View
                className={cn('border rounded-xl mb-3 px-4 py-3')}
                borderColor={selectValue === item.key ? 'active' : 'weak'}
                key={item.key}
              >
                <View className={cn('items-center flex-row mb-2 justify-between')}>
                  <Text color="primary" size="base" weight="bold">
                    {item.label}
                  </Text>
                  {selectValue === item.key && <Iconfont name="danchuang-xuanzhong" size={20} />}
                </View>
                <Text color="primary" size="xs">
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SheetModal>
  )
}

export default observer(forwardRef(PriceAmountModal))
