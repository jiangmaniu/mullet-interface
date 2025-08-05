import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { useCurrentQuote } from '@/hooks/useCurrentQuote'

import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'
import LevelAgeModal, { LevelAgeModalRef } from './LevelAgeModal'
import MarginTypeModal, { MarginTypeModalRef } from './MarginTypeModal'

type IProps = {
  /**没有深度盘口视图 */
  noDepth?: boolean
}

/** 保证金类型、杠杆选择按钮 */
function MarginTypeAndLeverageBtn({ noDepth }: IProps, ref: any) {
  const intl = useIntl()
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const quoteInfo = useCurrentQuote(trade.activeSymbolName)
  const enableIsolated = trade.currentAccountInfo.enableIsolated
  const prepaymentConf = quoteInfo?.prepaymentConf
  const mode = prepaymentConf?.mode
  const isFixedMargin = mode === 'fixed_margin' // 固定预付款
  const isFixedLeverage = mode === 'fixed_leverage' // 固定杠杆
  const isFloatLeverage = mode === 'float_leverage' // 浮动杠杆

  const marginTypeModalRef = useRef<MarginTypeModalRef>(null)
  const levelAgeModalRef = useRef<LevelAgeModalRef>(null)

  const disabledBtn = trade.disabledTradeAction()

  let leverage: any
  if (isFixedMargin) {
    // 固定预付款
    leverage = intl.formatMessage({ id: 'pages.trade.Fixed Margin Abbr' })
  } else if (isFixedLeverage) {
    leverage = `${prepaymentConf?.fixed_leverage?.leverage_multiple}X`
  } else if (isFloatLeverage) {
    leverage = `${trade.leverageMultiple || 1}X`
  }

  const marginTypeLabel =
    trade.marginType === 'CROSS_MARGIN'
      ? intl.formatMessage({ id: 'common.enum.MarginType.CROSS_MARGIN' })
      : intl.formatMessage({ id: 'common.enum.MarginType.ISOLATED_MARGIN' })

  const disableMarginBtn = isFixedMargin || isFixedLeverage || disabledBtn

  const renderView = () => {
    // 交易页面-没有盘口的视图
    if (noDepth) {
      return (
        <View className={cn('flex-row gap-x-2 px-3 border-b border-gray-50 mb-2 pb-3 w-full')}>
          <View
            onClick={() => {
              if (!enableIsolated || disabledBtn) return
              // bottomSheetModalRef.current?.sheet?.dismiss()
              marginTypeModalRef.current?.show()
            }}
            disabled={disabledBtn}
          >
            <View
              borderColor="weak"
              className={cn('flex-row py-1 px-2 items-center justify-center border-[0.5px] border-gray-130 rounded-[6px]')}
            >
              <Text color="primary" size="sm" weight="medium" className={cn('pr-1 px-5')}>
                {marginTypeLabel}
              </Text>
              {enableIsolated && !disabledBtn && (
                <Iconfont name="quancangxiala" style={{ transform: 'rotate(90deg)' }} size={16} color={theme.isDark ? '#fff' : '#CFCFCF'} />
              )}
            </View>
          </View>
          <View
            onClick={() => {
              levelAgeModalRef.current?.show()
            }}
            disabled={disableMarginBtn}
          >
            <View
              className={cn(
                'flex-row py-1 px-2 items-center justify-center border-[0.5px] border-gray-130 rounded-[6px]',
                !isFloatLeverage && 'bg-gray-130 border-[transparent]'
              )}
            >
              <Text color="primary" size="sm" weight="medium" className={cn('pr-1 px-5')}>
                {leverage}
              </Text>
              {isFloatLeverage && (
                <Iconfont name="quancangxiala" style={{ transform: 'rotate(90deg)' }} size={16} color={theme.isDark ? '#fff' : '#CFCFCF'} />
              )}
            </View>
          </View>
        </View>
      )
    }
    return (
      <View className={cn('flex-row gap-x-1 px-3')}>
        <View
          onClick={() => {
            if (!enableIsolated || disabledBtn) return
            // bottomSheetModalRef.current?.sheet?.dismiss()
            marginTypeModalRef.current?.show()
          }}
          disabled={disabledBtn}
        >
          <View className={cn('flex-row py-1 px-2 items-center justify-center bg-gray-50 rounded')}>
            <Text color="primary" size="sm" weight="medium" className={cn('pr-1')}>
              {marginTypeLabel}
            </Text>
            {enableIsolated && !disabledBtn && <Iconfont name="quancangxiala" size={16} color={theme.isDark ? '#fff' : '#CFCFCF'} />}
          </View>
        </View>
        <View
          onClick={() => {
            levelAgeModalRef.current?.show()
          }}
          disabled={disableMarginBtn}
        >
          <View className={cn('rounded flex-row py-1 px-2 items-center justify-center', isFloatLeverage ? 'bg-gray-50' : 'bg-gray-80')}>
            <Text color="primary" size="sm" weight="medium" className={cn('pr-1')}>
              {leverage}
            </Text>
            {isFloatLeverage && <Iconfont name="quancangxiala" size={16} color={theme.isDark ? '#fff' : '#CFCFCF'} />}
          </View>
        </View>
      </View>
    )
  }

  return (
    <>
      {renderView()}
      <MarginTypeModal ref={marginTypeModalRef} />
      <LevelAgeModal ref={levelAgeModalRef} />
    </>
  )
}

export default observer(forwardRef(MarginTypeAndLeverageBtn))
