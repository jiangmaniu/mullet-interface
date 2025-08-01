import { useStores } from '@/context/mobxProvider'
import { Connection } from '@solana/web3.js'
import { useMemo } from 'react'
import usePrivyInfo from './usePrivyInfo'

type RetutrnConnectType = {
  connection: Connection
  cluster: string
  /**钱包是否已连接 */
  connected: boolean
}

// privy connection initialization
export default function useConnection(): RetutrnConnectType {
  const { connected } = usePrivyInfo()
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const cluster = currentAccountInfo.networkAlias || ''
  const endpoint = currentAccountInfo.networkRpc || ''
  // const endpoint = 'https://api.devnet.solana.com' // @TODO 测试环境

  const connection = useMemo(() => {
    return new Connection(endpoint)
  }, [endpoint])

  return {
    connection,
    cluster,
    connected
  }
}
