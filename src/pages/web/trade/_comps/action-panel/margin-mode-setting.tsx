import { observer } from 'mobx-react'
import { MarginModeModal } from '../modal/margin-mode-modal'
import { Button } from '@/libs/ui/components/button'
import { Trans } from '@/libs/lingui/react/macro'
import { useStores } from '@/context/mobxProvider'
import { current } from 'tailwindcss/colors'
import { TRADE_MARGIN_MODE_MAP, TradeMarginMode } from '../../_options/trade'
import { renderFallback } from '@/libs/utils/format/fallback'
import { Iconify } from '@/libs/ui/components/icons'

export const MarginModeSetting = observer(() => {
  const { trade } = useStores()

  const marginType = trade.marginType

  const disabled = !trade.currentAccountInfo.enableIsolated || trade.disabledTradeAction()

  return (
    <>
      {disabled ? (
        <div className="flex-1 py-xl px-1 flex items-center justify-center rounded-small bg-button text-content-1 text-button-2">
          {renderFallback(TRADE_MARGIN_MODE_MAP[marginType]?.label)}
        </div>
      ) : (
        <MarginModeModal
          defaultMode={marginType as TradeMarginMode}
          onSettingMarginMode={(mode) => {
            trade.setMarginType(mode)
          }}
        >
          <Button
            className="flex-1 h-full"
            block
            variant={'primary'}
            disabled={disabled}
            size={'lg'}
            // RightIcon={!disabled && <Iconify icon="iconoir:nav-arrow-right" />}
            color="default"
          >
            {renderFallback(TRADE_MARGIN_MODE_MAP[marginType]?.label)}
          </Button>
        </MarginModeModal>
      )}
    </>
  )
})
