'use client'

import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { WalletInfoCard } from './wallet-info-card'
import { WalletConnectOption } from './wallet-connect-option'

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

  // Web3 登录：显示钱包信息卡片
  if (connected && activeSolanaWallet) {
    return <WalletInfoCard />
  }

  // Web2 登录：显示连接钱包选项
  return <WalletConnectOption onSelect={() => onSelect('wallet')} />
}
