import { useStores } from '@/context/mobxProvider'
import { Connection } from '@solana/web3.js'
import { useMemo } from 'react'
import usePrivyInfo from './usePrivyInfo'
import { createSolanaRpc, createSolanaRpcSubscriptions, Rpc, RpcSubscriptions, sendAndConfirmTransactionFactory, SolanaRpcApi, SolanaRpcSubscriptionsApi } from '@solana/kit'

type RetutrnConnectType = {
  connection: Connection
  cluster: string
  /**钱包是否已连接 */
  connected: boolean
  rpc: Rpc<SolanaRpcApi>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
}

// privy connection initialization
export default function useConnection(): RetutrnConnectType {
  const { connected } = usePrivyInfo()
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const cluster = currentAccountInfo.networkAlias || ''
  const endpoint = currentAccountInfo.networkRpc || 'https://api.mainnet-beta.solana.com'
  // const endpoint = 'https://api.devnet.solana.com' // @TODO 测试环境

  const connection = useMemo(() => {
    return new Connection(endpoint)
  }, [endpoint])

  const rpc = useMemo(() => {
    return createSolanaRpc(currentAccountInfo.networkRpc || 'https://api.mainnet-beta.solana.com')
  }, [currentAccountInfo.networkRpc])

  const rpcSubscriptions = useMemo(() => {
    return createSolanaRpcSubscriptions('wss://api.devnet.solana.com')
  }, [currentAccountInfo.networkRpc])

  return {
    rpc,
    rpcSubscriptions,
    connection,
    cluster,
    connected
  }
}
