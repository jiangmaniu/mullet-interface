'use client'

import { useCluster } from '@/pages/web3Demo/context/clusterProvider'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getCounterProgramId, useProgram } from '../../hooks/useProgram'
import { useTransactionToast } from '../../hooks/useTransactionToast'

export function useCounterProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const programId = useMemo(() => getCounterProgramId(cluster.network as Cluster), [cluster])
  const { program } = useProgram()

  const [accounts, setAccounts] = useState<any[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [accountsError, setAccountsError] = useState<Error | null>(null)

  const [programAccount, setProgramAccount] = useState<any>(null)
  const [programAccountLoading, setProgramAccountLoading] = useState(false)
  const [programAccountError, setProgramAccountError] = useState<Error | null>(null)

  const [initializeLoading, setInitializeLoading] = useState(false)
  const [initializeError, setInitializeError] = useState<Error | null>(null)

  // 获取counter列表
  const fetchAccounts = useCallback(async () => {
    try {
      setAccountsLoading(true)
      const result = await program.account.counter.all()
      console.log('fetchAccounts result', result)
      setAccounts(result)
      setAccountsError(null)
    } catch (err) {
      setAccountsError(err instanceof Error ? err : new Error('Failed to fetch accounts'))
    } finally {
      setAccountsLoading(false)
    }
  }, [program])

  // 获取程序账户信息，加载的时候需要判断是否存在 programId
  const fetchProgramAccount = useCallback(async () => {
    try {
      setProgramAccountLoading(true)
      const result = await connection.getParsedAccountInfo(programId)
      console.log('fetchProgramAccount result', result)
      setProgramAccount(result)
      setProgramAccountError(null)
    } catch (err) {
      setProgramAccountError(err instanceof Error ? err : new Error('Failed to fetch program account'))
    } finally {
      setProgramAccountLoading(false)
    }
  }, [connection, programId])

  // 创建新账户
  const initialize = useCallback(
    async (keypair: Keypair) => {
      try {
        setInitializeLoading(true)
        const signature = await program.methods.initialize().accounts({ counter: keypair.publicKey }).signers([keypair]).rpc()

        transactionToast(signature)
        await fetchAccounts()
        return signature
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize account')
        setInitializeError(error)
        toast.error('Failed to initialize account')
        throw error
      } finally {
        setInitializeLoading(false)
      }
    },
    [program, fetchAccounts, transactionToast]
  )

  useEffect(() => {
    fetchAccounts()
    fetchProgramAccount()
  }, [fetchAccounts, fetchProgramAccount])

  return {
    program,
    programId,
    accounts: {
      data: accounts,
      isLoading: accountsLoading,
      error: accountsError,
      refetch: fetchAccounts
    },
    getProgramAccount: {
      data: programAccount,
      isLoading: programAccountLoading,
      error: programAccountError,
      refetch: fetchProgramAccount
    },
    initialize: {
      mutate: initialize,
      isLoading: initializeLoading,
      error: initializeError
    }
  }
}

export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCounterProgram()

  const [accountData, setAccountData] = useState<any>(null)
  const [accountLoading, setAccountLoading] = useState(false)
  const [accountError, setAccountError] = useState<Error | null>(null)

  const [closeLoading, setCloseLoading] = useState(false)
  const [closeError, setCloseError] = useState<Error | null>(null)

  const [decrementLoading, setDecrementLoading] = useState(false)
  const [decrementError, setDecrementError] = useState<Error | null>(null)

  const [incrementLoading, setIncrementLoading] = useState(false)
  const [incrementError, setIncrementError] = useState<Error | null>(null)

  const [setLoading, setSetLoading] = useState(false)
  const [setError, setSetError] = useState<Error | null>(null)

  // 获取counter账户的数值
  const fetchAccount = useCallback(async () => {
    try {
      setAccountLoading(true)

      const result = await program.account.counter.fetch(account)
      console.log('fetchAccount result', result)
      setAccountData(result)
      setAccountError(null)
    } catch (err) {
      setAccountError(err instanceof Error ? err : new Error('Failed to fetch account'))
    } finally {
      setAccountLoading(false)
    }
  }, [program, account])

  // 删除counter item
  const close = useCallback(async () => {
    try {
      setCloseLoading(true)
      const tx = await program.methods.close().accounts({ counter: account }).rpc()
      transactionToast(tx)
      await accounts.refetch()
      return tx
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to close account')
      setCloseError(error)
      throw error
    } finally {
      setCloseLoading(false)
    }
  }, [program, account, accounts, transactionToast])

  // 减少
  const decrement = useCallback(async () => {
    try {
      setDecrementLoading(true)
      const tx = await program.methods.decrement().accounts({ counter: account }).rpc()
      transactionToast(tx)
      await fetchAccount()
      return tx
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to decrement')
      setDecrementError(error)
      throw error
    } finally {
      setDecrementLoading(false)
    }
  }, [program, account, fetchAccount, transactionToast])

  // 增加
  const increment = useCallback(async () => {
    try {
      setIncrementLoading(true)
      const tx = await program.methods.increment().accounts({ counter: account }).rpc()
      transactionToast(tx)
      await fetchAccount()
      return tx
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to increment')
      setIncrementError(error)
      throw error
    } finally {
      setIncrementLoading(false)
    }
  }, [program, account, fetchAccount, transactionToast])

  // 设置counter任意值
  const set = useCallback(
    async (value: number) => {
      try {
        setSetLoading(true)
        const tx = await program.methods.set(value).accounts({ counter: account }).rpc()
        transactionToast(tx)
        await fetchAccount()
        return tx
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to set value')
        setSetError(error)
        throw error
      } finally {
        setSetLoading(false)
      }
    },
    [program, account, fetchAccount, transactionToast]
  )

  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  return {
    accountQuery: {
      data: accountData,
      isLoading: accountLoading,
      error: accountError,
      refetch: fetchAccount
    },
    closeMutation: {
      mutate: close,
      isLoading: closeLoading,
      error: closeError
    },
    decrementMutation: {
      mutate: decrement,
      isLoading: decrementLoading,
      error: decrementError
    },
    incrementMutation: {
      mutate: increment,
      isLoading: incrementLoading,
      error: incrementError
    },
    setMutation: {
      mutate: set,
      isLoading: setLoading,
      error: setError
    }
  }
}
