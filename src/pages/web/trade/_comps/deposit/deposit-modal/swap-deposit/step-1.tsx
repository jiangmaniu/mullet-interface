import { Trans } from '@/libs/lingui/react/macro'
import { useState } from 'react'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle, ModalFooter } from '@/libs/ui/components/modal'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { cn } from '@/libs/ui/lib/utils'
import { Iconify, IconSolana, IconUSDC } from '@/libs/ui/components/icons'
import { NumberInputPrimitive } from '@/libs/ui/components/number-input-primitive'
import { BNumber } from '@/libs/utils/number'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/ui/components/accordion'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'

export const SwapStep1 = ({
  onBack,
  fromToken,
  toToken,
  amount,
  onFromTokenChange,
  onToTokenChange,
  onAmountChange,
  onNext
}: {
  onBack: () => void
  fromToken: string
  toToken: string
  amount: string
  onFromTokenChange: (token: string) => void
  onToTokenChange: (token: string) => void
  onAmountChange: (val: string) => void
  onNext: () => void
}) => {
  const [percent, setPercent] = useState<number | null>(null)

  // Mock balance
  const walletBalance = '153,568.00'
  const solBalance = '1,234.56'

  const handlePercentSelect = (p: number) => {
    setPercent(p)
    // Mock calculation
    const total = 1234.56
    if (p === 100) {
      onAmountChange(total.toFixed(2))
    } else {
      onAmountChange(((total * p) / 100).toFixed(2))
    }
  }

  const handleSwapTokens = () => {
    const temp = fromToken
    onFromTokenChange(toToken)
    onToTokenChange(temp)
  }

  const isEmpty = amount === '' || parseFloat(amount) === 0
  const receiveAmount = isEmpty ? '0.00' : (parseFloat(amount) * 1.02).toFixed(2) // Mock exchange rate

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center w-full gap-medium">
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
          </IconButton>
          <div className="flex flex-col gap-xs">
            <Trans>兑换转入</Trans>
            <div className="text-paragraph-p3 text-content-4 !font-normal">
              <Trans>钱包余额：${walletBalance}</Trans>
            </div>
          </div>
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl">
        {/* From Token Section */}
        <div className="flex flex-col gap-medium p-xl rounded-small border border-default">
          <div className="flex items-center justify-between">
            <span className="text-paragraph-p3 text-content-4">
              <Trans>您将发送</Trans>
            </span>
            <span className="text-paragraph-p3 text-content-4">
              <Trans>余额：{solBalance} SOL</Trans>
            </span>
          </div>

          <div className="flex items-center justify-between gap-medium">
            <div className="flex items-center gap-medium">
              <IconSolana className="size-6" />
              <span className="text-paragraph-p1 text-content-1">{fromToken}</span>
            </div>

            <div className="flex-1 text-right">
              <NumberInputPrimitive
                value={amount}
                onValueChange={(val: any) => {
                  onAmountChange(val.value)
                  setPercent(null)
                }}
                placeholder="0.00"
                thousandSeparator
                decimalScale={2}
                className={cn('text-right text-paragraph-p1 w-full', isEmpty ? 'text-content-4' : 'text-white')}
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex items-center gap-medium">
            <Tabs value={percent?.toString() || ''} onValueChange={(val) => handlePercentSelect(Number(val))} variant="solid" size="sm">
              <TabsList className="w-full items-center justify-center gap-medium">
                {[25, 50, 75, 100].map((p) => (
                  <TabsTrigger key={p} value={p.toString()} className="[&>div]:px-medium [&>div]:py-xs">
                    {p === 100 ? 'Max' : `${p}%`}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-xl">
          <IconButton variant="ghost" size="icon-sm" onClick={handleSwapTokens} className="bg-surface-elevation-2 rounded-full">
            <Iconify icon="iconoir:refresh-double" className="size-5" />
          </IconButton>
        </div>

        {/* To Token Section */}
        <div className="flex flex-col gap-medium p-xl rounded-small border border-default">
          <div className="flex items-center justify-between">
            <span className="text-paragraph-p3 text-content-4">
              <Trans>您将收到</Trans>
            </span>
          </div>

          <div className="flex items-center justify-between gap-medium">
            <div className="flex items-center gap-medium">
              <IconUSDC className="size-6" />
              <span className="text-paragraph-p1 text-content-1">{toToken}</span>
            </div>

            <div className="text-paragraph-p1 text-white">{receiveAmount}</div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-medium">
          {[200, 500, 1000, 2000].map((val) => (
            <Button
              key={val}
              variant="secondary"
              size="sm"
              onClick={() => {
                onAmountChange(val.toString())
                setPercent(null)
              }}
            >
              ${val}
            </Button>
          ))}
        </div>

        {/* Transaction Details */}
        <div className="bg-surface-elevation-2 rounded-small overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="py-medium px-large hover:no-underline">
                <span className="text-paragraph-p3 text-content-4">
                  <Trans>交易明细</Trans>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-large pb-medium">
                <div className="space-y-medium">
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>兑换率</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>兑换率</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">1 SOL ≈ 102 USDC</span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>预估滑点</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>预估滑点</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">
                      <Trans>自动</Trans> 0.5%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>网络费用</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>网络费用</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">≈ 0.001 SOL</span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>预计到账时间</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>预计到账</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">
                      <Trans>不到1分钟</Trans>
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <ModalFooter className="p-0 mt-auto">
          <Button block color="primary" size="lg" disabled={!amount || parseFloat(amount) <= 0} onClick={onNext}>
            <Trans>确定</Trans>
          </Button>
        </ModalFooter>
      </div>
    </>
  )
}
