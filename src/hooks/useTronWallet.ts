/**
 * TRON Wallet Hook
 * 自动检测并创建 TRON 钱包
 *
 * 使用场景:
 * 1. 登录后自动创建 (email/phone 用户)
 * 2. 在充值/转账对话框中使用
 */

import { useState, useEffect, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { ensureTronWallet, getTronWalletFromUser } from '@/services/tronWalletService'

interface UseTronWalletResult {
  tronAddress: string | null
  tronWalletId: string | null
  tronPublicKey: string | null
  isCreating: boolean
  error: string | null
  createWallet: () => Promise<void>
  refetch: () => void
}

/**
 * TRON 钱包管理 Hook
 *
 * 功能:
 * - 自动检测用户是否有 TRON 钱包
 * - 如果没有，自动创建
 * - 提供手动创建方法
 * - 提供刷新方法
 */
export function useTronWallet(autoCreate: boolean = true): UseTronWalletResult {
  const { user, authenticated, ready } = usePrivy()

  const [tronAddress, setTronAddress] = useState<string | null>(null)
  const [tronWalletId, setTronWalletId] = useState<string | null>(null)
  const [tronPublicKey, setTronPublicKey] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldCheck, setShouldCheck] = useState(0) // 用于触发重新检查

  // 从 Privy user 对象获取 TRON 钱包信息
  const updateFromUser = useCallback(() => {
    if (!user) {
      setTronAddress(null)
      setTronWalletId(null)
      setTronPublicKey(null)
      return false
    }

    const tronWallet = getTronWalletFromUser(user)

    if (tronWallet) {
      setTronAddress(tronWallet.address)
      setTronWalletId(tronWallet.walletId)
      setTronPublicKey(tronWallet.publicKey)
      return true
    }

    return false
  }, [user])

  // 创建钱包的方法
  const createWallet = useCallback(async () => {
    if (!authenticated || !ready) {
      console.log('[useTronWallet] Not authenticated or not ready')
      return
    }

    if (isCreating) {
      console.log('[useTronWallet] Already creating wallet')
      return
    }

    try {
      setIsCreating(true)
      setError(null)

      console.log('[useTronWallet] Starting TRON wallet creation...')

      const result = await ensureTronWallet()

      if (result) {
        console.log('[useTronWallet] ✅ TRON wallet ready:', result.address)
        setTronAddress(result.address)
        setTronWalletId(result.walletId)
        setTronPublicKey(result.publicKey)
      } else {
        // 钱包已存在，触发刷新
        console.log('[useTronWallet] Wallet exists, refreshing user data...')
        setShouldCheck((prev) => prev + 1)
      }
    } catch (err: any) {
      console.error('[useTronWallet] Failed to create wallet:', err)
      setError(err.message || 'Failed to create TRON wallet')
    } finally {
      setIsCreating(false)
    }
  }, [authenticated, ready, isCreating])

  // 刷新钱包信息
  const refetch = useCallback(() => {
    setShouldCheck((prev) => prev + 1)
  }, [])

  // 自动检测和创建
  useEffect(() => {
    if (!authenticated || !ready) {
      return
    }

    // 先尝试从 user 对象获取
    const hasWallet = updateFromUser()

    if (hasWallet) {
      console.log('[useTronWallet] Found existing TRON wallet in user data')
      return
    }

    // 如果没有且启用了自动创建
    if (autoCreate && !isCreating) {
      console.log('[useTronWallet] No TRON wallet found, will attempt auto-creation...')

      // 延迟 2 秒，让 Privy 有时间同步用户数据
      const timer = setTimeout(() => {
        // 再次检查，确保不是因为数据未同步
        const hasWalletNow = updateFromUser()
        if (!hasWalletNow) {
          console.log('[useTronWallet] Still no wallet after delay, creating now...')
          createWallet()
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [authenticated, ready, autoCreate, isCreating, shouldCheck, updateFromUser, createWallet])

  return {
    tronAddress,
    tronWalletId,
    tronPublicKey,
    isCreating,
    error,
    createWallet,
    refetch
  }
}
