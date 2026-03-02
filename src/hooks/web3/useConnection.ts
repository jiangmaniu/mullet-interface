import { useStores } from '@/context/mobxProvider'
import { Connection } from '@solana/web3.js'
import { useMemo } from 'react'
import usePrivyInfo from './usePrivyInfo'
import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  Rpc,
  RpcSubscriptions,
  sendAndConfirmTransactionFactory,
  SolanaRpcApi,
  SolanaRpcSubscriptionsApi
} from '@solana/kit'

type RetutrnConnectType = {
  connection: Connection
  cluster: string
  /**钱包是否已连接 */
  connected: boolean
  rpc: Rpc<SolanaRpcApi>
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>
}

// 使用 Ankr 的可靠 RPC endpoint
const DEFAULT_SOLANA_RPC = `https://rpc.ankr.com/solana/${process.env.ANKR_API_KEY}`
const DEFAULT_SOLANA_WSS = `wss://rpc.ankr.com/solana/ws/${process.env.ANKR_API_KEY}`

// privy connection initialization
export default function useConnection(): RetutrnConnectType {
  const { connected } = usePrivyInfo()
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const cluster = currentAccountInfo.networkAlias || ''
  const endpoint = currentAccountInfo.networkRpc || DEFAULT_SOLANA_RPC

  const connection = useMemo(() => {
    return new Connection(endpoint, 'confirmed')
  }, [endpoint])

  const rpc = useMemo(() => {
    return createSolanaRpc(currentAccountInfo.networkRpc || DEFAULT_SOLANA_RPC)
  }, [currentAccountInfo.networkRpc])

  const rpcSubscriptions = useMemo(() => {
    return createSolanaRpcSubscriptions(DEFAULT_SOLANA_WSS)
  }, [currentAccountInfo.networkRpc])

  return {
    rpc,
    rpcSubscriptions,
    connection,
    cluster,
    connected
  }
}
