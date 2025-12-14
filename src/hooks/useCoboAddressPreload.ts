/**
 * Cobo 充值地址预加载 Hook
 * 在用户登录后自动预加载所有链的充值地址
 */

import { useEffect, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useCoboWallet } from './useCoboWallet'
import { preloadCoboDepositAddresses } from '@/services/coboPreloadService'

/**
 * 在用户登录后自动预加载所有 Cobo 充值地址
 */
export const useCoboAddressPreload = () => {
  const { user, authenticated } = usePrivy()
  const hasPreloadedRef = useRef(false)

  // 获取 Cobo 钱包
  const { 
    walletId: coboWalletId, 
    isLoading: coboWalletLoading 
  } = useCoboWallet({
    userId: user?.id || '',
    enabled: authenticated && !!user?.id
  })

  useEffect(() => {
    // 只在以下条件都满足时才预加载：
    // 1. 用户已登录
    // 2. 有用户 ID
    // 3. Cobo 钱包已创建
    // 4. 尚未预加载过（防止重复）
    if (
      authenticated && 
      user?.id && 
      coboWalletId && 
      !coboWalletLoading &&
      !hasPreloadedRef.current
    ) {
      hasPreloadedRef.current = true

      console.log('[Cobo Preload Hook] 触发自动预加载...')

      // 延迟 500ms 执行，避免阻塞登录流程
      const timer = setTimeout(() => {
        preloadCoboDepositAddresses(user.id, coboWalletId)
          .then((results) => {
            const successCount = results.filter(r => r.address !== null).length
            console.log(`[Cobo Preload Hook] ✅ 预加载完成: ${successCount}/${results.length} 条链`)
          })
          .catch((error) => {
            console.error('[Cobo Preload Hook] ❌ 预加载失败:', error)
          })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [authenticated, user?.id, coboWalletId, coboWalletLoading])

  // 重置预加载标志（当用户登出时）
  useEffect(() => {
    if (!authenticated) {
      hasPreloadedRef.current = false
    }
  }, [authenticated])
}
