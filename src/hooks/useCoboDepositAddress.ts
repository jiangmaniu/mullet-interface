import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { API_BASE_URL } from '@/constants/api'

interface UseCoboDepositAddressParams {
  userId: string
  chainId: 'ETH' | 'SOL' | 'TRON'
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
 */
export const useCoboDepositAddress = ({ 
  userId, 
  chainId, 
  walletId,
  enabled = true 
}: UseCoboDepositAddressParams) => {
  const [address, setAddress] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchAddress = useCallback(async () => {
    if (!enabled || !userId || !chainId || !walletId) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const url = `${API_BASE_URL}/api/v1/deposit/address?userId=${userId}&chainId=${chainId}&walletId=${walletId}`
      
      console.log('[Cobo] Fetching deposit address:', { userId, chainId, walletId, url })
      
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
      
      console.log('[Cobo] Deposit address received:', {
        address: addressData.address,
        isNew: addressData.isNew,
        chainId: addressData.chainId
      })

      if (addressData.isNew) {
        message.success(`新充值地址已创建: ${chainId}`)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch deposit address'
      setError(errorMsg)
      console.error('[Cobo] Error fetching deposit address:', err)
      message.error(`获取Cobo充值地址失败: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }, [userId, chainId, walletId, enabled])

  useEffect(() => {
    fetchAddress()
  }, [fetchAddress])

  return {
    address,
    isLoading,
    error,
    isNew,
    refetch: fetchAddress
  }
}
