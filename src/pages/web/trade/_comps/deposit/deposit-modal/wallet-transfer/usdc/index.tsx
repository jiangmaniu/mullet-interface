import { useState } from 'react'
import { observer } from 'mobx-react'
import { UsdcStep1 } from './step-1'
import { UsdcStep2 } from './step-2'
import { UsdcStep3Success } from './step-3-success'
import { UsdcStep3Fail } from './step-3-fail'

type Step = 'step-1' | 'step-2' | 'step-3-success' | 'step-3-fail'

export const WalletAssets = observer(
  ({ onBack, onBackToMenu, onClose }: { onBack: () => void; onBackToMenu?: () => void; onClose: () => void }) => {
    const [step, setStep] = useState<Step>('step-1')

    const handleStepBack = () => {
      if (step === 'step-1') {
        onBack()
      } else if (step === 'step-2') {
        setStep('step-1')
      } else if (step === 'step-3-success' || step === 'step-3-fail') {
        setStep('step-2')
      }
    }

    const handleConfirmSuccess = () => {
      // 如果有 onBackToMenu,直接返回到 deposit-modal 菜单
      // 否则使用 onBack 返回上一级
      if (onBackToMenu) {
        onBackToMenu()
      } else {
        onBack()
      }
    }

  const handleRetry = () => {
    setStep('step-2')
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

      {step === 'step-3-success' && <UsdcStep3Success onBack={handleStepBack} onClose={onClose} onConfirm={handleConfirmSuccess} />}
      {step === 'step-3-fail' && <UsdcStep3Fail onBack={handleStepBack} onClose={onClose} onRetry={handleRetry} />}
    </>
  )
})
