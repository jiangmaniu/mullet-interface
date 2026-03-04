/**
 * useDepositAddress hook
 * 封装 /api/deposit/address 接口调用，自动 check → create
 *
 * 替代旧版 useServerWallet 用于充值地址展示场景
 * 优势：
 *   - 单次请求完成 check + create
 *   - 返回 iconUrl、supportedTokens、minDeposit 等展示字段
 *   - 新建时返回 justCreated: true
 */

import { useState, useEffect, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { getDepositAddress, type DepositChainId, type DepositAddressResult } from '@/services/depositService'

interface UseDepositAddressResult {
  address: string | null
  walletId: string | null
  iconUrl: string | null
  supportedTokens: DepositAddressResult['supportedTokens']
  minDeposit: string | null
  estimatedTime: string | null
  justCreated: boolean
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * @param chain           链 ID：'SOL' | 'ETH' | 'TRON'
 * @param tradeAccountId  交易账户 ID
 * @param enabled         是否启用（默认 true，可根据对话框 open 状态控制）
 */
export function useDepositAddress(
  chain: DepositChainId | undefined,
  tradeAccountId: string | undefined,
  enabled = true
): UseDepositAddressResult {
  const { authenticated, ready } = usePrivy()

  const [data, setData] = useState<DepositAddressResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rev, setRev] = useState(0) // force refetch

  // track current params to avoid stale updates
  const paramsRef = useRef({ chain, tradeAccountId })
  paramsRef.current = { chain, tradeAccountId }

  // Reset when key params change
  useEffect(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [chain, tradeAccountId])

  useEffect(() => {
    if (!enabled || !authenticated || !ready) return
    if (!chain || !tradeAccountId) return

    const currentChain = chain
    const currentTradeAccountId = tradeAccountId

    let cancelled = false

    const fetchAddress = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getDepositAddress(currentChain, currentTradeAccountId)
        if (cancelled) return
        // guard against stale updates
        if (paramsRef.current.chain !== currentChain || paramsRef.current.tradeAccountId !== currentTradeAccountId) return
        setData(result)
      } catch (err: any) {
        if (cancelled) return
        if (paramsRef.current.chain !== currentChain) return
        console.error(`[useDepositAddress:${currentChain}] Error:`, err)
        setError(err.message || `Failed to get ${currentChain} deposit address`)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchAddress()

    return () => {
      cancelled = true
    }
  }, [enabled, authenticated, ready, chain, tradeAccountId, rev])

  const refetch = () => setRev((r) => r + 1)

  return {
    address: data?.address ?? null,
    walletId: data?.walletId ?? null,
    iconUrl: data?.iconUrl ?? null,
    supportedTokens: data?.supportedTokens ?? [],
    minDeposit: data?.minDeposit ?? null,
    estimatedTime: data?.estimatedTime ?? null,
    justCreated: data?.justCreated ?? false,
    isLoading,
    error,
    refetch,
  }
}
