import { GeneralTooltip } from '@/components/tooltip/general'
import { useStores } from '@/context/mobxProvider'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'
import useMargin from '@/hooks/useMargin'
import useMaxOpenVolume from '@/hooks/useMaxOpenVolume'
import useTrade from '@/hooks/useTrade'
import { Trans } from '@/libs/lingui/react/macro'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { BNumber } from '@/libs/utils/number/b-number'
import { observer } from 'mobx-react'
import { LOTS_UNIT_LABEL } from '../../_options/trade'

export const TradeActionPanelOrderOverview = observer(() => {
  const { availableMargin } = useTrade()
  const margin = useMargin()
  const maxOpenVolume = useMaxOpenVolume()
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const lotVolScale = parseSymbolLotsVolScale(trade.activeSymbolInfo.symbolConf)

  const list = [
    {
      label: (
        <GeneralTooltip content={<Trans>可用于开创建仓位的资金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>可用</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: (
        <>
          {BNumber.toFormatNumber(availableMargin, { unit: currentAccountInfo.currencyUnit, volScale: currentAccountInfo.currencyDecimal })}
        </>
      )
    },
    {
      label: (
        <GeneralTooltip content={<Trans>预估保证金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>预估保证金</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(margin, { unit: currentAccountInfo.currencyUnit, volScale: currentAccountInfo.currencyDecimal })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>可开仓的手数</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>可开</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(maxOpenVolume, { volScale: lotVolScale, unit: LOTS_UNIT_LABEL })}</>
    }
  ]

  return (
    <div className="flex flex-col gap-3">
      {list.map((item, i) => {
        return (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="text-content-4">{item.label}</div>
            <div className="text-content-1 text-paragraph-p3">{item.value}</div>
          </div>
        )
      })}
    </div>
  )
})
