import { Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect } from 'react'
import { Loader2, Check, X } from 'lucide-react'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/ui/components/accordion'
import { cn } from '@/libs/ui/lib/utils'
import { IconChevronRight, IconCodexLoader, Iconify, IconMmullet, IconSuccess, IconUSDC } from '@/libs/ui/components/icons'
import { IconMetamask } from '@/libs/ui/components/icons/set/metamask'
import { IconFail } from '@/libs/ui/components/icons/set/fail'
import { IconMtlp } from '@/libs/ui/components/icons/set/mtlp'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'

export const WalletAssetsStep3 = ({
  onBack,
  onClose,
  amount,
  selectedAsset,
  onRetry
}: {
  onBack: () => void
  onClose: () => void
  amount: string
  selectedAsset: { symbol: string; chainName: string } | null
  onRetry: () => void
}) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failure'>('idle')
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (status === 'idle') {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 0) return 30
          return c - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [status])

  const handleConfirm = () => {
    setStatus('processing')
    setTimeout(() => {
      setStatus('success')
    }, 3000)
  }

  const isFinalState = status === 'success' || status === 'failure'

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center justify-between w-full">
          {!isFinalState ? (
            <div className="flex items-center gap-medium">
              <IconButton
                variant="ghost"
                className="text-brand-secondary-2"
                size={'icon-sm'}
                onClick={onBack}
                disabled={status === 'processing'}
              >
                <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
              </IconButton>
              <Trans>订单确认</Trans>
            </div>
          ) : (
            <div className="flex items-center gap-medium">
              <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
                <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
              </IconButton>
              <Trans>订单确认</Trans>
            </div>
          )}

          {status === 'idle' && <div className="text-paragraph-p2 text-status-warning !font-normal">{countdown}S</div>}
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl">
        {/* Main Status Display */}
        <div className="flex flex-col items-center justify-center py-xl gap-medium">
          {status === 'idle' || status === 'processing' ? (
            <div className="text-title-h2 text-white flex items-center gap-xs">
              <span className="text-content-1">$</span>
              {amount || '75,000.00'}
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center gap-large fade-in">
              <IconSuccess width={50} height={50} />
              <div className="text-paragraph-p2 text-white">
                <Trans>您的资金已成功存入</Trans>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-large fade-in">
              <IconFail width={50} height={50} />
              <div className="text-paragraph-p2 text-white">
                <Trans>您的资金存入失败</Trans>
              </div>
            </div>
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

          {isFinalState ? (
            <div className="flex items-center justify-between text-paragraph-p2">
              <span className="text-content-4">
                <Trans>状态</Trans>
              </span>
              <span className={status === 'success' ? 'text-market-rise' : 'text-market-fall'}>
                {status === 'success' ? <Trans>成功</Trans> : <Trans>失败</Trans>}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-paragraph-p2">
              <span className="text-content-4">
                <Trans>预计时间</Trans>
              </span>
              <span className="text-white">
                &lt; 1<Trans>分钟</Trans>
              </span>
            </div>
          )}

          {isFinalState && (
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
              {status === 'success' || status === 'processing' || status === 'failure' ? <Trans>您收到</Trans> : <Trans>您将发送</Trans>}
            </span>
            <div className="flex items-center gap-medium">
              <IconUSDC className="size-6" />
              <span className="text-white">{amount} USDC</span>
            </div>
          </div>

          {!isFinalState && (
            <div className="flex items-center justify-between text-paragraph-p2">
              <span className="text-content-4">
                <Trans>您将收到</Trans>
              </span>
              <div className="flex items-center gap-medium">
                <IconUSDC className="size-6" />
                <span className="text-white">{amount} USDC</span>
              </div>
            </div>
          )}
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
                    <span className="text-white">0.00 USDC</span>
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
                    <span className="text-white">0.00%</span>
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
                      <Trans>自动</Trans> 0.00%
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {!isFinalState && (
          <div className="text-paragraph-p3 text-content-4">
            <Trans>点击确认订单，即表示您同意</Trans>
            <a href="#" className="underline text-white ml-1">
              <Trans>我们的条款</Trans>
            </a>
          </div>
        )}

        {isFinalState && (
          <div className="text-paragraph-p3 text-content-4">
            <Trans>遇到问题？</Trans>
            <a href="#" className="underline text-white ml-1">
              <Trans>获取帮助</Trans>
            </a>
          </div>
        )}

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
          ) : status === 'failure' ? (
            <Button block color="primary" size="lg" onClick={onRetry}>
              <Trans>重新入金</Trans>
            </Button>
          ) : (
            <Button block color="primary" size="lg" onClick={handleConfirm} disabled={status === 'processing'}>
              {status === 'processing' ? (
                <div className="flex items-center gap-xs text-content-1 text-button-2">
                  <IconCodexLoader className="animate-spin size-4" />
                  <Trans>资产兑换中</Trans>
                </div>
              ) : (
                <Trans>确定订单</Trans>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
