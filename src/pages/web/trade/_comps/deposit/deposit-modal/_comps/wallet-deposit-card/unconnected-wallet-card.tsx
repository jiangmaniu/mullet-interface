'use client'

import { Trans } from '@/libs/lingui/react/macro'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { Iconify, IconMetamask, IconOkxWallet, IconArbitrum } from '@/libs/ui/components/icons'

interface UnconnectedWalletCardProps {
  onSelect: () => void
}

/**
 * 未连接钱包卡片
 */
export const UnconnectedWalletCard = ({ onSelect }: UnconnectedWalletCardProps) => {
  return (
    <div
      onClick={onSelect}
      className="group relative flex items-center gap-2 px-xl py-medium rounded-small border border-default transition-all cursor-pointer hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white"
    >
      <Iconify icon="iconoir:wallet-solid" className="w-6 h-6" />

      <div className="flex flex-col gap-xs flex-1">
        <div className="text-paragraph-p2 text-content-1">
          <Trans>直连钱包转入</Trans>
        </div>
        <div className="text-paragraph-p3 text-content-4">
          <Trans>最低$5 · 即时</Trans>
        </div>
      </div>

      <div className="flex -space-x-xs items-center pr-xs">
        <IconMetamask />
        <IconOkxWallet />
        <IconArbitrum />
      </div>
    </div>
  )
}
