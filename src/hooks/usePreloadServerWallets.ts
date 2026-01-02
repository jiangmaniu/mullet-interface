/**
 * 预加载所有支持的 Privy Server Wallets
 * 在登录成功后调用，预先创建/获取所有链的钱包地址
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useStores } from '@/context/mobxProvider'
import { ensureServerWallet, type SupportedChain } from '@/services/serverWalletService'

// 需要预加载的链列表
const PRELOAD_CHAINS: SupportedChain[] = ['solana', 'ethereum', 'tron', 'arbitrum', 'bsc']

interface WalletInfo {
  chain: SupportedChain
  address: string | null
  walletId: string | null
  status: 'pending' | 'loading' | 'success' | 'error'
  error?: string
}

interface UsePreloadServerWalletsResult {
  wallets: Record<SupportedChain, WalletInfo>
  isLoading: boolean
  isAllLoaded: boolean
  getAddress: (chain: SupportedChain) => string | null
  reload: () => void
}

/**
 * 预加载所有 Server Wallets
 * @param enabled - 是否启用预加载（需要 authenticated && tradeAccountId 存在）
 */
export function usePreloadServerWallets(enabled = true): UsePreloadServerWalletsResult {
  const { authenticated, ready } = usePrivy()
  const { trade } = useStores()
  const tradeAccountId = trade.currentAccountInfo?.id

  // 初始化钱包状态
  const initialWallets: Record<SupportedChain, WalletInfo> = {
    solana: { chain: 'solana', address: null, walletId: null, status: 'pending' },
    ethereum: { chain: 'ethereum', address: null, walletId: null, status: 'pending' },
    tron: { chain: 'tron', address: null, walletId: null, status: 'pending' },
    arbitrum: { chain: 'arbitrum', address: null, walletId: null, status: 'pending' },
    bsc: { chain: 'bsc', address: null, walletId: null, status: 'pending' }
  }

  const [wallets, setWallets] = useState<Record<SupportedChain, WalletInfo>>(initialWallets)
  const [isLoading, setIsLoading] = useState(false)
  const loadedRef = useRef(false)
  const loadingRef = useRef(false)

  // 加载单个链的钱包
  const loadWallet = useCallback(
    async (chain: SupportedChain) => {
      if (!tradeAccountId) return

      setWallets((prev) => ({
        ...prev,
        [chain]: { ...prev[chain], status: 'loading' }
      }))

      try {
        console.log(`[PreloadWallets] Loading ${chain} wallet for tradeAccountId:`, tradeAccountId)
        const result = await ensureServerWallet(chain, tradeAccountId)

        if (result) {
          console.log(`[PreloadWallets] ✅ ${chain} wallet loaded:`, result.address)
          setWallets((prev) => ({
            ...prev,
            [chain]: {
              chain,
              address: result.address,
              walletId: result.walletId,
              status: 'success'
            }
          }))
        } else {
          setWallets((prev) => ({
            ...prev,
            [chain]: { ...prev[chain], status: 'error', error: 'No wallet returned' }
          }))
        }
      } catch (error: any) {
        console.error(`[PreloadWallets] ❌ Failed to load ${chain} wallet:`, error)
        setWallets((prev) => ({
          ...prev,
          [chain]: {
            ...prev[chain],
            status: 'error',
            error: error.message || 'Unknown error'
          }
        }))
      }
    },
    [tradeAccountId]
  )

  // 并行加载所有钱包
  const loadAllWallets = useCallback(async () => {
    if (loadingRef.current || !tradeAccountId) return

    loadingRef.current = true
    setIsLoading(true)

    console.log('[PreloadWallets] 🚀 Starting to preload all wallets...')

    // 并行加载所有链
    await Promise.allSettled(PRELOAD_CHAINS.map((chain) => loadWallet(chain)))

    loadingRef.current = false
    setIsLoading(false)
    loadedRef.current = true

    console.log('[PreloadWallets] ✅ All wallets preloaded')
  }, [loadWallet, tradeAccountId])

  // 重新加载
  const reload = useCallback(() => {
    loadedRef.current = false
    setWallets(initialWallets)
    loadAllWallets()
  }, [loadAllWallets])

  // 获取指定链的地址
  const getAddress = useCallback(
    (chain: SupportedChain): string | null => {
      return wallets[chain]?.address || null
    },
    [wallets]
  )

  // 计算是否全部加载完成
  const isAllLoaded = PRELOAD_CHAINS.every((chain) => wallets[chain].status === 'success' || wallets[chain].status === 'error')

  // 在认证成功且有 tradeAccountId 时自动加载
  useEffect(() => {
    if (!enabled || !authenticated || !ready || !tradeAccountId) {
      return
    }

    if (loadedRef.current || loadingRef.current) {
      return
    }

    loadAllWallets()
  }, [enabled, authenticated, ready, tradeAccountId, loadAllWallets])

  // 当 tradeAccountId 变化时重置
  useEffect(() => {
    if (tradeAccountId) {
      loadedRef.current = false
    }
  }, [tradeAccountId])

  return {
    wallets,
    isLoading,
    isAllLoaded,
    getAddress,
    reload
  }
}

export default usePreloadServerWallets
