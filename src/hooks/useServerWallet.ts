/**
 * Server Wallet Hook
 * Generic hook for managing server-owned wallets on multiple chains
 * 
 * Supports all Privy-enabled chains:
 * - tron
 * - ethereum  
 * - solana
 * - arbitrum
 * - bsc
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { ensureServerWallet, checkServerWallet, type SupportedChain } from '@/services/serverWalletService'

interface UseServerWalletResult {
  address: string | null
  walletId: string | null
  isCreating: boolean
  error: string | null
  createWallet: () => Promise<void>
  refetch: () => void
}

/**
 * Server Wallet Hook
 * @param chain - The chain to create wallet for
 * @param autoCreate - Whether to auto-create wallet if not exists (default: true)
 */
export function useServerWallet(
  chain: SupportedChain,
  autoCreate = true
): UseServerWalletResult {
  const { authenticated, ready } = usePrivy()

  const [address, setAddress] = useState<string | null>(null)
  const [walletId, setWalletId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 使用 ref 追踪当前 chain 和创建状态
  const currentChainRef = useRef(chain)
  const isCreatingRef = useRef(false)

  // Create wallet manually
  const createWallet = useCallback(async () => {
    if (!authenticated || !ready) {
      console.log(`[useServerWallet:${chain}] Not authenticated or not ready`)
      return
    }

    if (isCreatingRef.current) {
      console.log(`[useServerWallet:${chain}] Already creating wallet`)
      return
    }

    try {
      isCreatingRef.current = true
      setIsCreating(true)
      setError(null)

      console.log(`[useServerWallet:${chain}] Creating wallet...`)

      const result = await ensureServerWallet(chain)

      // 检查 chain 是否已经变化
      if (currentChainRef.current !== chain) {
        console.log(`[useServerWallet:${chain}] Chain changed during creation, ignoring result`)
        return
      }

      if (result) {
        console.log(`[useServerWallet:${chain}] ✅ Wallet ready:`, result.address)
        setAddress(result.address)
        setWalletId(result.walletId)
      }
    } catch (err: any) {
      if (currentChainRef.current === chain) {
        console.error(`[useServerWallet:${chain}] Failed to create wallet:`, err)
        setError(err.message || `Failed to create ${chain} wallet`)
      }
    } finally {
      isCreatingRef.current = false
      setIsCreating(false)
    }
  }, [authenticated, ready, chain])

  // Refresh wallet info
  const refetch = useCallback(() => {
    // 重置状态并重新获取
    setAddress(null)
    setWalletId(null)
    setError(null)
    isCreatingRef.current = false
  }, [])

  // 当 chain 变化时，立即重置状态
  useEffect(() => {
    console.log(`[useServerWallet] Chain changed to: ${chain}`)
    currentChainRef.current = chain
    setAddress(null)
    setWalletId(null)
    setError(null)
    isCreatingRef.current = false
    setIsCreating(false)
  }, [chain])

  // Auto check/create wallet
  useEffect(() => {
    // 必须满足：已认证、ready、开启自动创建
    if (!authenticated || !ready || !autoCreate) {
      console.log(`[useServerWallet:${chain}] Skip: authenticated=${authenticated}, ready=${ready}, autoCreate=${autoCreate}`)
      return
    }

    // 如果正在创建中，跳过
    if (isCreatingRef.current) {
      console.log(`[useServerWallet:${chain}] Skip: already creating`)
      return
    }

    const currentChain = chain // 捕获当前 chain
    console.log(`[useServerWallet:${currentChain}] Starting check/create wallet...`)

    const checkAndCreate = async () => {
      // 再次检查
      if (isCreatingRef.current) return
      if (currentChainRef.current !== currentChain) {
        console.log(`[useServerWallet:${currentChain}] Chain already changed, skipping`)
        return
      }

      isCreatingRef.current = true
      setIsCreating(true)
      setError(null)
      
      try {
        // First check if wallet exists
        console.log(`[useServerWallet:${currentChain}] Calling check API...`)
        const existingWallet = await checkServerWallet(currentChain)

        // 检查 chain 是否已经变化
        if (currentChainRef.current !== currentChain) {
          console.log(`[useServerWallet:${currentChain}] Chain changed during check, ignoring`)
          return
        }

        if (existingWallet.exists && existingWallet.address) {
          console.log(`[useServerWallet:${currentChain}] ✅ Found existing wallet:`, existingWallet.address)
          setAddress(existingWallet.address)
          setWalletId(existingWallet.walletId || null)
          return
        }

        // Create new wallet
        console.log(`[useServerWallet:${currentChain}] No wallet found, creating...`)
        const result = await ensureServerWallet(currentChain)

        // 再次检查 chain 是否已经变化
        if (currentChainRef.current !== currentChain) {
          console.log(`[useServerWallet:${currentChain}] Chain changed during create, ignoring`)
          return
        }

        if (result) {
          console.log(`[useServerWallet:${currentChain}] ✅ Wallet created:`, result.address)
          setAddress(result.address)
          setWalletId(result.walletId)
        }
      } catch (err: any) {
        // 只有当 chain 没有变化时才设置错误
        if (currentChainRef.current === currentChain) {
          console.error(`[useServerWallet:${currentChain}] Failed to check/create wallet:`, err)
          setError(err.message || `Failed to create ${currentChain} wallet`)
        }
      } finally {
        // 只有当 chain 没有变化时才重置 creating 状态
        if (currentChainRef.current === currentChain) {
          isCreatingRef.current = false
          setIsCreating(false)
        }
      }
    }

    checkAndCreate()
  }, [authenticated, ready, autoCreate, chain, address]) // 添加 address 作为依赖，这样 reset 后会重新触发

  return {
    address,
    walletId,
    isCreating,
    error,
    createWallet,
    refetch
  }
}
