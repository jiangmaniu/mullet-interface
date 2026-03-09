'use client'

import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { Button } from '@/libs/ui/components/button'
import { useState } from 'react'
import { DepositModal } from '@/pages/web/trade/_comps/deposit/deposit-modal'
import { useStores } from '@/context/mobxProvider'
import { observer } from 'mobx-react'

export const DepositAssets = observer(() => {
  const { activeSolanaWallet } = usePrivyInfo()
  const { trade } = useStores()
  const hasWallet = !!activeSolanaWallet
  const [showDepositModal, setShowDepositModal] = useState(false)

  return (
    <DepositModal
      isOpen={showDepositModal}
      onClose={() => setShowDepositModal(false)}
      initialAccountId={trade.currentAccountInfo?.id}
    >
      <Button disabled={!hasWallet} variant={'primary'} color={'primary'} size={'md'} onClick={() => setShowDepositModal(true)}>
        存款
      </Button>
    </DepositModal>
  )
})
