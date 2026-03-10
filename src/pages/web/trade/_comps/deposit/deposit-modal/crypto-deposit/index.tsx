import { useState } from 'react'
import { observer } from 'mobx-react'
import { CryptoStep1 } from './step-1'
import { CryptoStep2 } from './step-2'

type Step = 'step-1' | 'step-2'

export const CryptoDeposit = observer(({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<Step>('step-1')

  const handleStepBack = () => {
    if (step === 'step-1') {
      onBack()
    } else if (step === 'step-2') {
      setStep('step-1')
    }
  }

  return (
    <>
      {step === 'step-1' && <CryptoStep1 onNext={() => setStep('step-2')} onBack={onBack} />}
      {step === 'step-2' && <CryptoStep2 onBack={handleStepBack} />}
    </>
  )
})
