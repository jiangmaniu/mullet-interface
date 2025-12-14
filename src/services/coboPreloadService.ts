/**
 * Cobo 充值地址预加载服务
 * 在用户登录后自动预加载所有链的充值地址
 */

import { API_BASE_URL } from '@/constants/api'
import { SUPPORTED_BRIDGE_CHAINS } from '@/config/lifiConfig'

interface PreloadResult {
  chainId: string
  address: string | null
  error: string | null
  isNew: boolean
}

/**
 * 预加载所有 Cobo 链的充值地址
 * @param userId 用户 ID
 * @param walletId Cobo 钱包 ID
 * @returns Promise<PreloadResult[]>
 */
export const preloadCoboDepositAddresses = async (
  userId: string,
  walletId: string
): Promise<PreloadResult[]> => {
  if (!userId || !walletId) {
    console.warn('[Cobo Preload] Missing userId or walletId')
    return []
  }

  console.log('[Cobo Preload] 开始预加载所有充值地址...', { userId, walletId })

  // 获取所有 Cobo 链
  const coboChains = SUPPORTED_BRIDGE_CHAINS.filter(chain => chain.type === 'cobo')
  
  console.log('[Cobo Preload] 找到', coboChains.length, '条链需要预加载')

  // 并发请求所有链的充值地址
  const results = await Promise.allSettled(
    coboChains.map(async (chain) => {
      try {
        const url = `${API_BASE_URL}/api/v1/deposit/address?userId=${userId}&chainId=${chain.id}&walletId=${walletId}`
        
        console.log(`[Cobo Preload] 获取 ${chain.displayName} 充值地址...`)
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to get deposit address')
        }

        console.log(`[Cobo Preload] ✅ ${chain.displayName} 地址已获取:`, data.data.address.slice(0, 8) + '...')

        return {
          chainId: chain.id,
          address: data.data.address,
          error: null,
          isNew: data.data.isNew
        }
      } catch (error: any) {
        console.error(`[Cobo Preload] ❌ ${chain.displayName} 获取失败:`, error.message)
        return {
          chainId: chain.id,
          address: null,
          error: error.message,
          isNew: false
        }
      }
    })
  )

  // 统计结果
  const preloadResults: PreloadResult[] = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return {
        chainId: coboChains[index].id,
        address: null,
        error: result.reason?.message || 'Unknown error',
        isNew: false
      }
    }
  })

  const successCount = preloadResults.filter(r => r.address !== null).length
  const failCount = preloadResults.filter(r => r.address === null).length
  const newAddressCount = preloadResults.filter(r => r.isNew).length

  console.log(`[Cobo Preload] 预加载完成: ${successCount} 成功, ${failCount} 失败, ${newAddressCount} 新创建`)

  return preloadResults
}

/**
 * 单独预加载某条链的充值地址
 * @param userId 用户 ID
 * @param walletId Cobo 钱包 ID
 * @param chainId 链 ID
 */
export const preloadSingleChainAddress = async (
  userId: string,
  walletId: string,
  chainId: string
): Promise<PreloadResult> => {
  try {
    const url = `${API_BASE_URL}/api/v1/deposit/address?userId=${userId}&chainId=${chainId}&walletId=${walletId}`
    
    console.log(`[Cobo Preload] 预加载单个链 ${chainId}...`)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get deposit address')
    }

    console.log(`[Cobo Preload] ✅ ${chainId} 地址已获取`)

    return {
      chainId,
      address: data.data.address,
      error: null,
      isNew: data.data.isNew
    }
  } catch (error: any) {
    console.error(`[Cobo Preload] ❌ ${chainId} 获取失败:`, error.message)
    return {
      chainId,
      address: null,
      error: error.message,
      isNew: false
    }
  }
}
