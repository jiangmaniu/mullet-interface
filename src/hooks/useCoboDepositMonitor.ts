import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from '@/libs/ui/components/toast'
import { API_BASE_URL } from '@/constants/api'
import { t } from '@/libs/lingui/react/macro'

interface UseCoboDepositMonitorParams {
  depositAddress?: string // 充值地址（可选，用于过滤特定地址的充值）
  walletIds?: string[] // 钱包ID列表（可选）
  enabled?: boolean
  pollInterval?: number // 轮询间隔（毫秒），默认10秒
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
      console.log('[Cobo] fetchTransactions skipped: enabled=false')
      return
    }

    // 至少需要充值地址或钱包ID之一
    if (!depositAddress && (!walletIds || walletIds.length === 0)) {
      console.log('[Cobo] fetchTransactions skipped: no address or walletIds')
      return
    }

    console.log('[Cobo] 🔄 fetchTransactions called', {
      enabled,
      isMonitoring,
      depositAddress,
      walletIds,
      timestamp: new Date().toISOString()
    })

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

      console.log('[Cobo] 📡 Fetching:', url)

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
          .filter((tx) => tx.status === 'Completed')
          .forEach((tx) => {
            processedDepositIds.current.add(tx.transaction_id)
          })

        // 记录正在确认中的交易
        txList
          .filter((tx) => tx.status === 'Confirming')
          .forEach((tx) => {
            confirmingTxs.current.set(tx.transaction_id, tx.confirmed_num)
          })

        isFirstLoad.current = false
        console.log('[Cobo] First load:', {
          completed: processedDepositIds.current.size,
          confirming: confirmingTxs.current.size
        })

        // 首次加载也要设置确认中的交易（显示进度条）
        const confirmingTxList = txList.filter((tx) => tx.status === 'Confirming')
        if (confirmingTxList.length > 0) {
          setConfirmingDeposit(confirmingTxList[0])
        }

        setError(null)
        return
      }

      // 检测确认中的交易
      const confirmingTxList = txList.filter((tx) => tx.status === 'Confirming')

      // 设置当前确认中的交易（最新的一笔）
      if (confirmingTxList.length > 0) {
        const latestConfirming = confirmingTxList[0]
        setConfirmingDeposit(latestConfirming)

        // 检测进度变化并触发回调
        const previousConfirms = confirmingTxs.current.get(latestConfirming.transaction_id)
        const currentConfirms = latestConfirming.confirmed_num

        if (previousConfirms !== undefined && currentConfirms > previousConfirms) {
          console.log(
            `[Cobo] 确认进度更新: ${latestConfirming.transaction_id} (${currentConfirms}/${latestConfirming.confirming_threshold})`
          )
          if (onDepositConfirming) {
            onDepositConfirming(latestConfirming)
          }
        }

        // 更新所有确认中交易的记录
        confirmingTxList.forEach((tx) => {
          confirmingTxs.current.set(tx.transaction_id, tx.confirmed_num)
        })
      } else {
        // 没有确认中的交易，清空状态
        setConfirmingDeposit(null)
      }

      // 检测新的已完成充值（非首次加载）
      const newCompletedDeposits = txList.filter((tx) => tx.status === 'Completed' && !processedDepositIds.current.has(tx.transaction_id))

      if (newCompletedDeposits.length > 0) {
        // 按时间排序，最新的在前
        newCompletedDeposits.sort((a, b) => b.created_timestamp - a.created_timestamp)

        const newest = newCompletedDeposits[0]
        setLatestDeposit(newest)

        // 从确认中列表移除
        confirmingTxs.current.delete(newest.transaction_id)

        // 标记为已处理
        newCompletedDeposits.forEach((tx) => {
          processedDepositIds.current.add(tx.transaction_id)
        })

        // 通知回调
        if (onDepositDetected) {
          onDepositDetected(newest)
        }

        // 显示成功消息
        toast.success(t(`✅ 充值成功！${newest.destination.amount} ${newest.token_id}`))
      }

      setError(null)
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch transactions'
      setError(errorMsg)
      console.error('[Cobo] Error fetching transactions:', err)
    }
  }, [depositAddress, walletIds, enabled, onDepositDetected, onDepositConfirming])

  // 用 ref 存储 timeout ID
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 启动监听
  const startMonitoring = useCallback(() => {
    console.log('[Cobo] ▶️ startMonitoring called')
    setIsMonitoring(true)
    isFirstLoad.current = true
  }, [])

  // 停止监听
  const stopMonitoring = useCallback(() => {
    console.log('[Cobo] ⏹️ stopMonitoring called')
    setIsMonitoring(false)
    isFirstLoad.current = true
    confirmingTxs.current.clear()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // 轮询逻辑：fetch 完成后等 pollInterval 再 fetch
  useEffect(() => {
    if (!isMonitoring || !enabled) {
      return
    }

    let cancelled = false

    const poll = async () => {
      if (cancelled) return

      console.log('[Cobo] 🔄 Polling...')
      await fetchTransactions()

      if (cancelled) return

      // fetch 完成后等 pollInterval 再下一次
      console.log('[Cobo] ⏰ Waiting', pollInterval, 'ms for next poll')
      timeoutRef.current = setTimeout(poll, pollInterval)
    }

    // 立即开始第一次
    poll()

    return () => {
      console.log('[Cobo] 🛑 Stopping poll')
      cancelled = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMonitoring, enabled, pollInterval]) // 不依赖 fetchTransactions

  // enabled 变为 false 时自动停止监听
  useEffect(() => {
    if (!enabled && isMonitoring) {
      console.log('[Cobo] Auto-stopping monitoring because enabled=false')
      setIsMonitoring(false)
      isFirstLoad.current = true
      confirmingTxs.current.clear()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [enabled, isMonitoring])

  return {
    transactions, // 所有交易列表
    deposits: transactions, // 兼容旧版本（别名）
    latestDeposit, // 最新完成的充值
    confirmingDeposit, // 当前确认中的充值
    isMonitoring,
    error,
    startMonitoring,
    stopMonitoring,
    refetch: fetchTransactions,
    // 辅助方法：获取确认进度文本
    getConfirmationProgress: (tx: CoboTransaction) => `${tx.confirmed_num}/${tx.confirming_threshold}`,
    // 辅助方法：获取确认百分比
    getConfirmationPercentage: (tx: CoboTransaction) => Math.round((tx.confirmed_num / tx.confirming_threshold) * 100)
  }
}
