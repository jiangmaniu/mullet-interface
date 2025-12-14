import { useState, useEffect, useCallback, useRef } from 'react'
import { message } from 'antd'
import { API_BASE_URL } from '@/constants/api'

interface UseCoboDepositMonitorParams {
  depositAddress?: string // 充值地址（可选，用于过滤特定地址的充值）
  walletIds?: string[]    // 钱包ID列表（可选）
  enabled?: boolean
  pollInterval?: number   // 轮询间隔（毫秒），默认10秒
  onDepositDetected?: (deposit: CoboTransaction) => void
  onDepositConfirming?: (deposit: CoboTransaction) => void // 确认中的回调
}

interface CoboTransaction {
  transaction_id: string
  wallet_id: string
  type: 'Deposit' | 'Withdraw'
  status: 'Confirming' | 'Completed' | 'Failed' | 'Pending'
  chain_id: string
  token_id: string
  destination: {
    address: string
    amount: string
  }
  source?: {
    addresses: string[]
  }
  confirmed_num: number
  confirming_threshold: number
  transaction_hash?: string
  created_timestamp: number
  updated_timestamp: number
  timeline?: Array<{
    status: string
    finished: boolean
    finished_timestamp: number
  }>
}

// 用于兼容旧接口
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
 * 轮询充值交易状态，显示确认进度和完成状态
 * 
 * @example
 * ```tsx
 * const { transactions, latestDeposit, isMonitoring, startMonitoring } = useCoboDepositMonitor({
 *   depositAddress: '0x24efee3c958a288f4ec0fb6b771112ee334b290d',
 *   onDepositConfirming: (tx) => {
 *     // 显示确认进度: tx.confirmed_num / tx.confirming_threshold
 *     console.log(`确认中: ${tx.confirmed_num}/${tx.confirming_threshold}`)
 *   },
 *   onDepositDetected: (tx) => {
 *     console.log('充值成功!', tx.destination.amount)
 *   }
 * })
 * ```
 */
export const useCoboDepositMonitor = ({ 
  depositAddress,
  walletIds,
  enabled = true,
  pollInterval = 10000, // 默认10秒
  onDepositDetected,
  onDepositConfirming
}: UseCoboDepositMonitorParams) => {
  const [transactions, setTransactions] = useState<CoboTransaction[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latestDeposit, setLatestDeposit] = useState<CoboTransaction | null>(null)
  const [confirmingDeposit, setConfirmingDeposit] = useState<CoboTransaction | null>(null)
  
  // 记录已处理的充值ID，避免重复通知
  const processedDepositIds = useRef(new Set<string>())
  // 记录正在确认中的交易ID及其确认数
  const confirmingTxs = useRef(new Map<string, number>())
  // 标记是否是首次加载（首次加载不触发通知）
  const isFirstLoad = useRef(true)

  const fetchTransactions = useCallback(async () => {
    if (!enabled) {
      return
    }

    // 至少需要充值地址或钱包ID之一
    if (!depositAddress && (!walletIds || walletIds.length === 0)) {
      return
    }

    try {
      // 构建查询参数
      const params = new URLSearchParams()
      params.append('types', 'Deposit')
      params.append('statuses', 'Confirming,Completed')
      params.append('limit', '10')
      
      if (depositAddress) {
        params.append('addresses', depositAddress)
      }
      if (walletIds && walletIds.length > 0) {
        params.append('walletIds', walletIds.join(','))
      }

      const url = `${API_BASE_URL}/api/v1/transactions?${params.toString()}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get transactions')
      }

      const txList: CoboTransaction[] = result.data.data || []
      
      setTransactions(txList)
      
      // 首次加载时，将所有已完成的交易标记为已处理，但不触发通知
      if (isFirstLoad.current) {
        txList
          .filter(tx => tx.status === 'Completed')
          .forEach(tx => {
            processedDepositIds.current.add(tx.transaction_id)
          })
        
        // 记录正在确认中的交易
        txList
          .filter(tx => tx.status === 'Confirming')
          .forEach(tx => {
            confirmingTxs.current.set(tx.transaction_id, tx.confirmed_num)
          })
        
        isFirstLoad.current = false
        console.log('[Cobo] First load:', {
          completed: processedDepositIds.current.size,
          confirming: confirmingTxs.current.size
        })
        setError(null)
        return
      }
      
      // 检测确认中的交易进度变化
      txList
        .filter(tx => tx.status === 'Confirming')
        .forEach(tx => {
          const previousConfirms = confirmingTxs.current.get(tx.transaction_id)
          const currentConfirms = tx.confirmed_num
          
          // 确认数增加了，触发回调
          if (previousConfirms !== undefined && currentConfirms > previousConfirms) {
            console.log(`[Cobo] 确认进度更新: ${tx.transaction_id} (${currentConfirms}/${tx.confirming_threshold})`)
            setConfirmingDeposit(tx)
            if (onDepositConfirming) {
              onDepositConfirming(tx)
            }
          }
          
          // 更新记录
          confirmingTxs.current.set(tx.transaction_id, currentConfirms)
        })
      
      // 检测新的已完成充值（非首次加载）
      const newCompletedDeposits = txList.filter(
        (tx) => 
          tx.status === 'Completed' && 
          !processedDepositIds.current.has(tx.transaction_id)
      )
      
      if (newCompletedDeposits.length > 0) {
        // 按时间排序，最新的在前
        newCompletedDeposits.sort((a, b) => b.created_timestamp - a.created_timestamp)
        
        const newest = newCompletedDeposits[0]
        setLatestDeposit(newest)
        
        // 从确认中列表移除
        confirmingTxs.current.delete(newest.transaction_id)
        
        // 标记为已处理
        newCompletedDeposits.forEach(tx => {
          processedDepositIds.current.add(tx.transaction_id)
        })
        
        // 通知回调
        if (onDepositDetected) {
          onDepositDetected(newest)
        }
        
        // 显示成功消息
        message.success(
          `✅ 充值成功！${newest.destination.amount} ${newest.token_id}`
        )
      }
      
      setError(null)
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch transactions'
      setError(errorMsg)
      console.error('[Cobo] Error fetching transactions:', err)
    }
  }, [depositAddress, walletIds, enabled, onDepositDetected, onDepositConfirming])

  // 启动监听
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    isFirstLoad.current = true // 重置首次加载标志
    fetchTransactions()
  }, [fetchTransactions])

  // 停止监听
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    isFirstLoad.current = true // 停止时重置，下次启动时重新初始化
    confirmingTxs.current.clear() // 清除确认中的交易记录
  }, [])

  // 自动轮询
  useEffect(() => {
    if (!isMonitoring || !enabled) return

    const interval = setInterval(() => {
      fetchTransactions()
    }, pollInterval)

    return () => clearInterval(interval)
  }, [isMonitoring, enabled, pollInterval, fetchTransactions])

  return {
    transactions,        // 所有交易列表
    deposits: transactions, // 兼容旧版本（别名）
    latestDeposit,      // 最新完成的充值
    confirmingDeposit,  // 当前确认中的充值
    isMonitoring,
    error,
    startMonitoring,
    stopMonitoring,
    refetch: fetchTransactions,
    // 辅助方法：获取确认进度文本
    getConfirmationProgress: (tx: CoboTransaction) => 
      `${tx.confirmed_num}/${tx.confirming_threshold}`,
    // 辅助方法：获取确认百分比
    getConfirmationPercentage: (tx: CoboTransaction) => 
      Math.round((tx.confirmed_num / tx.confirming_threshold) * 100)
  }
}
