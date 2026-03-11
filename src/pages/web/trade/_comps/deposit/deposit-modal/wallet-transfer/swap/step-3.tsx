import { Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect } from 'react'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/ui/components/accordion'
import { IconChevronRight, Iconify, IconMmullet, IconSuccess, IconUSDC } from '@/libs/ui/components/icons'
import { IconMetamask } from '@/libs/ui/components/icons/set/metamask'
import { IconFail } from '@/libs/ui/components/icons/set/fail'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'

export const SwapStep3 = ({
  onBack,
  onClose,
  fromToken,
  toToken,
  amount,
  onRetry
}: {
  onBack: () => void
  onClose: () => void
  fromToken: string
  toToken: string
  amount: string
  onRetry: () => void
}) => {
  const [status, setStatus] = useState<'success' | 'failure'>('success')

  const receiveAmount = (parseFloat(amount) * 1.02).toFixed(2)

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center justify-between w-full">
          <div className="flex items-center gap-medium">
            <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
              <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
            </IconButton>
            <Trans>订单确认</Trans>
          </div>
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl">
        {/* Status Display */}
        <div className="flex flex-col items-center justify-center py-xl gap-large">
          {status === 'success' ? (
            <>
              <IconSuccess width={50} height={50} />
              <div className="text-paragraph-p2 text-white">
                <Trans>签名成功</Trans>
              </div>
            </>
          ) : (
            <>
              <IconFail width={50} height={50} />
              <div className="text-paragraph-p2 text-white">
                <Trans>签名失败</Trans>
              </div>
            </>
          )}
        </div>

        {/* Info Grid */}
        <div className="space-y-medium">
          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>来源</Trans>
            </span>
            <a href="">
              <div className="flex items-center gap-medium">
                <IconMetamask />
                <span className="text-white">MetaMask (0x862D...B22A)</span>
                <IconChevronRight className="text-brand-secondary-3" />
              </div>
            </a>
          </div>

          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>目标地址</Trans>
            </span>
            <a href="">
              <div className="flex items-center gap-medium">
                <IconMmullet />
                <span className="text-white">
                  <Trans>Mullet 账户</Trans>
                </span>
                <IconChevronRight className="text-brand-secondary-3" />
              </div>
            </a>
          </div>

          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>状态</Trans>
            </span>
            <span className={status === 'success' ? 'text-market-rise' : 'text-market-fall'}>
              {status === 'success' ? <Trans>成功</Trans> : <Trans>失败</Trans>}
            </span>
          </div>

          {status === 'success' && (
            <div className="flex items-center justify-between text-paragraph-p2">
              <span className="text-content-4">
                <Trans>总用时</Trans>
              </span>
              <span className="text-white">
                8<Trans>秒</Trans>
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>您收到</Trans>
            </span>
            <div className="flex items-center gap-medium">
              <IconUSDC className="size-6" />
              <span className="text-white">
                {receiveAmount} {toToken}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Details Accordion */}
        <div className="bg-surface-elevation-2 rounded-small overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger>
                <span className="text-content-4">
                  <Trans>交易明细</Trans>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-large">
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip
                        content={
                          <ul className="p-0 m-0">
                            <li>
                              <Trans>总成本：0.03 美元</Trans>
                            </li>
                            <li>
                              <Trans>源链 gas 费：0.01 美元</Trans>
                            </li>
                            <li>
                              <Trans>目标链 gas 费：0.02 美元</Trans>
                            </li>
                          </ul>
                        }
                      >
                        <TooltipTriggerDottedText>
                          <Trans>网络费用</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">0.001 SOL</span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip
                        content={
                          <ul className="p-0 m-0">
                            <li>
                              <Trans>总影响：0.05%</Trans>
                            </li>
                            <li>
                              <Trans>兑换影响：0.05%</Trans>
                            </li>
                            <li>
                              <Trans>瞬时流动性成本：0.00%</Trans>
                            </li>
                          </ul>
                        }
                      >
                        <TooltipTriggerDottedText>
                          <Trans>价格影响</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">0.05%</span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip
                        content={
                          <ul className="p-0 m-0">
                            <li>
                              <Trans>滑点是因交易执行过程中价格波动而产生的</Trans>
                            </li>
                            <li>
                              <Trans>最低到账金额：1.84 美元</Trans>
                            </li>
                          </ul>
                        }
                      >
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

        <div className="text-paragraph-p3 text-content-4">
          <Trans>遇到问题？</Trans>
          <a href="#" className="underline text-white ml-1">
            <Trans>获取帮助</Trans>
          </a>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-medium">
          {status === 'success' ? (
            <>
              <Button className="flex-1" variant="secondary" size="lg" onClick={onClose}>
                <Trans>关闭</Trans>
              </Button>
              <Button className="flex-1" color="primary" size="lg" onClick={onRetry}>
                <Trans>继续入金</Trans>
              </Button>
            </>
          ) : (
            <Button block color="primary" size="lg" onClick={onRetry}>
              <Trans>重新入金</Trans>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
