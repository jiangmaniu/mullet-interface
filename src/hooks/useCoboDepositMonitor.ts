import { useState, useEffect, useCallback, useRef } from 'react'
import { message } from 'antd'
import { API_BASE_URL } from '@/constants/api'

interface UseCoboDepositMonitorParams {
  userId: string
  enabled?: boolean
  pollInterval?: number // 轮询间隔（毫秒），默认5秒
  onDepositDetected?: (deposit: CoboDeposit) => void
}

interface CoboDeposit {
  id: string
  userId: string
  transactionId: string
  chainId: string
  tokenId: string
  amount: string
  fromAddress: string
  toAddress: string
  status: 'pending' | 'confirming' | 'completed' | 'failed'
  confirmations: number
  txHash?: string
  createdAt: string
  completedAt?: string
}

/**
 * Cobo 充值监听 Hook
 * 轮询充值历史，检测新的充值到账
 */
export const useCoboDepositMonitor = ({ 
  userId, 
  enabled = true,
  pollInterval = 5000, // 默认5秒
  onDepositDetected
}: UseCoboDepositMonitorParams) => {
  const [deposits, setDeposits] = useState<CoboDeposit[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latestDeposit, setLatestDeposit] = useState<CoboDeposit | null>(null)
  
  // 记录已处理的充值ID，避免重复通知
  const processedDepositIds = useRef(new Set<string>())
  // 标记是否是首次加载（首次加载不触发通知）
  const isFirstLoad = useRef(true)

  const fetchDeposits = useCallback(async () => {
    if (!enabled || !userId) {
      return
    }

    try {
      const url = `${API_BASE_URL}/api/v1/deposit/history?userId=${userId}&limit=10`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch deposit history: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get deposit history')
      }

      const depositList: CoboDeposit[] = data.data.deposits
      
      setDeposits(depositList)
      
      // 首次加载时，将所有已完成的充值标记为已处理，但不触发通知
      if (isFirstLoad.current) {
        depositList
          .filter(deposit => deposit.status === 'completed')
          .forEach(deposit => {
            processedDepositIds.current.add(deposit.id)
          })
        isFirstLoad.current = false
        console.log('[Cobo] First load: marked', processedDepositIds.current.size, 'deposits as processed')
        setError(null)
        return
      }
      
      // 检测新的已完成充值（非首次加载）
      const newCompletedDeposits = depositList.filter(
        (deposit) => 
          deposit.status === 'completed' && 
          !processedDepositIds.current.has(deposit.id)
      )
      
      if (newCompletedDeposits.length > 0) {
        // 按时间排序，最新的在前
        newCompletedDeposits.sort((a, b) => 
          new Date(b.completedAt || b.createdAt).getTime() - 
          new Date(a.completedAt || a.createdAt).getTime()
        )
        
        const newest = newCompletedDeposits[0]
        setLatestDeposit(newest)
        
        // 标记为已处理
        newCompletedDeposits.forEach(deposit => {
          processedDepositIds.current.add(deposit.id)
        })
        
        // 通知回调
        if (onDepositDetected) {
          onDepositDetected(newest)
        }
        
        // 显示成功消息
        message.success(
          `充值成功！已到账 ${newest.amount} ${newest.tokenId} (${newest.chainId})`
        )
      }
      
      setError(null)
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch deposits'
      setError(errorMsg)
      console.error('[Cobo] Error fetching deposits:', err)
    }
  }, [userId, enabled, onDepositDetected])

  // 启动监听
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    isFirstLoad.current = true // 重置首次加载标志
    fetchDeposits()
  }, [fetchDeposits])

  // 停止监听
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    isFirstLoad.current = true // 停止时重置，下次启动时重新初始化
  }, [])

  // 自动轮询
  useEffect(() => {
    if (!isMonitoring || !enabled) return

    const interval = setInterval(() => {
      fetchDeposits()
    }, pollInterval)

    return () => clearInterval(interval)
  }, [isMonitoring, enabled, pollInterval, fetchDeposits])

  return {
    deposits,
    latestDeposit,
    isMonitoring,
    error,
    startMonitoring,
    stopMonitoring,
    refetch: fetchDeposits
  }
}
