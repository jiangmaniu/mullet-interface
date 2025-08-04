import { useConnectWallet, usePrivy, useSolanaWallets } from '@privy-io/react-auth'

// 统一获取privy信息，并处理导出
export default function usePrivyInfo() {
  const { user, authenticated, ready } = usePrivy()
  const { wallets } = useSolanaWallets()
  const { connectWallet } = useConnectWallet()
  const wallet = user?.wallet
  const address = wallet?.address || ''
  const foundWallet = wallets.find((w) => w.address === address) // 钱包实例

  // 是否是嵌入钱包 privy生成的钱包
  const hasEmbeddedWallet =
    wallet?.connectorType && wallet?.connectorType === 'embedded' && wallet?.chainType === 'solana' && wallet?.walletClientType === 'privy'

  // 是否有外部钱包 solana类型的
  const hasExternalWallet = wallet?.connectorType && wallet?.connectorType !== 'embedded' && wallet?.chainType === 'solana'

  console.log('user：', user)
  console.log('foundWallet：', foundWallet)
  console.log('useSolanaWallets：', wallets)

  return {
    hasEmbeddedWallet,
    hasExternalWallet,
    foundWallet,
    address,
    user,
    wallet,
    wallets,
    connectWallet,
    reconnectWallet: !foundWallet, // 是否需要重新连接钱包
    connected: authenticated && ready
  }
}
