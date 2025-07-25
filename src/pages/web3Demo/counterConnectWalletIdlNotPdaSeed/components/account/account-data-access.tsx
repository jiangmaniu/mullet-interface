'use client'

import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction
} from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'

// 获取账户余额
export function useGetBalance({ address }: { address: PublicKey }) {
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true)
      const result = await connection.getBalance(address)
      setBalance(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch balance'))
    } finally {
      setLoading(false)
    }
  }, [connection, address])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return { balance, loading, error, refetch: fetchBalance }
}

// 获取交易签名
export function useGetSignatures({ address }: { address: PublicKey }) {
  const { connection } = useConnection()
  const [signatures, setSignatures] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchSignatures = useCallback(async () => {
    try {
      setLoading(true)
      const result = await connection.getSignaturesForAddress(address)
      setSignatures(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch signatures'))
    } finally {
      setLoading(false)
    }
  }, [connection, address])

  useEffect(() => {
    fetchSignatures()
  }, [fetchSignatures])

  return { signatures, loading, error, refetch: fetchSignatures }
}

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  const { connection } = useConnection()
  const [tokenAccounts, setTokenAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchTokenAccounts = useCallback(async () => {
    try {
      setLoading(true)
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_PROGRAM_ID
        }),
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_2022_PROGRAM_ID
        })
      ])
      setTokenAccounts([...tokenAccounts.value, ...token2022Accounts.value])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch token accounts'))
    } finally {
      setLoading(false)
    }
  }, [connection, address])

  useEffect(() => {
    fetchTokenAccounts()
  }, [fetchTokenAccounts])

  return { tokenAccounts, loading, error, refetch: fetchTokenAccounts }
}

export function useTransferSol({ address }: { address: PublicKey }) {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TransactionSignature | null>(null)

  const transfer = useCallback(
    async (input: { destination: PublicKey; amount: number }) => {
      let signature: TransactionSignature = ''
      try {
        setLoading(true)
        setError(null)

        // 方式1
        // const { transaction, latestBlockhash } = await createTransaction({
        //   publicKey: address,
        //   destination: input.destination,
        //   amount: input.amount,
        //   connection,
        // })

        // signature = await wallet.sendTransaction(transaction, connection)
        // await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        // 方式2
        // 构建转账指令（2 SOL）
        const instruction = SystemProgram.transfer({
          fromPubkey: address,
          toPubkey: input.destination,
          lamports: input.amount * LAMPORTS_PER_SOL
        })

        // 创建交易 legacy 交易（旧版）
        // 旧版交易格式（Legacy Transaction）
        // Solana 最初的交易格式，兼容所有节点和钱包，但功能有限。
        // 需要手动添加指令、签名者、区块哈希等
        // const transaction = new Transaction().add(instruction);
        // transaction.feePayer = publicKey;          // 设置手续费支付者
        // transaction.recentBlockhash = blockhash;   // 手动设置区块哈希
        // 适用：简单转账或旧版 DApp。需要兼容性时（某些工具链可能不支持新版交易）
        const transaction = new Transaction().add(instruction)

        // 发送交易
        console.log('正在发送交易...')
        // const signature = await sendAndConfirmTransaction(connection, transaction, [sender]); // 有本地私钥手动传入签名者

        // 让钱包签名（无需手动传 signers）
        const signature = await wallet.sendTransaction(transaction, connection)
        await connection.confirmTransaction(signature, 'confirmed')

        console.log('交易成功！交易哈希:', signature)
        console.log(`https://explorer.solana.com/tx/${signature}?cluster=custom`)

        setData(signature)
        return signature
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Transaction failed')
        setError(error)
        console.error('Transaction failed:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [connection, wallet, address]
  )

  return { mutate: transfer, loading, error, data }
}

export function useRequestAirdrop({ address }: { address: PublicKey }) {
  const { connection } = useConnection()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TransactionSignature | null>(null)
  const { refetch: fetchBalance } = useGetBalance({ address })

  const requestAirdrop = useCallback(
    async (amount = 1) => {
      try {
        setLoading(true)
        setError(null)

        const [latestBlockhash, signature] = await Promise.all([
          connection.getLatestBlockhash(),
          connection.requestAirdrop(address, amount * LAMPORTS_PER_SOL)
        ])

        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')
        setData(signature)
        fetchBalance()
        return signature
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Airdrop failed')
        setError(error)
        console.error('Airdrop failed:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [connection, address]
  )

  return { mutate: requestAirdrop, loading, error, data }
}

// createTransaction 函数保持不变
async function createTransaction({
  publicKey,
  destination,
  amount,
  connection
}: {
  publicKey: PublicKey
  destination: PublicKey
  amount: number
  connection: Connection
}): Promise<{
  transaction: VersionedTransaction
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number }
}> {
  const latestBlockhash = await connection.getLatestBlockhash()

  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: destination,
      lamports: amount * LAMPORTS_PER_SOL
    })
  ]

  // 新版构建方式
  // 新版交易格式（Versioned Transaction）
  // Solana 引入的升级版交易，支持更复杂的特性（如地址查找表、交易版本控制）
  // 通过 TransactionMessage 统一管理参数（支付者、区块哈希、指令），再编译为 VersionedTransaction
  const messageLegacy = new TransactionMessage({
    payerKey: publicKey, // 支付者
    recentBlockhash: latestBlockhash.blockhash, // 区块哈希
    instructions // 指令数组
  }).compileToLegacyMessage() // 编译为旧版消息（兼容模式）

  const transaction = new VersionedTransaction(messageLegacy)

  return {
    transaction,
    latestBlockhash
  }
}
