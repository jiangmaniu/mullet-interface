'use client'

import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { ConnectedWalletCard } from './connected-wallet-card'
import { UnconnectedWalletCard } from './unconnected-wallet-card'

type DepositView = 'menu' | 'wallet' | 'swap' | 'crypto' | 'buy'

interface WalletDepositCardProps {
  onSelect: (view: DepositView) => void
}

/**
 * 钱包存款卡片 - 根据登录类型显示不同内容
 * - Web3 登录：显示 WalletInfoCard（钱包地址和余额）
 * - Web2 登录：显示 WalletConnectOption（引导连接钱包）
 */
export const WalletDepositCard = ({ onSelect }: WalletDepositCardProps) => {
  const { activeSolanaWallet, connected } = usePrivyInfo()

  // 已连接钱包：显示已连接钱包卡片
  if (connected && activeSolanaWallet) {
    return <ConnectedWalletCard onSelect={() => onSelect('wallet')} />
  }

  // 未连接钱包：显示未连接钱包卡片
  return <UnconnectedWalletCard onSelect={() => onSelect('wallet')} />
}
