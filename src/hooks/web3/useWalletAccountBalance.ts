import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import useAccountChange from './useAccountChange'
import useConnection from './useConnection'
import usePrivyInfo from './usePrivyInfo'

type IProps = {
  address: PublicKey | string
}

// 获取钱包账户的余额
export default function useWalletAccountBalance(props?: IProps) {
  const { address: addressPrivy } = usePrivyInfo()
  const address = props?.address || addressPrivy
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number>(0)

  const getBalance = async () => {
    const balance = await connection.getBalance(new PublicKey(address))
    const value = balance / LAMPORTS_PER_SOL
    setBalance(value)
  }

  useEffect(() => {
    if (!connection || !address) return
    getBalance()
  }, [connection, address])

  // 监听账户变化 会有延迟
  const { updatedAccountInfo } = useAccountChange({ address })
  useEffect(() => {
    if (updatedAccountInfo.owner) {
      setBalance(updatedAccountInfo.balance)
    }
  }, [updatedAccountInfo])

  return {
    balance,
    setBalance,
    getBalance
  }
}
