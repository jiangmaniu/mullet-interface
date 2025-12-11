import { usePrivy, useWallets, WalletWithMetadata } from '@privy-io/react-auth'
import { useExportWallet } from '@privy-io/react-auth/solana'
import Button from '../Base/Button'

export default function ExportWalletButton() {
  const { ready, authenticated, user } = usePrivy()
  const { exportWallet } = useExportWallet()
  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated
  // Check that your user has an embedded wallet
  const hasEmbeddedWallet = !!user?.linkedAccounts?.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' && account.walletClientType === 'privy' && account.chainType === 'solana'
  )

  return (
    // @ts-ignore
    <Button onClick={exportWallet} disabled={!isAuthenticated || !hasEmbeddedWallet}>
      Export Wallet
    </Button>
  )
}
