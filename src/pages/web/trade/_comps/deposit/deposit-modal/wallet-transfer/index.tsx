import { Trans } from '@/libs/lingui/react/macro'
import { useEffect, useMemo } from 'react'

import { IconButton } from '@/libs/ui/components/button'
import { ModalCloseButton, ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { cn } from '@/libs/ui/lib/utils'
import { Iconify } from '@/libs/ui/components/icons'
import { BNumber } from '@/libs/utils/number'
import { Skeleton } from '@/libs/ui/components/skeleton'
import { useSolanaWalletBalance } from '../_apis/use-solana-wallet-balance'
import { useDepositSupportedTokens } from '../_apis/use-supported-tokens'
import { useDepositActions, useDepositState } from '../_hooks/use-deposit-state'
import { useSelectedDepositAccount } from '../_hooks/use-selected-account'
import { DEPOSIT_SOLANA_CHAIN_ID } from '@/constants/deposit'

export interface WalletAsset {
  symbol: string
  displayName: string
  balance: string // 代币数量
  balanceUsd: string // USD 估值
  iconUrl?: string
  isInsufficientBalance: boolean // 是否余额不足
  chainName: string // 链名称
  rawBalance: string // 原始余额数值
  usdValue: number // USD 数值
}

export const WalletTransfer = ({ onBack, onSelect }: { onBack: () => void; onSelect: (asset: WalletAsset) => void }) => {
  const { fromWalletAddress } = useDepositState()
  const { setSelectedTokenSymbol } = useDepositActions()
  const selectedAccount = useSelectedDepositAccount()

  // 查询钱包余额
  const { data: balanceData, isLoading: isLoadingBalance } = useSolanaWalletBalance(fromWalletAddress)

  // 查询代币配置（获取图标）
  const { data: tokensConfig, isLoading: isLoadingTokens } = useDepositSupportedTokens(DEPOSIT_SOLANA_CHAIN_ID)

  // 转换 API 数据为组件所需格式
  const assetsRendered: WalletAsset[] = useMemo(() => {
    if (!balanceData || !tokensConfig) return []

    return balanceData.balances.map((tokenBalance) => {
      const tokenConfig = tokensConfig.find((t) => t.symbol === tokenBalance.symbol)

      return {
        symbol: tokenConfig?.symbol || tokenBalance.symbol,
        displayName: tokenConfig?.symbol || tokenBalance.symbol,
        iconUrl: tokenConfig?.iconUrl,
        balance: BNumber.toFormatNumber(tokenBalance.amount, {
          volScale: tokenConfig?.displayDecimals,
          unit: tokenConfig?.symbol
        }),
        balanceUsd: BNumber.toFormatNumber(tokenBalance.usdValue, {
          volScale: selectedAccount?.currencyDecimal,
          unit: selectedAccount?.currencyUnit
        }),
        isInsufficientBalance: BNumber.from(tokenBalance.amount).lt(tokenBalance.minAmount),
        chainName: 'Solana',
        rawBalance: tokenBalance.amount,
        usdValue: tokenBalance.usdValue
      }
    })
  }, [balanceData, tokensConfig, selectedAccount])

  const isLoading = isLoadingBalance || isLoadingTokens

  return (
    <>
      <ModalHeader className="w-full gap-2xl">
        <ModalTitle className="flex items-center justify-between w-full" showCloseButton={false}>
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-6" />
          </IconButton>
          <Trans>钱包转入</Trans>
          <ModalCloseButton iconClassName="size-6" />
        </ModalTitle>

        <div className="text-paragraph-p3 text-content-4">
          <Trans>
            余额：
            {BNumber.toFormatNumber(balanceData?.totalUsdValue, {
              volScale: selectedAccount?.currencyDecimal,
              unit: selectedAccount?.currencyUnit
            })}
          </Trans>
        </div>
      </ModalHeader>

      <div className="flex flex-col gap-2xl flex-1 overflow-y-auto px-1">
        {isLoading ? (
          <>
            <AssetRowSkeleton />
            <AssetRowSkeleton />
            <AssetRowSkeleton />
          </>
        ) : assetsRendered.length > 0 ? (
          assetsRendered.map((asset) => (
            <AssetRow key={asset.symbol} asset={asset} onSelect={onSelect} setSelectedTokenSymbol={setSelectedTokenSymbol} />
          ))
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-paragraph-p3 text-content-4">
              <Trans>暂无资产</Trans>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function AssetRow({
  asset,
  onSelect,
  setSelectedTokenSymbol
}: {
  asset: WalletAsset
  onSelect: (asset: WalletAsset) => void
  setSelectedTokenSymbol: (tokenSymbol: string) => void
}) {
  const disabled = asset.isInsufficientBalance

  const handlePress = () => {
    // 设置选中的 Token Symbol
    setSelectedTokenSymbol(asset.symbol)
    onSelect(asset)
  }

  return (
    <div
      onClick={() => !disabled && handlePress()}
      className={cn(
        'flex items-center justify-between gap-2 px-xl py-medium rounded-small border border-default transition-all',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white'
      )}
    >
      <div className="flex items-center gap-medium">
        {asset.iconUrl ? (
          <img src={asset.iconUrl} className="size-6 rounded-full object-contain" alt={asset.symbol} />
        ) : (
          <div className="size-6" />
        )}

        <div className="flex flex-col gap-xs">
          <div className="text-paragraph-p2 text-content-1">{asset.displayName}</div>
          <div className="text-paragraph-p3 text-content-4">{asset.balance}</div>
        </div>
      </div>

      <div className="flex items-center gap-small">
        {disabled && (
          <div className="px-xs rounded-xs bg-button">
            <span className="text-paragraph-p3 text-content-1">
              <Trans>余额不足</Trans>
            </span>
          </div>
        )}
        <div className="text-paragraph-p2 text-content-1">{asset.balanceUsd}</div>
      </div>
    </div>
  )
}

function AssetRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-2 px-xl py-medium rounded-small border border-default">
      <div className="flex items-center gap-medium">
        <Skeleton className="size-6 rounded-full" />
        <div className="flex flex-col gap-xs">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  )
}
