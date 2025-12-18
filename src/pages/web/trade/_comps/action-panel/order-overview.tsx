import { GeneralTooltip } from '@/components/tooltip/general'
import useMargin from '@/hooks/useMargin'
import useMaxOpenVolume from '@/hooks/useMaxOpenVolume'
import useTrade from '@/hooks/useTrade'
import { Trans } from '@/libs/lingui/react/macro'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { BNumber } from '@/libs/utils/number/b-number'
import { observer } from 'mobx-react'

export const TradeActionPanelOrderOverview = observer(() => {
  const { availableMargin } = useTrade()
  const margin = useMargin()
  const maxOpenVolume = useMaxOpenVolume()

  const list = [
    {
      label: (
        <GeneralTooltip content={<Trans>可用于开创建仓位的资金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>可用</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(availableMargin, { unit: 'USDC', volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>预估保证金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>预估保证金</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(margin, { unit: 'USDC', volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>可开仓的手数</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>可开</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(maxOpenVolume, { volScale: 2, unit: '手' })}</>
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
