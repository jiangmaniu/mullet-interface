import { observer } from 'mobx-react'
import { MarginModeModal } from '../modal/margin-mode-modal'
import { Button } from '@/libs/ui/components/button'
import { t, Trans } from '@/libs/lingui/react/macro'
import { useStores } from '@/context/mobxProvider'
import { current } from 'tailwindcss/colors'
import { TRADE_MARGIN_MODE_MAP, TradeMarginMode } from '../../_options/trade'
import { renderFallback } from '@/libs/utils/format/fallback'
import { Iconify } from '@/libs/ui/components/icons'
import { FormatedLeverage, SettingLeverageModal } from '../modal/setting-leverage-modal'
import { BNumber } from '@/utils/b-number'

export const TradingLeverage = observer(() => {
  const { trade } = useStores()
  const currentSymbol = trade.activeSymbolInfo
  const marginType = trade.marginType

  const disabled = !trade.currentAccountInfo.enableIsolated || trade.disabledTradeAction()
  const prepaymentConf = currentSymbol?.symbolConf?.prepaymentConf
  const mode = prepaymentConf?.mode
  const isFixedMargin = mode === 'fixed_margin' // 固定预付款
  const isFixedLeverage = mode === 'fixed_leverage' // 固定杠杆
  const isFloatLeverage = mode === 'float_leverage' // 浮动杠杆

  const currentLeverage = trade.leverageMultiple || 1

  const minLever = Number(prepaymentConf?.float_leverage?.min_lever || 1)
  const maxLever = Number(prepaymentConf?.float_leverage?.max_lever || 30)

  return (
    <>
      {!isFloatLeverage ? (
        <div className="flex-1 py-xl px-1 flex items-center justify-center rounded-small bg-button text-content-1 text-button-2">
          {isFixedMargin ? (
            <Trans>固定预付款</Trans>
          ) : isFixedLeverage ? (
            <FormatedLeverage leverage={prepaymentConf?.fixed_leverage?.leverage_multiple} />
          ) : (
            '-'
          )}
        </div>
      ) : (
        <SettingLeverageModal
          defaultLeverage={trade.leverageMultiple || 1}
          maxLeverage={maxLever}
          minLeverage={minLever}
          onSettingLeverage={(leverage) => {
            trade.setLeverageMultiple(leverage)
          }}
          formatMaxPosition={(leverage) => {
            // 根据当前的杠杆倍数，获取对应的杠杆倍数区间(eg.1x - 10x)，对应的持仓名义价值
            const maxOpenLeverage =
              (prepaymentConf?.float_leverage?.lever_grade || []).find(
                (grade) => BNumber.from(leverage).gte(grade.lever_start_value) && BNumber.from(currentLeverage).lte(grade.lever_end_value)
              )?.bag_nominal_value || 0
            const maxPosition = BNumber.toFormatNumber(maxOpenLeverage, {
              unit: prepaymentConf?.float_leverage?.type === 'volume' ? t`手` : trade.currentAccountInfo.currencyUnit,
              volScale: trade.currentAccountInfo.currencyDecimal
            })
            return maxPosition
          }}
        >
          <Button className="flex-1 h-full" block variant={'primary'} size={'lg'} color="default">
            <FormatedLeverage leverage={currentLeverage} />
          </Button>
        </SettingLeverageModal>
      )}
    </>
  )
})
