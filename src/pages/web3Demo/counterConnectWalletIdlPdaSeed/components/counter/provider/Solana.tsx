'use client'

import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { FC, ReactNode, useCallback, useMemo } from 'react'

// Import the wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

interface SolanaProviderProps {
  children: ReactNode
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    // 初始化显式的的钱包适配器 内部会依据浏览器环境自动选择适配器
    // 内部检测：https://github.dev/wallet-standard/wallet-standard
    // https://github.com/anza-xyz/wallet-standard/blob/master/packages/wallet-adapter/react/src/useStandardWalletAdapters.ts
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  )

  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    // <ConnectionProvider endpoint={'http://localhost:8899'}>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
