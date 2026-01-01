import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { useWallets as useSolanaWallets } from '@privy-io/react-auth/solana'
import { useMemo } from 'react'

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

  // ==================== 智能钱包选择逻辑 ====================

  /**
   * 智能选择活跃的 Solana 钱包
   * 优先级：
   * 1. 单钱包 → 直接返回
   * 2. 多钱包 → 从 user.linkedAccounts 中找最近连接的 Solana 钱包
   * 3. 兜底 → 返回最后一个钱包
   */
  const getActiveSolanaWallet = () => {
    if (!solWallets || solWallets.length === 0) return undefined

    // 如果只有一个钱包，直接使用
    if (solWallets.length === 1) return solWallets[0]

    // 多钱包场景：从 user.linkedAccounts 中查找最近关联的 Solana 钱包
    if (user?.linkedAccounts) {
      // 过滤出钱包类型的账号（排除 email、phone 等）
      const walletAccounts = user.linkedAccounts.filter((acc: any) => acc.type === 'wallet')

      // 倒序遍历，找到最后一个 Solana 钱包（非 0x 开头）
      for (let i = walletAccounts.length - 1; i >= 0; i--) {
        const address = (walletAccounts[i] as any).address
        if (address && !address.startsWith('0x')) {
          // 在 solWallets 中查找匹配的钱包对象
          const matchedWallet = solWallets.find((w) => w.address === address)
          if (matchedWallet) {
            return matchedWallet
          }
        }
      }
    }

    // 兜底：使用最后一个钱包
    return solWallets[solWallets.length - 1]
  }

  // 使用 useMemo 优化活跃 Solana 钱包选择
  const activeSolanaWallet = useMemo(() => {
    const activeWallet = getActiveSolanaWallet()
    if (activeWallet) {
      console.log('[usePrivyInfo] ✅ Active Solana wallet:', activeWallet.address)
    }
    return activeWallet
  }, [solWallets, user?.linkedAccounts])

  /**
   * 智能选择活跃的 Ethereum 钱包（匹配 Solana 钱包来源）
   * 优先级：
   * 1. 匹配 Solana 钱包来源 (phantom, okx_wallet, 等)
   * 2. 回退到 privy 嵌入式钱包
   * 3. 使用第一个 ETH 钱包
   */
  const getActiveEthereumWallet = () => {
    const ethereumWallets = ethWallets.filter((w) => w.address.startsWith('0x'))

    // 🔍 Debug: 打印 user.linkedAccounts
    console.log(
      '[usePrivyInfo] 🔍 user.linkedAccounts:',
      user?.linkedAccounts?.map((acc) => ({
        type: acc.type,
        address: (acc as any).address?.slice(0, 10) + '...',
        walletClient: (acc as any).walletClient,
        walletClientType: (acc as any).walletClientType
      }))
    )

    if (ethereumWallets.length === 0) return undefined

    // 🔍 Debug: 打印所有 ETH 钱包的类型
    console.log(
      '[usePrivyInfo] 📋 All ETH wallets:',
      ethereumWallets.map((w) => ({
        address: w.address.slice(0, 10) + '...',
        type: w.walletClientType,
        connectorType: w.connectorType
      }))
    )

    // 获取 Solana 钱包来源
    const solWalletSource = (() => {
      if (!activeSolanaWallet) return 'privy'
      const standardWallet = (activeSolanaWallet as any).standardWallet
      const walletName = standardWallet?.name || 'privy'
      return walletName.toLowerCase().replace(/\s+/g, '_')
    })()

    console.log('[usePrivyInfo] 🎯 Solana wallet source:', solWalletSource)

    // 三级优先级匹配
    let selectedWallet = ethereumWallets.find((w) => w.walletClientType === solWalletSource)

    if (!selectedWallet && solWalletSource !== 'privy') {
      console.log('[usePrivyInfo] ⚠️ No ETH wallet matching Solana source, trying privy...')
      selectedWallet = ethereumWallets.find((w) => w.walletClientType === 'privy')
    }

    if (!selectedWallet) {
      selectedWallet = ethereumWallets[0]
    }

    console.log('[usePrivyInfo] ✅ Selected ETH wallet:', {
      address: selectedWallet?.address,
      type: selectedWallet?.walletClientType,
      matchedSource: solWalletSource
    })

    return selectedWallet
  }

  // 使用 useMemo 优化 ETH 钱包选择
  const activeEthereumWallet = useMemo(() => {
    const activeWallet = getActiveEthereumWallet()
    if (activeWallet) {
      console.log('[usePrivyInfo] ✅ Active Ethereum wallet:', activeWallet.address)
    }
    return activeWallet
  }, [ethWallets, activeSolanaWallet])

  return {
    user,
    wallet,
    address,
    wallets: allWallets,
    ethWallets,
    solWallets,
    connectWallet,
    connected: authenticated && ready,
    activeSolanaWallet,
    activeEthereumWallet
  }
}
