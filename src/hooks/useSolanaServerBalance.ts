/**
 * useSolanaServerBalance
 * 通过后端 /api/solana-wallet/balance?address= 查询 Solana 链上余额
 * 替代直接连 Helius RPC 的 useSolanaBalance hook
 *
 * 优势：
 *   - 使用后端的 Ankr 付费 RPC，避免前端 RPC 速率限制
 *   - 同时返回 SOL 价格（Binance API）和 USD 估值
 *   - 返回 insufficient 标志（估值 < $10）
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSolanaBalance, type SolanaTokenBalance } from '@/services/depositService'

interface UseSolanaServerBalanceResult {
  /** { SOL: { balance, usdValue, insufficient }, USDC: {...}, USDT: {...} } */
  balances: Record<string, SolanaTokenBalance>
  totalUsdValue: number
  solPrice: number
  insufficientBalance: boolean
  loading: boolean
  error: string | null
  refetch: () => void
}

const EMPTY: UseSolanaServerBalanceResult = {
  balances: {},
  totalUsdValue: 0,
  solPrice: 0,
  insufficientBalance: false,
  loading: false,
  error: null,
  refetch: () => {},
}

export function useSolanaServerBalance(walletAddress?: string): UseSolanaServerBalanceResult {
  const [balances, setBalances] = useState<Record<string, SolanaTokenBalance>>({})
  const [totalUsdValue, setTotalUsdValue] = useState(0)
  const [solPrice, setSolPrice] = useState(0)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rev, setRev] = useState(0)

  const addressRef = useRef(walletAddress)
  addressRef.current = walletAddress

  const refetch = useCallback(() => setRev((r) => r + 1), [])

  useEffect(() => {
    if (!walletAddress) {
      setBalances({})
      setTotalUsdValue(0)
      setSolPrice(0)
      return
    }

    let cancelled = false

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getSolanaBalance(walletAddress)
        if (cancelled || addressRef.current !== walletAddress) return

        // Convert [usdValue, amountStr, insufficient] tuples → SolanaTokenBalance records
        const mapped: Record<string, SolanaTokenBalance> = {}
        for (const [symbol, tuple] of Object.entries(data.balances)) {
          const [usdValue, balance, insufficient] = tuple as [number, string, boolean]
          mapped[symbol] = { usdValue, balance, insufficient }
        }

        setBalances(mapped)
        setTotalUsdValue(data.totalUsdValue)
        setSolPrice(data.solPrice)
        setInsufficientBalance(data.insufficientBalance)
      } catch (err: any) {
        if (cancelled) return
        console.error('[useSolanaServerBalance] Error:', err)
        setError(err.message || 'Failed to fetch balance')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [walletAddress, rev])

  return { balances, totalUsdValue, solPrice, insufficientBalance, loading, error, refetch }
}
