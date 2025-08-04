import { useStores } from '@/context/mobxProvider'
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import useConnection from './useConnection'
import usePrivyInfo from './usePrivyInfo'
type IProps = {
  address?: PublicKey | string
  tokenMint?: PublicKey | string // 代币的mint地址
  decimals?: number // 代币的小数位数，默认为6
}

// 通用SPL代币余额获取hook
// 使用 @solana/spl-token 库获取SPL代币余额，需要通过关联代币账户（Associated Token Account）
export default function useSPLTokenBalance(props?: IProps) {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const { address: addressPrivy } = usePrivyInfo()
  const tokenMint = props?.tokenMint || currentAccountInfo.mintAddress
  const address = props?.address || addressPrivy
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const decimals = Number(props?.decimals || currentAccountInfo.mintDecimals || 6)

  const getTokenBalance = async () => {
    if (!connection || !address || !tokenMint) return

    try {
      setLoading(true)
      setError(null)

      // 获取关联代币账户地址
      const associatedTokenAddress = await getAssociatedTokenAddress(new PublicKey(tokenMint), new PublicKey(address))

      // 获取代币账户信息
      const tokenAccount = await getAccount(connection, associatedTokenAddress)

      // 根据decimals计算真实余额
      const tokenBalance = Number(tokenAccount.amount) / Math.pow(10, decimals)
      setBalance(tokenBalance)
      return tokenBalance
    } catch (err) {
      console.error('获取代币余额失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'

      // 如果是账户不存在的错误，设置余额为0
      if (errorMessage.includes('could not find account') || errorMessage.includes('Invalid account owner')) {
        setBalance(0)
        setError(null)
      } else {
        setError(errorMessage)
        setBalance(0)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!connection || !address || !tokenMint) return
    getTokenBalance()
  }, [connection, address, tokenMint, decimals])

  return {
    balance,
    setBalance,
    getTokenBalance,
    loading,
    error
  }
}

// 常用代币的mint地址和配置
export const TOKEN_CONFIGS = {
  USDC: {
    'mainnet-beta': {
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6
    },
    devnet: {
      mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      decimals: 6
    }
  },
  USDT: {
    'mainnet-beta': {
      mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      decimals: 6
    }
  },
  RAY: {
    'mainnet-beta': {
      mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      decimals: 6
    }
  }
}
