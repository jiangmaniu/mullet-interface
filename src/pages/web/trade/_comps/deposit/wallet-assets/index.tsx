import { useState } from 'react'
import { observer } from 'mobx-react'
import { WalletAssetsStep1 } from './step-1'
import { WalletAssetsStep2 } from './step-2'
import { WalletAssetsStep3 } from './step-3'

type Step = 'step-1' | 'step-2' | 'step-3'

export const WalletAssets = observer(({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<Step>('step-1')
  const [selectedAsset, setSelectedAsset] = useState<{ symbol: string; chainName: string } | null>(null)

  const [amount, setAmount] = useState<string>('')

  const handleAssetSelect = (asset: { symbol: string; chainName: string }) => {
    setSelectedAsset(asset)
    setStep('step-2')
  }

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
      {step === 'step-1' && <WalletAssetsStep1 onBack={handleStepBack} onSelect={handleAssetSelect} />}
      {step === 'step-2' && (
        <WalletAssetsStep2
          onBack={handleStepBack}
          selectedAsset={selectedAsset}
          amount={amount}
          onAmountChange={setAmount}
          onNext={() => setStep('step-3')}
        />
      )}
      {step === 'step-3' && (
        <WalletAssetsStep3
          onBack={handleStepBack}
          onClose={onBack}
          amount={amount}
          selectedAsset={selectedAsset}
          onRetry={() => setStep('step-2')}
        />
      )}
    </>
  )
})
