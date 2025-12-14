import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '@/constants/api'

interface UseCoboWalletParams {
  userId: string
  enabled?: boolean
}

interface CoboWalletData {
  walletId: string
  walletName: string
  walletType: string
  isNew: boolean
}

/**
 * Cobo 钱包管理 Hook
 * 获取或创建用户的专属 Cobo 钱包
 * 
 * @example
 * ```tsx
 * const { walletId, isLoading } = useCoboWallet({ userId: user.id })
 * ```
 */
export const useCoboWallet = ({ 
  userId,
  enabled = true 
}: UseCoboWalletParams) => {
  const [walletId, setWalletId] = useState<string>('')
  const [walletData, setWalletData] = useState<CoboWalletData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrCreateWallet = useCallback(async () => {
    if (!enabled || !userId) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. 先查询用户是否已有钱包
      const queryUrl = `${API_BASE_URL}/api/v1/wallet?userId=${userId}`
      
      console.log('[Cobo Wallet] Fetching wallet for user:', userId)
      
      const queryResponse = await fetch(queryUrl)
      
      if (queryResponse.ok) {
        const queryData = await queryResponse.json()
        
        if (queryData.success && queryData.data.walletId) {
          // 用户已有钱包
          const wallet: CoboWalletData = {
            walletId: queryData.data.walletId,
            walletName: queryData.data.walletName,
            walletType: queryData.data.walletType,
            isNew: false
          }
          
          setWalletData(wallet)
          setWalletId(wallet.walletId)
          
          console.log('[Cobo Wallet] Existing wallet found:', wallet.walletId)
          return
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
          // 钱包名称：MW_ 前缀（Mullet Wallet）+ 完整 userId（去掉 did:privy: 前缀）
          walletName: `MW_${userId.replace('did:privy:', '')}`
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
      
      setWalletData(wallet)
      setWalletId(wallet.walletId)
      
      console.log('[Cobo Wallet] New wallet created:', wallet.walletId)
      
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to get or create wallet'
      setError(errorMsg)
      console.error('[Cobo Wallet] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId, enabled])

  useEffect(() => {
    if (enabled && userId) {
      fetchOrCreateWallet()
    }
  }, [enabled, userId, fetchOrCreateWallet])

  return {
    walletId,
    walletData,
    isLoading,
    error,
    refetch: fetchOrCreateWallet
  }
}
