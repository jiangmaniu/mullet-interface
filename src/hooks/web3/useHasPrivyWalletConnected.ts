import { useLogin, usePrivy } from '@privy-io/react-auth'

export default function useHasPrivyWalletConnected() {
  const { connectWallet, user, logout, authenticated } = usePrivy()
  const { login } = useLogin()
  const wallet = user?.wallet
  // 排除内嵌钱包登录（邮箱等账号登录）
  const hasPrivyWalletConnected = wallet?.connectorType && wallet?.connectorType !== 'embedded'

  return {
    hasPrivyWalletConnected
  }
}
