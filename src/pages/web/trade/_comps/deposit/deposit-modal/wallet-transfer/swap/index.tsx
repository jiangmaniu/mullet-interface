import { useState } from 'react'
import { observer } from 'mobx-react'
import { SwapStep1 } from './step-1'
import { SwapStep2 } from './step-2'
import { SwapStep3 } from './step-3'

type Step = 'step-1' | 'step-2' | 'step-3'

export const SwapDeposit = observer(({ onBack, onClose, initialToken }: { onBack: () => void; onClose: () => void; initialToken?: string }) => {
  const [step, setStep] = useState<Step>('step-1')
  const [fromToken, setFromToken] = useState<string>(initialToken || 'SOL')
  const [toToken, setToToken] = useState<string>('USDC')
  const [amount, setAmount] = useState<string>('')

  const handleStepBack = () => {
    if (step === 'step-1') {
      onBack()
    } else if (step === 'step-2') {
      setStep('step-1')
    } else if (step === 'step-3') {
      setStep('step-2')
    }
  }

  return (
    <>
      {step === 'step-1' && (
        <SwapStep1
          onBack={handleStepBack}
          fromToken={fromToken}
          toToken={toToken}
          amount={amount}
          onFromTokenChange={setFromToken}
          onToTokenChange={setToToken}
          onAmountChange={setAmount}
          onNext={() => setStep('step-2')}
        />
      )}
      {step === 'step-2' && (
        <SwapStep2
          onBack={handleStepBack}
          onClose={onClose}
          fromToken={fromToken}
          toToken={toToken}
          amount={amount}
          onNext={() => setStep('step-3')}
        />
      )}
      {step === 'step-3' && (
        <SwapStep3
          onBack={handleStepBack}
          onClose={onBack}
          fromToken={fromToken}
          toToken={toToken}
          amount={amount}
          onRetry={() => setStep('step-1')}
        />
      )}
    </>
  )
})
