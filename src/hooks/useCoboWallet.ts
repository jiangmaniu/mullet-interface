import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '@/constants/api'

interface UseCoboWalletParams {
  userId: string
  tradeAccountId?: string | number  // 交易账户ID，用于钱包命名
  enabled?: boolean
  autoCreate?: boolean  // 🔥 是否自动创建钱包（默认 false，只有 layout 设为 true）
}

interface CoboWalletData {
  walletId: string
  walletName: string
  walletType: string
  isNew: boolean
}

// 🔥 钱包ID缓存（按userId）
const walletCache: Map<string, CoboWalletData> = new Map()

// 🔥 防并发锁：存储正在进行的请求 Promise
let pendingRequest: Promise<CoboWalletData | null> | null = null

/**
 * Cobo 钱包管理 Hook
 * 获取或创建用户的专属 Cobo 钱包
 *
 * @param autoCreate - 只在 layout 组件设为 true，其他组件默认 false 只读缓存
 * @example
 * ```tsx
 * // Layout 组件（负责创建）
 * const { walletId } = useCoboWallet({ userId, tradeAccountId, autoCreate: true })
 * 
 * // 其他组件（只读缓存）
 * const { walletId } = useCoboWallet({ userId, tradeAccountId })
 * ```
 */
export const useCoboWallet = ({ userId, tradeAccountId, enabled = true, autoCreate = false }: UseCoboWalletParams) => {
  // 🔥 初始化时立即检查缓存
  const [walletId, setWalletId] = useState<string>(() => {
    if (userId) {
      const cached = walletCache.get(userId)
      if (cached) {
        console.log('[Cobo Wallet] ✅ 使用缓存的钱包ID:', cached.walletId)
        return cached.walletId
      }
    }
    return ''
  })
  const [walletData, setWalletData] = useState<CoboWalletData | null>(() => {
    if (userId) {
      return walletCache.get(userId) || null
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrCreateWallet = useCallback(
    async (forceRefresh = false) => {
      // 🔥 必须有 userId 和 tradeAccountId 才能创建/获取钱包
      if (!enabled || !userId || !tradeAccountId) {
        return
      }

      // 🔥 优先使用缓存（除非强制刷新）
      if (!forceRefresh && walletCache.has(userId)) {
        const cached = walletCache.get(userId)!
        console.log('[Cobo Wallet] ✅ 使用缓存的钱包:', cached.walletId)
        setWalletData(cached)
        setWalletId(cached.walletId)
        return
      }

      // 🔥 如果不是 autoCreate 模式，只查询不创建
      if (!autoCreate) {
        console.log('[Cobo Wallet] 📖 只读模式，等待缓存...')
        return
      }

      // 🔥 防并发：如果已经有请求在进行中，等待它完成
      if (pendingRequest) {
        console.log('[Cobo Wallet] ⏳ 等待其他请求完成...')
        try {
          const result = await pendingRequest
          if (result) {
            setWalletData(result)
            setWalletId(result.walletId)
          }
        } catch (e) {
          // 忽略，让当前请求继续
        }
        return
      }

      setIsLoading(true)
      setError(null)

      // 🔥 创建新的请求 Promise
      pendingRequest = (async (): Promise<CoboWalletData | null> => {
        try {
          // 1. 先查询用户是否已有钱包
          const queryUrl = `${API_BASE_URL}/api/v1/wallet?userId=${userId}`

          console.log('[Cobo Wallet] Fetching wallet for user:', userId)

          const queryResponse = await fetch(queryUrl)

          if (queryResponse.ok) {
            const queryData = await queryResponse.json()
            console.log('[Cobo Wallet] 🔍 Query response:', queryData)

            if (queryData.success && queryData.data.walletId) {
              // 用户已有钱包
              const wallet: CoboWalletData = {
                walletId: queryData.data.walletId,
                walletName: queryData.data.walletName,
                walletType: queryData.data.walletType,
                isNew: false
              }

              // 🔥 存入缓存
              walletCache.set(userId, wallet)
              console.log('[Cobo Wallet] Existing wallet found:', wallet.walletId)
              return wallet
            }
          }

          // 2. 没有钱包，创建新钱包
          console.log('[Cobo Wallet] No wallet found, creating new one...')

          const createUrl = `${API_BASE_URL}/api/v1/wallet/create`
          const createResponse = await fetch(createUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId,
              // 钱包名称：wallet_ 前缀 + 交易账户ID
              walletName: `wallet_${tradeAccountId}`
            })
          })

          if (!createResponse.ok) {
            throw new Error(`Failed to create wallet: ${createResponse.statusText}`)
          }

          const createData = await createResponse.json()

          if (!createData.success) {
            throw new Error(createData.error || 'Failed to create wallet')
          }

          const wallet: CoboWalletData = {
            walletId: createData.data.walletId,
            walletName: createData.data.walletName,
            walletType: createData.data.walletType,
            isNew: true
          }

          // 🔥 存入缓存
          walletCache.set(userId, wallet)
          console.log('[Cobo Wallet] New wallet created:', wallet.walletId)
          return wallet
        } catch (err: any) {
          console.error('[Cobo Wallet] Error:', err)
          throw err
        }
      })()

      try {
        const wallet = await pendingRequest
        if (wallet) {
          setWalletData(wallet)
          setWalletId(wallet.walletId)
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to get or create wallet'
        setError(errorMsg)
      } finally {
        setIsLoading(false)
        pendingRequest = null  // 🔥 清除锁
      }
    },
    [userId, tradeAccountId, enabled, autoCreate]
  )

  useEffect(() => {
    if (enabled && userId && tradeAccountId) {
      fetchOrCreateWallet()
    }
  }, [enabled, userId, tradeAccountId, fetchOrCreateWallet])

  return {
    walletId,
    walletData,
    isLoading,
    error,
    refetch: () => fetchOrCreateWallet(true) // 强制刷新
  }
}

// 🔥 导出缓存操作函数
export const getCachedWalletId = (userId: string): string | null => {
  return walletCache.get(userId)?.walletId || null
}

export const setCachedWallet = (userId: string, wallet: CoboWalletData) => {
  walletCache.set(userId, wallet)
}

export const clearWalletCache = () => {
  walletCache.clear()
}
