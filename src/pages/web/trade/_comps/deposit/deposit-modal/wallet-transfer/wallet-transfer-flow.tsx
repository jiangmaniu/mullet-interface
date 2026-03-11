import { useState } from 'react'
import { observer } from 'mobx-react'
import { WalletTransfer } from './index'
import { WalletAssets as UsdcDeposit } from './usdc'
import type { WalletAsset } from './index'

type View = 'token-selection' | 'usdc-deposit' | 'swap-deposit'

export const WalletTransferFlow = observer(({ onBack, onClose }: { onBack: () => void; onClose: () => void }) => {
  const [view, setView] = useState<View>('token-selection')

  const handleTokenSelect = (asset: WalletAsset) => {
    if (asset.symbol === 'USDC') {
      setView('usdc-deposit')
    } else {
      setView('swap-deposit')
    }
  }

  const handleBackFromFlow = () => {
    if (view === 'token-selection') {
      onBack()
    } else {
      setView('token-selection')
    }
  }

  if (view === 'token-selection') {
    return <WalletTransfer onBack={onBack} onSelect={handleTokenSelect} />
  }

  if (view === 'usdc-deposit') {
    return <UsdcDeposit onBack={handleBackFromFlow} onClose={onClose} />
  }

  // TODO: Implement swap flow
  return <div>Swap flow not implemented</div>
})
