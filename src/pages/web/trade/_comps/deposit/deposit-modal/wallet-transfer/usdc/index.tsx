import { useState } from 'react'
import { Trans } from '@/libs/lingui/react/macro'
import { observer } from 'mobx-react'
import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalCloseButton, ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { Iconify, IconSuccess, IconFail, IconUSDC } from '@/libs/ui/components/icons'
import { BNumber } from '@/libs/utils/number'
import { useDepositState } from '../../_hooks/use-deposit-state'
import { useSelectedTokenConfig } from '../_hooks/use-selected-balance-info'
import { UsdcStep1 } from './step-1'
import { UsdcStep2 } from './step-2'

type Step = 'step-1' | 'step-2' | 'step-3-success' | 'step-3-fail'

export const WalletAssets = observer(({ onBack, onClose }: { onBack: () => void; onClose: () => void }) => {
  const [step, setStep] = useState<Step>('step-1')
  const { toWalletAddress, depositAmount } = useDepositState()
  const selectedTokenConfig = useSelectedTokenConfig()

  const formattedAmount = BNumber.toFormatNumber(depositAmount, {
    volScale: selectedTokenConfig?.displayDecimals,
    unit: selectedTokenConfig?.symbol
  })

  const handleStepBack = () => {
    if (step === 'step-1') {
      onBack()
    } else if (step === 'step-2') {
      setStep('step-1')
    } else if (step === 'step-3-success' || step === 'step-3-fail') {
      setStep('step-2')
    }
  }

  return (
    <>
      {step === 'step-1' && <UsdcStep1 onBack={handleStepBack} onClose={onClose} onNext={() => setStep('step-2')} />}
      {step === 'step-2' && (
        <UsdcStep2
          onBack={handleStepBack}
          onClose={onClose}
          onSuccess={() => setStep('step-3-success')}
          onFail={() => setStep('step-3-fail')}
        />
      )}

      {step === 'step-3-success' && (
        <>
          <ModalHeader className="w-full gap-2xl">
            <ModalTitle className="flex items-center justify-between w-full" showCloseButton={false}>
              <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={handleStepBack}>
                <Iconify icon="iconoir:nav-arrow-left" className="size-6" />
              </IconButton>
              <Trans>订单确认</Trans>
              <ModalCloseButton iconClassName="size-6" onClick={onClose} />
            </ModalTitle>
          </ModalHeader>

          <div className="flex flex-col gap-2xl flex-1">
            <div className="flex flex-col items-center justify-center py-xl gap-large">
              <IconSuccess width={50} height={50} />
              <div className="text-paragraph-p2 text-white">
                <Trans>签名成功，等待链上确认交易</Trans>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-paragraph-p2">
                <span className="text-content-4">
                  <Trans>您发送</Trans>
                </span>
                <div className="flex items-center gap-medium">
                  {selectedTokenConfig?.iconUrl ? (
                    <img src={selectedTokenConfig.iconUrl} className="size-6 rounded-full object-contain" alt={selectedTokenConfig.symbol} />
                  ) : (
                    <IconUSDC className="size-6" />
                  )}
                  <span className="text-content-1">{formattedAmount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-paragraph-p2">
                <span className="text-content-4">
                  <Trans>您收到</Trans>
                </span>
                <div className="flex items-center gap-medium">
                  {selectedTokenConfig?.iconUrl ? (
                    <img src={selectedTokenConfig.iconUrl} className="size-6 rounded-full object-contain" alt={selectedTokenConfig.symbol} />
                  ) : (
                    <IconUSDC className="size-6" />
                  )}
                  <span className="text-content-1">{formattedAmount}</span>
                </div>
              </div>
            </div>

            <div className="text-paragraph-p3 text-content-5">
              <Trans>此次签名仅作为当前交易请求，签名完成交易后此次签名失效</Trans>
              <br />
              <Trans>请您仔细核对签名信息</Trans>
            </div>

            <div className="flex gap-2xl">
              <Button className="flex-1" variant="secondary" size="lg" onClick={onClose}>
                <Trans>关闭</Trans>
              </Button>
              <Button className="flex-1" color="primary" size="lg" onClick={() => setStep('step-1')}>
                <Trans>继续入金</Trans>
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 'step-3-fail' && (
        <>
          <ModalHeader className="w-full gap-2xl">
            <ModalTitle className="flex items-center justify-between w-full" showCloseButton={false}>
              <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={handleStepBack}>
                <Iconify icon="iconoir:nav-arrow-left" className="size-6" />
              </IconButton>
              <Trans>订单确认</Trans>
              <ModalCloseButton iconClassName="size-6" onClick={onClose} />
            </ModalTitle>
          </ModalHeader>

          <div className="flex flex-col gap-2xl flex-1">
            <div className="flex flex-col items-center justify-center py-xl gap-large">
              <IconFail width={50} height={50} />
              <div className="text-paragraph-p2 text-white">
                <Trans>钱包连接失败</Trans>
              </div>
              <div className="text-paragraph-p3 text-status-warning">
                <Trans>手动取消/其它未知错误导致钱包签名失败</Trans>
              </div>
            </div>

            <Button block color="primary" size="lg" onClick={() => setStep('step-2')}>
              <Trans>重新连接</Trans>
            </Button>
          </div>
        </>
      )}
    </>
  )
})
