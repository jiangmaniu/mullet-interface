import { useState, useEffect, useCallback } from 'react'
import { getCoboBalance } from '@/services/api/cobo'
import { getCachedBalances } from '@/services/coboPreloadService'

interface CoboTokenBalance {
  tokenId: string
  symbol: string
  chainId: string
  chainName: string
  balance: string
  available: string
  decimals: number
}

interface UseCoboBalancesParams {
  userId: string
  enabled?: boolean
}

// Cobo 支持的代币配置
// 格式: tokenId -> { symbol, chainId, chainName, decimals }
const COBO_TOKEN_CONFIG: Record<string, { symbol: string; chainId: string; chainName: string; decimals: number }> = {
  // Solana
  'SOL_USDT': { symbol: 'USDT', chainId: 'SOL', chainName: 'Solana', decimals: 6 },
  'SOL_USDC': { symbol: 'USDC', chainId: 'SOL', chainName: 'Solana', decimals: 6 },
  'SOL_SOL': { symbol: 'SOL', chainId: 'SOL', chainName: 'Solana', decimals: 9 },
  
  // Ethereum
  'ETH_USDT': { symbol: 'USDT', chainId: 'ETH', chainName: 'Ethereum', decimals: 6 },
  'ETH_USDC': { symbol: 'USDC', chainId: 'ETH', chainName: 'Ethereum', decimals: 6 },
  'ETH_ETH': { symbol: 'ETH', chainId: 'ETH', chainName: 'Ethereum', decimals: 18 },
  
  // TRON
  'TRON_USDT': { symbol: 'USDT', chainId: 'TRON', chainName: 'Tron', decimals: 6 },
  'TRON_TRX': { symbol: 'TRX', chainId: 'TRON', chainName: 'Tron', decimals: 6 },
  
  // Arbitrum
  'ARBITRUM_USDCOIN': { symbol: 'USDC', chainId: 'ARBITRUM_ETH', chainName: 'Arbitrum', decimals: 6 },
  'ARBITRUM_TETHER': { symbol: 'USDT', chainId: 'ARBITRUM_ETH', chainName: 'Arbitrum', decimals: 6 },
  'ARBITRUM_ETH': { symbol: 'ETH', chainId: 'ARBITRUM_ETH', chainName: 'Arbitrum', decimals: 18 },
  
  // Base
  'BASE_USDCOIN': { symbol: 'USDC', chainId: 'BASE_ETH', chainName: 'Base', decimals: 6 },
  'BASE_TETHER': { symbol: 'USDT', chainId: 'BASE_ETH', chainName: 'Base', decimals: 6 },
  'BASE_ETH': { symbol: 'ETH', chainId: 'BASE_ETH', chainName: 'Base', decimals: 18 },
  
  // Polygon
  'MATIC_USDT': { symbol: 'USDT', chainId: 'MATIC', chainName: 'Polygon', decimals: 6 },
  'MATIC_USDC': { symbol: 'USDC', chainId: 'MATIC', chainName: 'Polygon', decimals: 6 },
  'MATIC_MATIC': { symbol: 'MATIC', chainId: 'MATIC', chainName: 'Polygon', decimals: 18 },
  
  // BSC
  'BSC_USDT': { symbol: 'USDT', chainId: 'BSC_BNB', chainName: 'BSC', decimals: 18 },
  'BSC_USDC': { symbol: 'USDC', chainId: 'BSC_BNB', chainName: 'BSC', decimals: 18 },
  'BSC_BNB': { symbol: 'BNB', chainId: 'BSC_BNB', chainName: 'BSC', decimals: 18 },
}

// 默认查询的代币列表（按优先级排序）
const DEFAULT_TOKEN_IDS = [
  // 稳定币优先
  'SOL_USDC',
  'SOL_USDT',
  'ETH_USDC',
  'ETH_USDT',
  'ARBITRUM_USDCOIN',
  'ARBITRUM_TETHER',
  'BASE_USDCOIN',
  'BASE_TETHER',
  'MATIC_USDC',
  'MATIC_USDT',
  'BSC_USDC',
  'BSC_USDT',
  'TRON_USDT',
  // 原生代币
  'SOL_SOL',
  'ETH_ETH',
  'ARBITRUM_ETH',
  'BASE_ETH',
  'MATIC_MATIC',
  'BSC_BNB',
  'TRON_TRX',
]

