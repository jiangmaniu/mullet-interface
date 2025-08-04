import { useStores } from '@/context/mobxProvider'
import { copyContent } from '@/utils'
import { cn } from '@/utils/cn'
import { formatAddress } from '@/utils/web3'
import { CopyOutlined, LinkOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { observer } from 'mobx-react'
import React from 'react'

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

  return (
    <span>
      <a
        href={`https://explorer.solana.com/${path}?cluster=${network}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(`!text-brand`, className)}
      >
        <LinkOutlined className="mr-1" />
        {label}
        {!label && (
          <>
            {isFormatAddress ? (
              <Tooltip title={address} placement="top">
                {formatAddress(address)}
              </Tooltip>
            ) : (
              address
            )}
          </>
        )}
      </a>
      {copyable && <CopyOutlined className="cursor-pointer text-primary ml-2" onClick={() => copyContent(address)} />}
    </span>
  )
}
export default observer(ExplorerLink)
