import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { useGetCurrentQuoteCallback } from '@/utils/wsUtil'

import InputNumber from '../../../Base/Form/InputNumber'
import SheetModal, { SheetRef } from '../../../Base/SheetModal'
import Slider from '../../../Base/Slider'
import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'

export type LevelAgeModalRef = {
  show: () => void
  close: () => void
}

function LevelAgeModal(props: any, ref: ForwardedRef<LevelAgeModalRef>) {
  const bottomSheetModalRef = useRef<SheetRef>(null)
  const intl = useIntl()
  const { trade } = useStores()
  const { cn, theme } = useTheme()
  const { leverageMultiple } = trade
  const getCurrentQuote = useGetCurrentQuoteCallback()
  const quoteInfo = getCurrentQuote()
  const symbolConf = quoteInfo?.symbolConf
  const prepaymentConf = symbolConf?.prepaymentConf
  const minLever = prepaymentConf?.float_leverage?.min_lever || 1
  const maxLever = prepaymentConf?.float_leverage?.max_lever || 30

  const [value, setValue] = useState('1')

  // 只需要展示最小最大值
  const sliderMarks = [minLever, maxLever]

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  useEffect(() => {
    const initValue = String(leverageMultiple || 2)
    setValue(initValue)
  }, [leverageMultiple])

  const renderSlider = useMemo(() => {
    return (
      <Slider
        onChange={(value) => {
          // console.log('value', value)
          setValue(String(value))
        }}
        min={minLever}
        max={maxLever}
        marks={sliderMarks}
        value={value}
        // disabled={false}
      />
    )
  }, [minLever, maxLever, value])

  return (
    <SheetModal
      onDismiss={() => {
        setValue(String(leverageMultiple))
      }}
      onConfirm={async () => {
        trade.setLeverageMultiple(Number(value))
        setTimeout(() => {
          bottomSheetModalRef.current?.sheet?.dismiss()
        }, 100)
      }}
      ref={bottomSheetModalRef}
      height="50%"
    >
      <View className={cn('w-full')}>
        <View className={cn('mx-7 mb-6 items-center justify-center')}>
          <Text size="xl" color="primary" weight="medium">
            {intl.formatMessage({ id: 'pages.trade.Adjust leverage title' })}
          </Text>
        </View>
        <View className={cn('mx-6')}>
          <InputNumber
            value={value}
            placeholder={intl.formatMessage({ id: 'pages.trade.Leverage Multiplier' })}
            height={50}
            rightText={intl.formatMessage({ id: 'pages.trade.Max' })}
            onPressRightText={() => {
              setValue(String(maxLever))
            }}
            onChange={setValue}
            min={Number(minLever)}
            max={Number(maxLever)}
            hiddenPrecision
          />
          {renderSlider}
        </View>
        <View className={cn('mx-3')}>
          {/* @TODO */}
          {/* <View className={cn('items-center flex-row overflow-hidden')}>
            <Iconfont name="fangdian" size={16} color={theme.colors.brand.DEFAULT} />
            <Text size="sm" color="primary" className={cn('ml-1')}>
              {t('pages.trade.Adjust leverage tips1', { num: 100000000 })}
            </Text>
          </View> */}
          <View className={cn('items-center flex-row my-2 overflow-hidden')}>
            <Iconfont name="fangdian" size={16} color={theme.colors.brand.DEFAULT} />
            <Text size="sm" color="primary" className={cn('ml-1')}>
              {intl.formatMessage({ id: 'pages.trade.Adjust leverage tips2' })}
            </Text>
          </View>
          <View className={cn('items-center flex-row overflow-hidden')}>
            <Iconfont name="fangdian" size={16} color={theme.colors.brand.DEFAULT} />
            <Text size="sm" color="primary" className={cn('ml-1')}>
              {intl.formatMessage({ id: 'pages.trade.Adjust leverage tips3' })}
            </Text>
          </View>
        </View>
      </View>
    </SheetModal>
  )
}

export default observer(forwardRef(LevelAgeModal))
