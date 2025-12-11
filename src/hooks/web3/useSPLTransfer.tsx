import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { useStores } from '@/context/mobxProvider'
import { message } from '@/utils/message'
import { useWallets } from '@privy-io/react-auth'
import { useSignAndSendTransaction } from '@privy-io/react-auth/solana'
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress
} from '@solana/spl-token'
import { PublicKey, Transaction, TransactionSignature } from '@solana/web3.js'
import { useIntl } from '@umijs/max'
import { useState } from 'react'
import useConnection from './useConnection'
import useNotice from './useNotice'
import usePrivyInfo from './usePrivyInfo'
import useSPLTokenBalance from './useSPLTokenBalance'

type TransferProps = {
  // 转入目标地址
  toAddress: string
  amount: number
  tokenMint?: PublicKey | string // 代币的mint地址
  decimals?: number // 代币的小数位数，默认为6
  onBeforeTransfer?: () => void
}

// USDC转账
export default function useSPLTransfer() {
  const intl = useIntl()
  const { connection, connected } = useConnection()
  const { wallet } = usePrivyInfo()
  const { wallets } = useWallets()
  const fromAddress = wallet?.address as string
  const { signAndSendTransaction } = useSignAndSendTransaction()
  const [transferLoading, setTransferLoading] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState(false)
  const { showNotice } = useNotice()
  const [error, setError] = useState(false)
  const { balance: splBalance } = useSPLTokenBalance()
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  // 使用 confirmTransaction 确认交易状态
  const confirmTransactionStatus = async (signature: TransactionSignature): Promise<boolean> => {
    try {
      // 等待交易确认，设置超时时间
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash: (await connection.getLatestBlockhash()).blockhash,
          lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
        },
        'confirmed'
      )

      // 检查是否有错误
      if (confirmation?.value?.err) {
        console.error('交易失败:', confirmation.value.err)
        return false
      }

      console.log('交易确认成功!')
      return true
    } catch (error) {
      console.error('确认交易时出错:', error)
      setError(true)
      return false
    }
  }

  const onTransfer = async ({ toAddress, amount, tokenMint, decimals, onBeforeTransfer }: TransferProps) => {
    const mintAddr = new PublicKey(tokenMint || currentAccountInfo.mintAddress)
    const decimal = Number(decimals || currentAccountInfo.mintDecimals || 6)

    if (!connected || !wallet?.address || wallets.length === 0) {
      message.info('Please connect wallet first')
      return
    }

    const transferAmount = Math.floor(Number(amount) * Math.pow(10, decimal))

    console.log(`from ${fromAddress} to ${toAddress} transferAmount ${transferAmount} USDC`)

    try {
      const balance = splBalance * Math.pow(10, decimal) // 代币余额
      console.log('balance: ', balance)

      if (!toAddress) {
        message.info(intl.formatMessage({ id: 'mt.zhuanruzhizhiweikong' }))
        return
      }
      // 检查代币余额
      if (balance < transferAmount) {
        message.info(intl.formatMessage({ id: 'mt.yuebuzu' }))
        setError(true)
        return
      }

      if (fromAddress === toAddress) {
        message.info(intl.formatMessage({ id: 'mt.zhuanruzhuanchudizhibunengxiangtong' }))
        return
      }

      // 转账之前回调
      onBeforeTransfer?.()

      setTransferLoading(true)

      // 获取关联代币账户地址
      const fromTokenAccount = await getAssociatedTokenAddress(mintAddr, new PublicKey(fromAddress))

      // const toTokenAccount = await getAssociatedTokenAddress(
      //   mintAddr,
      //   new PublicKey(toAddress)
      // )
      const toTokenAccount = new PublicKey(toAddress) // 转到pda地址

      console.log('From token account:', fromTokenAccount.toString())
      console.log('To token account:', toTokenAccount.toString())

      // 构建交易
      const transaction = new Transaction()

      // 检查目标代币账户是否存在，如果不存在则创建
      try {
        await getAccount(connection, toTokenAccount)
        console.log('目标代币账户已存在')
      } catch (error) {
        console.log('目标代币账户不存在，需要创建')
        // 创建关联代币账户指令
        const createAccountInstruction = createAssociatedTokenAccountInstruction(
          new PublicKey(fromAddress), // payer
          toTokenAccount, // associatedToken
          new PublicKey(toAddress), // owner
          mintAddr // mint
        )
        transaction.add(createAccountInstruction)
      }

      // 添加转账指令
      const transferInstruction = createTransferInstruction(
        fromTokenAccount, // source
        toTokenAccount, // destination
        new PublicKey(fromAddress), // owner
        transferAmount, // amount
        [], // multiSigners
        TOKEN_PROGRAM_ID // programId
      )

      transaction.add(transferInstruction)

      console.log('transaction', transaction)

      // 设置区块哈希
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = new PublicKey(fromAddress)

      // 获取钱包的实例
      const foundWallet = wallets.find((v) => v.address === fromAddress)

      console.log('foundWallet', foundWallet)

      let signature = ''

      // 如果钱包是外部钱包，则使用内置的签名方法
      if (foundWallet && foundWallet.connectorType !== 'embedded') {
        signature = await foundWallet.sendTransaction(transaction, connection)
      } else {
        // 如果钱包是内置钱包，则使用 Privy v3.8+ 的签名方法
        const result = await signAndSendTransaction({ transaction, connection, address: fromAddress })
        signature = result?.signature
      }

      console.log('USDC转账成功！交易哈希:', signature)

      console.log('正在确认交易...')
      const isConfirmed = await confirmTransactionStatus(signature)
      console.log('交易确认状态:', isConfirmed)
      setTransferSuccess(true)
      setError(false)

      setTimeout(() => {
        setTransferSuccess(false)
        showNotice({
          title: intl.formatMessage({ id: 'mt.zhuanzhangchenggong' }),
          content: (
            <span>
              <span className="mr-2">{intl.formatMessage({ id: 'mt.rujinyiquerenyuejianggengxin' })}</span>
              <ExplorerLink path={`tx/${signature}`} address={signature} label={'Explorer Link'} />
            </span>
          )
        })
      }, 300)
    } catch (error) {
      console.log('USDC转账失败:', error)
      setError(true)
    } finally {
      setTransferLoading(false)
    }
  }

  return {
    onTransfer,
    transferLoading,
    transferSuccess,
    error,
    setError
  }
}