/**
 * Cobo 钱包余额查询 Hook
 * 批量查询用户在 Cobo 钱包中的所有代币余额
 * 
 * @example
 * ```tsx
 * const { balances, isLoading, refetch } = useCoboBalances({ userId: user.id })
 * ```
 */
export const useCoboBalances = ({
  userId,
  enabled = true
}: UseCoboBalancesParams) => {
  const [balances, setBalances] = useState<CoboTokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = useCallback(async (forceRefresh = false) => {
    if (!enabled || !userId) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 🔥 优先使用预加载缓存（除非强制刷新）
      const cachedData = !forceRefresh ? getCachedBalances() : null
      
      if (cachedData && cachedData.length > 0) {
        console.log('[Cobo Balances] ✅ 使用预加载缓存数据')
        
        const results: CoboTokenBalance[] = cachedData
          .map((item: any) => {
            const config = COBO_TOKEN_CONFIG[item.tokenId]
            if (config) {
              return {
                tokenId: item.tokenId,
                symbol: config.symbol,
                chainId: config.chainId,
                chainName: config.chainName,
                balance: item.balance,
                available: item.available,
                decimals: config.decimals
              }
            }
            return null
          })
          .filter(Boolean) as CoboTokenBalance[]
        
        setBalances(results)
        setIsLoading(false)
        return
      }

      console.log('[Cobo Balances] Fetching balances for user:', userId)
      
      const results: CoboTokenBalance[] = []
      
      // 并发查询所有代币余额
      const promises = DEFAULT_TOKEN_IDS.map(async (tokenId) => {
        try {
          const response = await getCoboBalance({ userId, tokenId })
          console.log(`[Cobo Balances] Token ${tokenId} response:`, response)
          
          if (response.success && response.data) {
            const available = response.data.available || '0'
            const balance = response.data.balance || '0'
            
            // 返回所有有记录的代币（即使余额为0也显示）
            const config = COBO_TOKEN_CONFIG[tokenId]
            if (config) {
              console.log(`[Cobo Balances] Token ${tokenId} found:`, {
                balance,
                available,
                config
              })
              return {
                tokenId,
                symbol: config.symbol,
                chainId: config.chainId,
                chainName: config.chainName,
                balance,
                available,
                decimals: config.decimals
              }
            } else {
              console.warn(`[Cobo Balances] Token ${tokenId} not in config`)
            }
          }
        } catch (err) {
          // 忽略单个代币查询失败
          console.debug(`[Cobo Balances] Token ${tokenId} query failed:`, err)
        }
        return null
      })

      const responses = await Promise.all(promises)
      
      // 过滤出有余额的代币
      responses.forEach((res) => {
        if (res) {
          results.push(res)
        }
      })

      // 按余额从大到小排序
      results.sort((a, b) => {
        const aValue = BigInt(a.available) / BigInt(10 ** (a.decimals - 6)) // 标准化到6位小数
        const bValue = BigInt(b.available) / BigInt(10 ** (b.decimals - 6))
        return Number(bValue - aValue)
      })

      console.log('[Cobo Balances] Found balances:', results.length)
      setBalances(results)
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch balances'
      setError(errorMsg)
      console.error('[Cobo Balances] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId, enabled])

  useEffect(() => {
    if (enabled && userId) {
      fetchBalances()
    }
  }, [enabled, userId, fetchBalances])

  return {
    balances,
    isLoading,
    error,
    refetch: () => fetchBalances(true) // 强制刷新
  }
}

export { COBO_TOKEN_CONFIG, DEFAULT_TOKEN_IDS }
export type { CoboTokenBalance }
