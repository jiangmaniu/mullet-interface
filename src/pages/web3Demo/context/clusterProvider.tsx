import { STORAGE_GET_CLUSTER, STORAGE_SET_CLUSTER } from '@/utils/storage'
import { clusterApiUrl } from '@solana/web3.js'
import { createContext, useContext, useEffect, useState } from 'react'

const getClusterUrlParam = (cluster: SolanaCluster) => {
  let suffix = ''
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      suffix = 'devnet'
      break
    case ClusterNetwork.Mainnet:
      suffix = ''
      break
    case ClusterNetwork.Testnet:
      suffix = 'testnet'
      break
    default:
      suffix = `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom'
}

export interface SolanaCluster {
  name: string
  endpoint: string
  network?: ClusterNetwork
  active?: boolean
}

// By default, we don't configure the mainnet-beta cluster
// The endpoint provided by clusterApiUrl('mainnet-beta') does not allow access from the browser due to CORS restrictions
// To use the mainnet-beta cluster, provide a custom endpoint
export const defaultClusters: SolanaCluster[] = [
  ...(process.env.NODE_ENV === 'development' ? [{ name: 'local', endpoint: 'http://localhost:8899' }] : []),
  {
    name: 'devnet',
    endpoint: clusterApiUrl('devnet'),
    network: ClusterNetwork.Devnet
  },
  {
    name: 'testnet',
    endpoint: clusterApiUrl('testnet'),
    network: ClusterNetwork.Testnet
  },
  {
    name: 'mainnet',
    // 个人测试备用的主网节点 https://dashboard.quicknode.com/endpoints/523628
    // "https://purple-palpable-tree.solana-mainnet.quiknode.pro/032689a2c14f6b44525a65bf44ffcb054120e00b"
    // 更多节点 https://solana.com/zh/rpc
    endpoint: clusterApiUrl('mainnet-beta'),
    network: ClusterNetwork.Mainnet
  }
]

interface IProps {
  children: JSX.Element
}

type ProviderType = {
  /**当前选择的集群item */
  cluster: SolanaCluster
  /**集群列表 */
  clusters: SolanaCluster[]
  /**设置当前选择的集群 */
  setCluster: (cluster: SolanaCluster) => void
  /**获取explorer的url */
  getExplorerUrl: (path: string) => string
}

const Context = createContext<ProviderType>({} as ProviderType)

export const ClusterProvider = ({ children }: IProps) => {
  const [cluster, setCluster] = useState({} as SolanaCluster)

  useEffect(() => {
    const cluster = STORAGE_GET_CLUSTER()
    setCluster(cluster || defaultClusters[0])
  }, [])

  const exposed = {
    cluster,
    clusters: defaultClusters,
    setCluster: (cluster: SolanaCluster) => {
      setCluster(cluster)
      STORAGE_SET_CLUSTER(cluster)
    },
    getExplorerUrl: (path: string) => `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useCluster = () => useContext(Context)
