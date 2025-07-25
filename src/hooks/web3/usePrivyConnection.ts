import { useCluster } from '@/context/clusterProvider'
import { Connection } from '@solana/web3.js'

// privy connection initialization
export default function usePrivyConnection() {
  const { cluster, clusters } = useCluster()
  const connection = new Connection(cluster.endpoint)

  return {
    connection,
    cluster
  }
}
