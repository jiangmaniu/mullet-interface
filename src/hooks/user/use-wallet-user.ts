import { usePrivy } from '@privy-io/react-auth'
import { useConnectedStandardWallets } from '@privy-io/react-auth/solana'

export const useUserWallet = () => {
  const { user } = usePrivy()
  const wallet = user?.wallet
  return wallet
}

export const useUserConnectedWallet = () => {
  const { wallets } = useConnectedStandardWallets()
  const wallet = wallets[0]
  return wallet
}
