import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import useTrade from '@/hooks/useTrade'
import CheckBox from '@/pages/webapp/components/Base/CheckBox'
import InputNumber from '@/pages/webapp/components/Base/Form/InputNumber'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { formatNum } from '@/utils'

import PriceAmountModal, { PriceAmountModalRef } from '../PriceAmountModal'

const RenderSpPriceAmountModal = forwardRef((_, ref: ForwardedRef<PriceAmountModalRef>) => {
  const { setSpPriceOrAmountType, spPriceOrAmountType } = useTrade({
    //   initialized: true
  })
  const valueKey = spPriceOrAmountType
  const modalRef = useRef<PriceAmountModalRef>(null)
  useImperativeHandle(ref, () => ({
    show: () => {
      modalRef.current?.show()
    },
    close: () => {
      modalRef.current?.close()
    }
  }))

  return (
    <PriceAmountModal
      ref={modalRef}
      onChange={(value) => {
        setSpPriceOrAmountType(value)
      }}
      value={valueKey}
    />
  )
})

const RenderSlPriceAmountModal = forwardRef((_, ref: ForwardedRef<PriceAmountModalRef>) => {
  const { setSlPriceOrAmountType, slPriceOrAmountType } = useTrade({
    // initialized: true
  })
  const valueKey = slPriceOrAmountType
  const modalRef = useRef<PriceAmountModalRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      modalRef.current?.show()
    },
    close: () => {
      modalRef.current?.close()
    }
  }))

  return (
    <PriceAmountModal
      ref={modalRef}
      onChange={(value) => {
        setSlPriceOrAmountType(value)
      }}
      value={valueKey}
    />
  )
})

