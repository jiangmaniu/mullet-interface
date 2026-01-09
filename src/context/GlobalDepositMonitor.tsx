/**
 * Global Deposit Monitor Context
 * 全局充值监听 - 在主页面持续监听所有钱包的充值
 *
 * 🔥 实时检测链上余额变化（和 TransferCryptoDialog 逻辑一致）
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useStores } from '@/context/mobxProvider'
import { useServerWalletsContext } from '@/context/ServerWalletsProvider'
import { message } from 'antd'
import { API_BASE_URL } from '@/constants/api'
import type { SupportedChain } from '@/services/serverWalletService'

interface DepositEvent {
  amount: string
  token: string
  chain: string
  txHash?: string
  rawAmount?: string
  address?: string
  timestamp: string
}

interface GlobalDepositMonitorContextValue {
  latestDeposit: DepositEvent | null
  depositHistory: DepositEvent[]
  isMonitoring: boolean
  clearDeposit: () => void
}

// 监听的链
const MONITORED_CHAINS: SupportedChain[] = ['solana', 'ethereum', 'tron', 'arbitrum', 'bsc']

const GlobalDepositMonitorContext = createContext<GlobalDepositMonitorContextValue | null>(null)

export function GlobalDepositMonitorProvider({ children }: { children: React.ReactNode }) {
  const { authenticated, ready, getAccessToken } = usePrivy()
  const { trade } = useStores()
  const tradeAccountId = trade.currentAccountInfo?.id
  const { wallets, isAllLoaded } = useServerWalletsContext()

  const [latestDeposit, setLatestDeposit] = useState<DepositEvent | null>(null)
  const [depositHistory, setDepositHistory] = useState<DepositEvent[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const processedDepositsRef = useRef<Set<string>>(new Set()) // 防止重复通知

  // 清除最新充值通知
  const clearDeposit = useCallback(() => {
    setLatestDeposit(null)
  }, [])

  // 检查单个链的充值（和 useDepositListenerV2 逻辑一致）
  const checkChainDeposits = useCallback(
    async (chain: string, address: string) => {
      if (!address) {
        return []
      }

      try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${API_BASE_URL}/api/deposit-monitor/check/${chain.toLowerCase()}/${address}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          },
          signal: abortControllerRef.current?.signal
        })

        if (!response.ok) {
          console.error(`[GlobalDepositMonitor] API error for ${chain}/${address}:`, response.status)
          return []
        }

        const data = await response.json()

        if (data.success && data.deposits && data.deposits.length > 0) {
          console.log(`[GlobalDepositMonitor] ✅ 发现 ${chain} 充值:`, data.deposits)
          return data.deposits.map((d: any) => ({
            amount: d.amount,
            token: d.token,
            chain: d.chain,
            txHash: d.txHash,
            rawAmount: d.rawAmount,
            address: d.address,
            timestamp: d.timestamp
          }))
        }

        return []
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(`[GlobalDepositMonitor] Error checking ${chain}:`, err)
        }
        return []
      }
    },
    [getAccessToken]
  )

  // 检查所有链的充值
  const checkAllDeposits = useCallback(async () => {
    if (!authenticated || !tradeAccountId || !isAllLoaded) {
      return
    }

    const allDeposits: DepositEvent[] = []

    // 并行检查所有链
    const promises = MONITORED_CHAINS.map(async (chain) => {
      const wallet = wallets[chain]
      if (wallet.status === 'success' && wallet.address) {
        return checkChainDeposits(chain, wallet.address)
      }
      return []
    })

    const results = await Promise.allSettled(promises)

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allDeposits.push(...result.value)
      }
    })

    // 处理检测到的充值
    if (allDeposits.length > 0) {
      allDeposits.forEach((depositEvent) => {
        // 使用 txHash + timestamp 作为唯一标识，防止重复通知
        const depositKey = `${depositEvent.txHash || 'notx'}_${depositEvent.timestamp}`

        if (!processedDepositsRef.current.has(depositKey)) {
          processedDepositsRef.current.add(depositKey)

          console.log('[GlobalDepositMonitor] 🎉 检测到新充值:', depositEvent)

          // 更新最新充值
          setLatestDeposit(depositEvent)

          // 添加到历史记录
          setDepositHistory((prev) => {
            const exists = prev.some((d) => d.timestamp === depositEvent.timestamp && d.txHash === depositEvent.txHash)
            if (!exists) {
              return [depositEvent, ...prev].slice(0, 20) // 保留最近20条
            }
            return prev
          })

          // 显示通知
          message.success({
            content: `🎉 充值到账: ${depositEvent.amount} ${depositEvent.token} (${depositEvent.chain})`,
            duration: 5
          })
        }
      })
    }
  }, [authenticated, tradeAccountId, isAllLoaded, wallets, checkChainDeposits])

  // 启动监听
  useEffect(() => {
    if (!authenticated || !ready || !tradeAccountId || !isAllLoaded) {
      setIsMonitoring(false)
      return
    }

    console.log('[GlobalDepositMonitor] 🚀 启动全局充值监听 (tradeAccountId:', tradeAccountId, ')')
    setIsMonitoring(true)
    abortControllerRef.current = new AbortController()

    // 立即检查一次
    checkAllDeposits()

    // 每 15 秒检查一次（减少 API 压力）
    const interval = setInterval(() => {
      checkAllDeposits()
    }, 10000)

    return () => {
      clearInterval(interval)
      abortControllerRef.current?.abort()
      setIsMonitoring(false)
      console.log('[GlobalDepositMonitor] ⏹️ 停止全局充值监听')
    }
  }, [authenticated, ready, tradeAccountId, isAllLoaded, checkAllDeposits])

  // 当切换账户时清空历史记录和已处理记录
  useEffect(() => {
    setDepositHistory([])
    setLatestDeposit(null)
    processedDepositsRef.current.clear()
    console.log('[GlobalDepositMonitor] 🔄 账户切换，重置状态')
  }, [tradeAccountId])

  return (
    <GlobalDepositMonitorContext.Provider
      value={{
        latestDeposit,
        depositHistory,
        isMonitoring,
        clearDeposit
      }}
    >
      {children}
    </GlobalDepositMonitorContext.Provider>
  )
}

// Hook for consuming the context
export function useGlobalDepositMonitor() {
  const context = useContext(GlobalDepositMonitorContext)
  if (!context) {
    throw new Error('useGlobalDepositMonitor must be used within GlobalDepositMonitorProvider')
  }
  return context
}
