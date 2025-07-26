import { SolanaCluster, useCluster } from '@/context/clusterProvider'
import { usePrivy } from '@privy-io/react-auth'
import { Connection } from '@solana/web3.js'
import { useMemo } from 'react'

type RetutrnConnectType = {
  connection: Connection
  cluster: SolanaCluster
  /**钱包是否已连接 */
  connected: boolean
}

// privy connection initialization
export default function useConnection(): RetutrnConnectType {
  const { authenticated, ready } = usePrivy()
  const { cluster } = useCluster()
  const connection = useMemo(() => {
    return new Connection(cluster.endpoint)
  }, [cluster.endpoint])

  return {
    connection,
    cluster,
    connected: authenticated && ready
  }
}