// 交易页面非全屏模式止盈止损
function NonFullModeSpSl() {
  const { trade } = useStores()
  const { orderSpslChecked, setOrderSpslChecked, orderType } = trade
  const { cn, theme } = useTheme()
  const intl = useIntl()

  const {
    showSpScopeRedColor,
    showSlScopeRedColor,
    setInputing,
    d,
    step,
    sp_scope,
    sl_scope,
    rangeSymbol,
    isBuy,
    spValuePrice,
    slValuePrice,
    setSp,
    setSpAmount,
    setSl,
    setSlAmount,
    spValueEstimateRaw,
    slValueEstimateRaw,
    disabledInput: disabled,
    spPriceOrAmountType,
    slPriceOrAmountType
  } = useTrade()

  const spVal = useMemo(() => {
    return spPriceOrAmountType === 'PRICE' ? spValuePrice : spValueEstimateRaw
  }, [spPriceOrAmountType, spValuePrice, spValueEstimateRaw])
  const slVal = useMemo(() => {
    return slPriceOrAmountType === 'PRICE' ? slValuePrice : slValueEstimateRaw
  }, [slPriceOrAmountType, slValuePrice, slValueEstimateRaw])

  const onSpChange = useCallback(
    (val: any) => {
      spPriceOrAmountType === 'PRICE' ? setSp(val) : setSpAmount(val)
    },
    [spPriceOrAmountType, setSp, setSpAmount]
  )

  const onSlChange = useCallback(
    (val: any) => {
      slPriceOrAmountType === 'PRICE' ? setSl(val) : setSlAmount(val)
    },
    [slPriceOrAmountType, setSl, setSlAmount]
  )

  const renderSpsl = (value: any, key?: 'price') => {
    // 预估价格不要加上颜色和+
    const isPrice = key === 'price'
    return (
      <Text color={value && !isPrice ? (Number(value) > 0 ? 'green' : 'red') : 'weak'}>
        {Number(value) > 0 && !isPrice ? '+' : ''}
        {value || '--'} {isPrice ? '' : 'USD'}
      </Text>
    )
  }

  const renderCheckBox = useMemo(() => {
    return (
      <CheckBox
        onChange={(checked) => {
          setOrderSpslChecked(checked)
        }}
        checked={orderSpslChecked}
        label={intl.formatMessage({ id: 'pages.trade.Spsl' })}
        labelStyle={cn('font-medium')}
      />
    )
  }, [orderSpslChecked])

  const modalSpRef = useRef<PriceAmountModalRef>(null)
  const modalSlRef = useRef<PriceAmountModalRef>(null)

  const showPriceAmountModal = (key: 'SP' | 'SL') => {
    key === 'SP' ? modalSpRef.current?.show() : modalSlRef.current?.show()
  }

  return (
    <>
      {renderCheckBox}
      {orderSpslChecked && (
        <View className={cn('pt-3 w-full overflow-visible')}>
          <View>
            <View className={cn('flex-row items-end overflow-visible')}>
              <Text size="sm" weight="medium" color="primary" className={cn('pr-2')}>
                {intl.formatMessage({ id: 'pages.trade.Sp' })}
              </Text>
              <Text font="dingpro-regular" size="xs" color={showSpScopeRedColor ? 'red' : 'weak'}>
                {intl.formatMessage({ id: 'pages.trade.Range' })} {isBuy ? rangeSymbol[0] : rangeSymbol[1]} {formatNum(sp_scope)} USD
              </Text>
            </View>
            <View className={cn('items-center pt-2 flex-row justify-between gap-x-2')}>
              <View className={cn('flex-1')}>
                <InputNumber
                  // @ts-ignore @TODO 待替换
                  RightAccessory={() => (
                    <View onClick={() => showPriceAmountModal('SP')} style={{ paddingRight: 8 }} disabled={disabled}>
                      <View className={cn('flex-row items-center')}>
                        <Text size="sm" weight="medium" color={disabled ? 'weak' : 'primary'}>
                          {spPriceOrAmountType === 'PRICE'
                            ? intl.formatMessage({ id: 'pages.trade.Price' })
                            : intl.formatMessage({ id: 'pages.trade.Amount' })}
                        </Text>
                        <Iconfont
                          name="qiehuanzhanghu-xiala"
                          color={disabled ? theme.colors.textColor.weak : theme.colors.textColor.primary}
                          size={20}
                        />
                      </View>
                    </View>
                  )}
                  controls={false}
                  onFocus={() => {
                    console.log('onFocus')
                    setInputing(true)
                  }}
                  step={step}
                  placeholder={intl.formatMessage({ id: 'pages.trade.Sp' })}
                  disabled={disabled}
                  value={String(spVal || '')}
                  precision={d}
                  textAlign="left"
                  // status={spFlag ? 'error' : undefined}
                  // @ts-ignore @TODO 待替换
                  onEndEditing={(value: any) => {
                    console.log('onChange', value)
                    if (Number.isNaN(Number(value))) {
                      return
                    }

                    const val = Number(value) > 0 ? value : ''
                    onSpChange(val)
                  }}
                  containerStyle={[{ marginBottom: 6 }]}
                />
              </View>
            </View>
            <View className={cn('flex-row gap-x-1 pb-3')}>
              {spPriceOrAmountType === 'PRICE' ? (
                <>
                  <Text color="weak">{intl.formatMessage({ id: 'pages.trade.Estimated profit loss' })}</Text>
                  {renderSpsl(spValueEstimateRaw)}
                </>
              ) : (
                <>
                  <Text color="weak" font="dingpro-medium">
                    {intl.formatMessage({ id: 'pages.trade.Estimated price' })}
                  </Text>
                  {renderSpsl(spValuePrice, 'price')}
                </>
              )}
            </View>
          </View>
          <View>
            <View className={cn('flex-row items-end')}>
              <Text size="sm" weight="medium" color="primary" className={cn('pr-2')}>
                {intl.formatMessage({ id: 'pages.trade.Sl' })}
              </Text>
              <Text size="xs" font="dingpro-regular" color={showSlScopeRedColor ? 'red' : 'weak'}>
                {intl.formatMessage({ id: 'pages.trade.Range' })} {isBuy ? rangeSymbol[1] : rangeSymbol[0]} {formatNum(sl_scope)} USD
              </Text>
            </View>
            <View className={cn('items-center pt-2 flex-row justify-between gap-x-2')}>
              <View className={cn('flex-1')}>
                <InputNumber
                  // @ts-ignore @TODO 待替换
                  RightAccessory={() => (
                    <View onClick={() => showPriceAmountModal('SL')} style={{ paddingRight: 8 }} disabled={disabled}>
                      <View className={cn('flex-row items-center')}>
                        <Text size="sm" weight="medium" color={disabled ? 'weak' : 'primary'}>
                          {slPriceOrAmountType === 'PRICE'
                            ? intl.formatMessage({ id: 'pages.trade.Price' })
                            : intl.formatMessage({ id: 'pages.trade.Amount' })}
                        </Text>
                        <Iconfont
                          name="qiehuanzhanghu-xiala"
                          color={disabled ? theme.colors.textColor.weak : theme.colors.textColor.primary}
                          size={20}
                        />
                      </View>
                    </View>
                  )}
                  controls={false}
                  onFocus={() => {
                    setInputing(true)
                  }}
                  textAlign="left"
                  step={step}
                  placeholder={
                    slPriceOrAmountType === 'PRICE'
                      ? intl.formatMessage({ id: 'pages.trade.Sl' })
                      : intl.formatMessage({ id: 'pages.trade.Loss Amount' })
                  }
                  disabled={disabled}
                  value={String(slVal || '')}
                  precision={d}
                  // status={slFlag ? 'error' : undefined}
                  min={-999999999999}
                  // @ts-ignore @TODO 待替换
                  onChangeText={(value: any) => {
                    if (Number.isNaN(Number(value))) {
                      return
                    }

                    const val = Number(value) > 0 ? value : ''
                    onSlChange(val)
                  }}
                  containerStyle={[{ marginBottom: 6 }]}
                />
              </View>
            </View>
            <View className={cn('flex-row gap-x-1 pb-4')}>
              {slPriceOrAmountType === 'PRICE' ? (
                <>
                  <Text color="weak">{intl.formatMessage({ id: 'pages.trade.Estimated profit loss' })}</Text>
                  {renderSpsl(slValueEstimateRaw)}
                </>
              ) : (
                <>
                  <Text color="weak" font="dingpro-medium">
                    {intl.formatMessage({ id: 'pages.trade.Estimated price' })}
                  </Text>
                  {renderSpsl(slValuePrice, 'price')}
                </>
              )}
            </View>
          </View>
        </View>
      )}
      <RenderSpPriceAmountModal ref={modalSpRef} />
      <RenderSlPriceAmountModal ref={modalSlRef} />
    </>
  )
}

export default observer(NonFullModeSpSl)
