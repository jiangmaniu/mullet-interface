import { useStores } from '@/context/mobxProvider'
import { copyContent } from '@/utils'
import { cn } from '@/utils/cn'
import { formatAddress } from '@/utils/web3'
import { CopyOutlined, LinkOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { observer } from 'mobx-react'
import React from 'react'
import { GeneralTooltip } from '../tooltip'
import { CopyButton } from '../common/copy-button'

type IProps = {
  path: any
  address: any
  className?: string
  cluster?: string
  copyable?: boolean
  isFormatAddress?: boolean
  label?: React.ReactNode
}

// 获取区块浏览器地址
const ExplorerLink = ({ path, address, className, cluster = '', copyable = false, isFormatAddress = true, label }: IProps) => {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  let network = currentAccountInfo.networkAlias || cluster
  network = network === 'localnet' ? 'custom' : network

  if (!address) return null

  // 🔥 直接使用 Solscan mainnet，因为 Privy Server Wallet 交易都在 mainnet 上
  // 如果需要支持其他网络，可以通过 cluster prop 显式指定
  const explorerUrl = cluster === 'devnet' ? `https://explorer.solana.com/${path}?cluster=devnet` : `https://solscan.io/${path}` // mainnet 使用 Solscan

  console.log('[ExplorerLink]', { path, address, cluster, network, networkAlias: currentAccountInfo.networkAlias, explorerUrl })

  return (
    <div className="flex items-center gap-0.5">
      <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className={cn(`!text-brand inline-flex items-center`, className)}>
        {!!label ? (
          <>
            <LinkOutlined className="mr-1" />
            {label}
          </>
        ) : (
          <>
            {isFormatAddress ? (
              <GeneralTooltip side={'top'} triggerClassName="inline" content={address}>
                <LinkOutlined className="mr-1" />

                {formatAddress(address)}
              </GeneralTooltip>
            ) : (
              <>
                <LinkOutlined className="mr-1" />
                {address}
              </>
            )}
          </>
        )}
      </a>
      {copyable && <CopyButton text={address} className="size-4 p-0" />}
    </div>
  )
}
export default observer(ExplorerLink)
