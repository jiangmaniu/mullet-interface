'use client'

import { Trans } from '@/libs/lingui/react/macro'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { Iconify, IconSolana } from '@/libs/ui/components/icons'
import { useSolanaWalletBalance } from '../../_apis/use-solana-wallet-balance'
import { BNumber } from '@/libs/utils/number'
import { formatAddress } from '@/libs/utils/format'
import { useSelectedDepositAccount } from '../../_hooks/use-selected-account'
import { useEffect } from 'react'
import { useDepositActions } from '../../_hooks/use-deposit-state'
import { DEPOSIT_SOLANA_CHAIN_ID } from '@/constants/deposit'
import { useDepositAddress } from '../../_apis/use-deposit-address'

interface ConnectedWalletCardProps {
  onSelect: () => void
}

/**
 * 已连接钱包卡片
 */
export const ConnectedWalletCard = ({ onSelect }: ConnectedWalletCardProps) => {
  const { activeSolanaWallet } = usePrivyInfo()
  const { setFromWalletAddress, setToWalletAddress } = useDepositActions()
  const selectedAccount = useSelectedDepositAccount()

  // 查询钱包余额
  const { data: balanceData, isLoading } = useSolanaWalletBalance(activeSolanaWallet?.address, {
    enabled: !!activeSolanaWallet?.address,
    refetchInterval: 30000 // 30秒自动刷新s
  })

  // 获取充值地址
  const { data: depositAddressInfo } = useDepositAddress(DEPOSIT_SOLANA_CHAIN_ID, selectedAccount?.id || '')

  // 当获取到充值地址时，存储到 deposit store
  useEffect(() => {
    if (depositAddressInfo?.address) {
      setToWalletAddress(depositAddressInfo.address)
    }
  }, [depositAddressInfo?.address, setToWalletAddress])

  // 当获取到当前钱包地址时，存储到 deposit store
  useEffect(() => {
    if (activeSolanaWallet?.address) {
      setFromWalletAddress(activeSolanaWallet.address)
    }
  }, [activeSolanaWallet?.address, setFromWalletAddress])

  return (
    <div onClick={() => onSelect()} className="border border-default rounded-small px-xl py-medium flex items-center gap-2">
      {/* 钱包图标 */}
      <div className="relative shrink-0 size-6">
        <Iconify icon="iconoir:wallet-solid" className="w-6 h-6" />
      </div>

      {/* 钱包信息 */}
      <div className="flex flex-col gap-xs flex-1">
        <span className="text-paragraph-p2 text-content-1">{formatAddress(activeSolanaWallet?.address)}</span>
        <span className="text-paragraph-p3 text-content-4">
          <Trans>
            余额：
            {BNumber.toFormatNumber(balanceData?.totalUsdValue, {
              volScale: selectedAccount?.currencyDecimal,
              unit: selectedAccount?.currencyUnit
            })}
          </Trans>
        </span>
      </div>
    </div>
  )
}
