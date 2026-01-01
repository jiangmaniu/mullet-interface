/**
 * Server Wallets Context
 * 提供全局的钱包地址缓存，避免重复请求
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useStores } from '@/context/mobxProvider'
import { ensureServerWallet, checkServerWallet, type SupportedChain } from '@/services/serverWalletService'

// 支持的链
const SUPPORTED_CHAINS: SupportedChain[] = ['solana', 'ethereum', 'tron', 'arbitrum', 'bsc']

interface WalletInfo {
  address: string | null
  walletId: string | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error?: string
}

interface ServerWalletsContextValue {
  wallets: Record<SupportedChain, WalletInfo>
  getWallet: (chain: SupportedChain) => WalletInfo
  getAddress: (chain: SupportedChain) => string | null
  isLoading: (chain: SupportedChain) => boolean
  isAllLoaded: boolean
  preloadAll: () => Promise<void>
  loadWallet: (chain: SupportedChain) => Promise<void>
}

const defaultWalletInfo: WalletInfo = {
  address: null,
  walletId: null,
  status: 'idle'
}

const initialWallets: Record<SupportedChain, WalletInfo> = {
  solana: { ...defaultWalletInfo },
  ethereum: { ...defaultWalletInfo },
  tron: { ...defaultWalletInfo },
  arbitrum: { ...defaultWalletInfo },
  bsc: { ...defaultWalletInfo }
}

const ServerWalletsContext = createContext<ServerWalletsContextValue | null>(null)

export function ServerWalletsProvider({ children }: { children: React.ReactNode }) {
  const { authenticated, ready } = usePrivy()
  const { trade } = useStores()
  const tradeAccountId = trade.currentAccountInfo?.id

  const [wallets, setWallets] = useState<Record<SupportedChain, WalletInfo>>(initialWallets)
  const [preloadStarted, setPreloadStarted] = useState(false)

  // 加载单个钱包
  const loadWallet = useCallback(
    async (chain: SupportedChain) => {
      if (!tradeAccountId) {
        console.log(`[ServerWalletsProvider] Cannot load ${chain} wallet: no tradeAccountId`)
        return
      }

      // 如果已经加载成功，不重复加载
      if (wallets[chain].status === 'success' && wallets[chain].address) {
        return
      }

      setWallets((prev) => ({
        ...prev,
        [chain]: { ...prev[chain], status: 'loading' }
      }))

      try {
        console.log(`[ServerWalletsProvider] Loading ${chain} wallet...`)
        const result = await ensureServerWallet(chain, tradeAccountId)

        if (result) {
          console.log(`[ServerWalletsProvider] ✅ ${chain} wallet:`, result.address)
          setWallets((prev) => ({
            ...prev,
            [chain]: {
              address: result.address,
              walletId: result.walletId,
              status: 'success'
            }
          }))
        }
      } catch (error: any) {
        console.error(`[ServerWalletsProvider] ❌ Failed to load ${chain}:`, error)
        setWallets((prev) => ({
          ...prev,
          [chain]: {
            ...prev[chain],
            status: 'error',
            error: error.message
          }
        }))
      }
    },
    [tradeAccountId, wallets]
  )

  // 预加载所有钱包
  const preloadAll = useCallback(async () => {
    if (!tradeAccountId) {
      console.log('[ServerWalletsProvider] Cannot preload: no tradeAccountId')
      return
    }

    console.log('[ServerWalletsProvider] 🚀 Preloading all wallets...')

    // 并行加载所有钱包
    await Promise.allSettled(SUPPORTED_CHAINS.map((chain) => loadWallet(chain)))

    console.log('[ServerWalletsProvider] ✅ All wallets preloaded')
  }, [tradeAccountId, loadWallet])

  // 获取钱包信息
  const getWallet = useCallback(
    (chain: SupportedChain): WalletInfo => {
      return wallets[chain] || defaultWalletInfo
    },
    [wallets]
  )

  // 获取地址
  const getAddress = useCallback(
    (chain: SupportedChain): string | null => {
      return wallets[chain]?.address || null
    },
    [wallets]
  )

  // 检查是否正在加载
  const isLoading = useCallback(
    (chain: SupportedChain): boolean => {
      return wallets[chain]?.status === 'loading'
    },
    [wallets]
  )

  // 检查是否全部加载完成
  const isAllLoaded = SUPPORTED_CHAINS.every((chain) => wallets[chain].status === 'success' || wallets[chain].status === 'error')

  // 当 tradeAccountId 变化时重置
  useEffect(() => {
    if (tradeAccountId) {
      // 重置所有钱包状态
      setWallets(initialWallets)
      setPreloadStarted(false)
    }
  }, [tradeAccountId])

  // 自动预加载
  useEffect(() => {
    if (authenticated && ready && tradeAccountId && !preloadStarted) {
      setPreloadStarted(true)
      preloadAll()
    }
  }, [authenticated, ready, tradeAccountId, preloadStarted, preloadAll])

  return (
    <ServerWalletsContext.Provider
      value={{
        wallets,
        getWallet,
        getAddress,
        isLoading,
        isAllLoaded,
        preloadAll,
        loadWallet
      }}
    >
      {children}
    </ServerWalletsContext.Provider>
  )
}

export function useServerWalletsContext() {
  const context = useContext(ServerWalletsContext)
  if (!context) {
    throw new Error('useServerWalletsContext must be used within ServerWalletsProvider')
  }
  return context
}

/**
 * 简单的 hook 用于获取单个链的钱包
 * 如果 Provider 不存在，会回退到直接请求
 */
export function useCachedServerWallet(chain: SupportedChain) {
  const context = useContext(ServerWalletsContext)

  if (context) {
    const wallet = context.getWallet(chain)
    return {
      address: wallet.address,
      walletId: wallet.walletId,
      isLoading: wallet.status === 'loading',
      error: wallet.error,
      reload: () => context.loadWallet(chain)
    }
  }

  // 如果没有 Provider，返回空值（会回退到原来的 useServerWallet hook）
  return {
    address: null,
    walletId: null,
    isLoading: false,
    error: null,
    reload: () => {}
  }
}

export default ServerWalletsProvider
