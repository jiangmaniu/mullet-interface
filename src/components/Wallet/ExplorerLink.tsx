import { useStores } from '@/context/mobxProvider'
import { Address } from '@ant-design/web3'
import { observer } from 'mobx-react'

type IProps = {
  path: any
  address: any
  className?: string
  cluster?: string
}

// 获取区块浏览器地址
const ExplorerLink = ({ path, address, className, cluster = '' }: IProps) => {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  let network = currentAccountInfo.networkAlias || cluster
  network = network === 'localnet' ? 'custom' : network

  return (
    <a
      href={`https://explorer.solana.com/${path}?cluster=${network}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      <Address
        ellipsis={{
          headClip: 8,
          tailClip: 6
        }}
        address={address}
      />
    </a>
  )
}
export default observer(ExplorerLink)
