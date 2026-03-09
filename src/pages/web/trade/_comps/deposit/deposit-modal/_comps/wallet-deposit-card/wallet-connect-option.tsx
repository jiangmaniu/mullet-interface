'use client'

import { Trans } from '@/libs/lingui/react/macro'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { Iconify, IconMetamask, IconOkxWallet, IconArbitrum } from '@/libs/ui/components/icons'

interface WalletConnectOptionProps {
  onSelect: () => void
}

/**
 * 直连钱包转入选项
 * - Web2 登录：显示此选项，引导用户连接钱包
 * - Web3 登录：不显示此选项（已经连接钱包，显示 WalletInfoCard）
 *
 * 登录类型判断逻辑：
 * - Web3 登录：用户通过 Privy 连接了钱包（activeSolanaWallet 存在）
 * - Web2 登录：用户通过邮箱/手机号登录（activeSolanaWallet 不存在）
 */
export const WalletConnectOption = ({ onSelect }: WalletConnectOptionProps) => {
  const { activeSolanaWallet, connected } = usePrivyInfo()

  // Web3 登录时不显示（已经连接钱包，显示 WalletInfoCard）
  if (connected && activeSolanaWallet) {
    return null
  }

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
