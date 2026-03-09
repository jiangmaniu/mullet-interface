import { Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect } from 'react'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/ui/components/accordion'
import { IconCodexLoader, Iconify, IconSolana, IconUSDC } from '@/libs/ui/components/icons'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'

export const SwapStep2 = ({
  onBack,
  fromToken,
  toToken,
  amount,
  onNext
}: {
  onBack: () => void
  fromToken: string
  toToken: string
  amount: string
  onNext: () => void
}) => {
  const [countdown, setCountdown] = useState(60)
  const [isWaitingSignature, setIsWaitingSignature] = useState(false)

  useEffect(() => {
    if (!isWaitingSignature) {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 0) return 60
          return c - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isWaitingSignature])

  const handleConfirm = () => {
    setIsWaitingSignature(true)
    // Simulate wallet signature
    setTimeout(() => {
      onNext()
    }, 2000)
  }

  const receiveAmount = (parseFloat(amount) * 1.02).toFixed(2)

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center justify-between w-full">
          <div className="flex items-center gap-medium">
            <IconButton
              variant="ghost"
              className="text-brand-secondary-2"
              size={'icon-sm'}
              onClick={onBack}
              disabled={isWaitingSignature}
            >
              <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
            </IconButton>
            <Trans>订单确认</Trans>
          </div>

          {!isWaitingSignature && <div className="text-paragraph-p2 text-status-warning !font-normal">{countdown}S</div>}
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl">
        {/* Main Display */}
        {isWaitingSignature ? (
          <div className="flex flex-col items-center justify-center py-2xl gap-large">
            <IconCodexLoader className="size-12 animate-spin" />
            <div className="flex flex-col items-center gap-medium text-center">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>等待钱包签名</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>请在您的钱包中确认交易</Trans>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-xl gap-medium">
            <div className="text-title-h2 text-white flex items-center gap-xs">
              <span className="text-content-1">$</span>
              {amount}
            </div>
          </div>
        )}

        {/* Transaction Info */}
        <div className="space-y-medium">
          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>您将发送</Trans>
            </span>
            <div className="flex items-center gap-medium">
              <IconSolana className="size-6" />
              <span className="text-white">
                {amount} {fromToken}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>您将收到</Trans>
            </span>
            <div className="flex items-center gap-medium">
              <IconUSDC className="size-6" />
              <span className="text-white">
                {receiveAmount} {toToken}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>兑换率</Trans>
            </span>
            <span className="text-white">1 SOL ≈ 102 USDC</span>
          </div>

          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>预计到账</Trans>
            </span>
            <span className="text-white">
              <Trans>不到1分钟</Trans>
            </span>
          </div>
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
                      <GeneralTooltip content={<Trans>网络费用</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>Gas 费</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">≈ 0.001 SOL</span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>价格影响</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>价格影响</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">0.05%</span>
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
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {!isWaitingSignature && (
          <div className="text-paragraph-p3 text-content-4">
            <Trans>点击确认订单，即表示您同意</Trans>
            <a href="#" className="underline text-white ml-1">
              <Trans>我们的条款</Trans>
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex gap-medium mt-auto">
          <Button block color="primary" size="lg" onClick={handleConfirm} disabled={isWaitingSignature}>
            {isWaitingSignature ? (
              <div className="flex items-center gap-xs text-content-1 text-button-2">
                <IconCodexLoader className="animate-spin size-4" />
                <Trans>等待签名</Trans>
              </div>
            ) : (
              <Trans>确定订单</Trans>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
