import { useIntl } from '@umijs/max'
import { observer } from 'mobx-react'
import { forwardRef, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getCurrentQuote } from '@/utils/wsUtil'

import { Text } from '../../../Base/Text'
import { View } from '../../../Base/View'
import LevelAgeModal, { LevelAgeModalRef } from './LevelAgeModal'
import MarginTypeModal, { MarginTypeModalRef } from './MarginTypeModal'

/** 保证金类型、杠杆选择按钮 */
function MarginTypeAndLeverageBtn() {
  const intl = useIntl()
  const { cn, theme } = useTheme()
  const { trade } = useStores()
  const quoteInfo = getCurrentQuote()
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
    leverage = `${trade.leverageMultiple || 2}X`
  }

  return (
    <>
      <View className={cn('flex-row gap-x-1')}>
        <View
          onClick={() => {
            // bottomSheetModalRef.current?.sheet?.dismiss()
            marginTypeModalRef.current?.show()
          }}
          disabled={disabledBtn}
        >
          <View className={cn('rounded flex-row bg-gray-50 py-1 px-2 items-center justify-center')}>
            <Text color="primary" size="sm" weight="medium" className={cn('pr-1')}>
              {trade.marginType === 'CROSS_MARGIN'
                ? intl.formatMessage({ id: 'common.enum.MarginType.CROSS_MARGIN' })
                : intl.formatMessage({ id: 'common.enum.MarginType.ISOLATED_MARGIN' })}
            </Text>
            <Iconfont name="quancangxiala" size={16} color={theme.isDark ? '#fff' : '#CFCFCF'} />
          </View>
        </View>
        <View
          onClick={() => {
            levelAgeModalRef.current?.show()
          }}
          disabled={isFixedMargin || isFixedLeverage || disabledBtn}
        >
          <View className={cn('rounded flex-row py-1 px-2 items-center justify-center', isFloatLeverage ? 'bg-gray-50' : 'bg-gray-80')}>
            <Text color="primary" size="sm" weight="medium" className={cn('pr-1')}>
              {leverage}
            </Text>
            {isFloatLeverage && <Iconfont name="quancangxiala" size={16} color={theme.isDark ? '#fff' : '#CFCFCF'} />}
          </View>
        </View>
      </View>
      <MarginTypeModal ref={marginTypeModalRef} />
      <LevelAgeModal ref={levelAgeModalRef} />
    </>
  )
}

export default observer(forwardRef(MarginTypeAndLeverageBtn))
