import { useState, useEffect, useCallback } from 'react'
import { toast } from '@/libs/ui/components/toast'
import { API_BASE_URL } from '@/constants/api'
import { getCachedDepositAddress, setCachedDepositAddress } from '@/services/coboPreloadService'
import { t } from '@/libs/lingui/react/macro'

interface UseCoboDepositAddressParams {
  userId?: string // 可选，兼容旧代码
  tradeAccountId?: string | number // 交易账户ID（推荐使用）
  chainId: 'ETH' | 'SOL' | 'TRON' | 'ARBITRUM_ETH' | 'BASE_ETH' | 'MATIC' | 'BSC_BNB' | 'HYPE' | 'HYPEREVM_HYPE'
  walletId: string
  enabled?: boolean
}

interface CoboDepositAddressData {
  address: string
  chainId: string
  isNew: boolean
}

/**
 * Cobo 充值地址管理 Hook
 * 获取用户在指定链上的专属充值地址
 * 优先使用预加载缓存
 */
export const useCoboDepositAddress = ({ userId, tradeAccountId, chainId, walletId, enabled = true }: UseCoboDepositAddressParams) => {
  // 🔥 优先使用 tradeAccountId，兼容 userId
  const effectiveUserId = tradeAccountId?.toString() || userId || ''

  const [address, setAddress] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchAddress = useCallback(
    async (forceRefresh = false) => {
      if (!enabled || !effectiveUserId || !chainId || !walletId) {
        return
      }

      // 🔥 优先使用预加载缓存（除非强制刷新）
      if (!forceRefresh) {
        const cached = getCachedDepositAddress(chainId)
        if (cached) {
          console.log('[Cobo] ✅ 使用预加载的充值地址:', chainId, cached.address.slice(0, 8) + '...')
          setAddress(cached.address)
          setIsNew(cached.isNew)
          return
        }
      }

      setIsLoading(true)
      setError(null)

      try {
        const url = `${API_BASE_URL}/api/v1/deposit/address?userId=${effectiveUserId}&chainId=${chainId}&walletId=${walletId}`

        console.log('[Cobo] Fetching deposit address:', { userId: effectiveUserId, chainId, walletId, url })

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch deposit address: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to get deposit address')
        }

        const addressData: CoboDepositAddressData = data.data

        setAddress(addressData.address)
        setIsNew(addressData.isNew)

        // 🔥 存入缓存
        setCachedDepositAddress(chainId, addressData.address, addressData.isNew)

        console.log('[Cobo] Deposit address received:', {
          address: addressData.address,
          isNew: addressData.isNew,
          chainId: addressData.chainId
        })

        if (addressData.isNew) {
          toast.success(t(`新充值地址已创建: ${chainId}`))
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to fetch deposit address'
        setError(errorMsg)
        console.error('[Cobo] Error fetching deposit address:', err)
        toast.error(t(`获取Cobo充值地址失败: ${errorMsg}`))
      } finally {
        setIsLoading(false)
      }
    },
    [effectiveUserId, chainId, walletId, enabled]
  )

  useEffect(() => {
    fetchAddress()
  }, [fetchAddress])

  return {
    address,
    isLoading,
    error,
    isNew,
    refetch: () => fetchAddress(true) // 强制刷新
  }
}
