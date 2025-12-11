import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { useWallets as useSolanaWallets } from '@privy-io/react-auth/solana'

// 统一获取privy信息，并处理导出
export default function usePrivyInfo() {
  const { user, authenticated, ready } = usePrivy()
  const { wallets: ethWallets } = useWallets()
  const { wallets: solWallets } = useSolanaWallets()
  const { connectWallet } = useConnectWallet()

  const wallet = user?.wallet
  const address = wallet?.address || ''
  
  // 合并所有钱包
  const allWallets = [...ethWallets, ...solWallets]
  
  // 查找 Solana 钱包（优先嵌入式，其次外部）
  // useSolanaWallets() 返回的钱包对象没有 chainType 或 type 属性
  // 所以直接使用 solWallets 作为 Solana 钱包列表
  const solanaWallets = solWallets
  const foundWallet = solanaWallets.find((w) => w.address === address) || solanaWallets[0] // 钱包实例

  // 是否是嵌入钱包 privy生成的钱包
  const hasEmbeddedWallet =
    wallet?.connectorType && wallet?.connectorType === 'embedded' && wallet?.chainType === 'solana' && wallet?.walletClientType === 'privy'

  // 是否有外部钱包 solana类型的
  const hasExternalWallet = wallet?.connectorType && wallet?.connectorType !== 'embedded' && wallet?.chainType === 'solana'

  console.log('user：', user)
  console.log('wallet:', wallet)
  console.log('eth wallets:', ethWallets)
  console.log('sol wallets:', solWallets)
  console.log('all wallets:', allWallets)
  console.log('solana wallets:', solanaWallets)
  console.log('foundWallet：', foundWallet)

  return {
    hasEmbeddedWallet,
    hasExternalWallet,
    foundWallet,
    address,
    user,
    wallet,
    wallets: allWallets,
    connectWallet,
    reconnectWallet: !foundWallet, // 是否需要重新连接钱包
    hasWallet: !!foundWallet,
    connected: authenticated && ready
  }
}
