'use client'

import { Trans } from '@/libs/lingui/react/macro'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { Iconify, IconSolana } from '@/libs/ui/components/icons'
import { useSolanaWalletBalance } from '../../_apis/use-solana-wallet-balance'
import { BNumber } from '@/libs/utils/number'
import { formatAddress } from '@/libs/utils/format'
import { useSelectedDepositAccount } from '../../_hooks/use-selected-account'

/**
 * 钱包信息卡片
 * - Web2 登录：不显示此卡片
 * - Web3 登录：显示当前连接的钱包地址和余额
 *
 * 登录类型判断逻辑：
 * - Web3 登录：用户通过 Privy 连接了钱包（activeSolanaWallet 存在）
 * - Web2 登录：用户通过邮箱/手机号登录（activeSolanaWallet 不存在）
 *
 * 注：登录类型在登录时由后端根据 grant_type 判断：
 * - grant_type: 'privy_token' → Web3 登录
 * - grant_type: 'password' | 'captcha' → Web2 登录
 */
export const WalletInfoCard = () => {
  const { activeSolanaWallet, connected } = usePrivyInfo()
  const selectedAccount = useSelectedDepositAccount()

  // 查询钱包余额
  const { data: balanceData, isLoading } = useSolanaWalletBalance(activeSolanaWallet?.address, {
    enabled: !!activeSolanaWallet?.address,
    refetchInterval: 30000 // 30秒自动刷新
  })

  // Web2 登录或未连接钱包，不显示
  if (!connected || !activeSolanaWallet) {
    return null
  }

  return (
    <div className="border border-default rounded-small px-xl py-medium flex items-center gap-2">
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
