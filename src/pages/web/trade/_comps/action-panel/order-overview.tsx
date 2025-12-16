import { GeneralTooltip } from '@/components/tooltip/general'
import { Trans } from '@/libs/lingui/react/macro'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { BNumber } from '@/libs/utils/number/b-number'
import { observer } from 'mobx-react'

export const TradeActionPanelOrderOverview = observer(() => {
  const list = [
    {
      label: (
        <GeneralTooltip content={<Trans>合约价值</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>合约价值</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(undefined, { unit: 'USDC', volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>平均价差</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>平均价差</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(undefined)}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>强平价格</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>强平价格</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(undefined, { volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>基础保证金</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>基础保证金</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatNumber(undefined, { volScale: 2 })}</>
    },
    {
      label: (
        <GeneralTooltip content={<Trans>费用</Trans>}>
          <TooltipTriggerDottedText>
            <Trans>费用</Trans>
          </TooltipTriggerDottedText>
        </GeneralTooltip>
      ),
      value: <>{BNumber.toFormatPercent(undefined)}</>
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
