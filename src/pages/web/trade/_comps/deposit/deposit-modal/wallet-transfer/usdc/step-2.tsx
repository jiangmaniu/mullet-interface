import { Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect, useRef } from 'react'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalCloseButton, ModalFooter, ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { Iconify, IconUSDC } from '@/libs/ui/components/icons'
import { BNumber } from '@/libs/utils/number'
import { useDepositState } from '../../_hooks/use-deposit-state'
import { useSelectedDepositAccount } from '../../_hooks/use-selected-account'
import { useSelectedTokenConfig } from '../_hooks/use-selected-balance-info'
import usePrivyInfo from '@/hooks/web3/usePrivyInfo'
import { formatAddress } from '@/libs/utils/format'
import { renderFallback } from '@/utils/format/fallback'

const COUNTDOWN_SECONDS = 60

export const UsdcStep2 = ({
  onBack,
  onClose,
  onSuccess,
  onFail
}: {
  onBack: () => void
  onClose: () => void
  onSuccess: () => void
  onFail: () => void
}) => {
  const { fromWalletAddress, toWalletAddress, depositAmount } = useDepositState()
  const selectedAccount = useSelectedDepositAccount()
  const selectedTokenConfig = useSelectedTokenConfig()
  const { activeSolanaWallet } = usePrivyInfo()

  const [signing, setSigning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Get wallet info
  const walletInfo = activeSolanaWallet
    ? {
        name: (activeSolanaWallet as any).standardWallet?.name || 'Unknown Wallet',
        icon: (activeSolanaWallet as any).standardWallet?.icon
      }
    : null

  const handleConfirmTransfer = async () => {
    if (!toWalletAddress) {
      console.error('No to address')
      return
    }
    setSigning(true)

    try {
      if (!selectedTokenConfig) return

      // TODO: Implement actual transfer logic
      // await transferToken({
      //   fromAddress: fromWalletAddress,
      //   toAddress: toWalletAddress,
      //   amount: amount,
      //   mintAddress: selectedTokenConfig.contractAddress,
      //   decimals: selectedTokenConfig.decimals,
      // })

      onSuccess()
    } catch (error) {
      console.error('Transaction failed:', error)
      onFail()
    } finally {
      setSigning(false)
    }
  }

  return (
    <>
      <ModalHeader className="w-full gap-2xl">
        <ModalTitle className="flex items-center justify-between w-full" showCloseButton={false}>
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-6" />
          </IconButton>
          <div className="flex items-center gap-2">
            <span className="text-paragraph-p1 text-content-1">
              <Trans>订单确认</Trans>
            </span>
          </div>
          <ModalCloseButton iconClassName="size-6" />
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col gap-2xl flex-1">
        {/* From Card */}
        <div className="border border-brand-default rounded-small px-xl py-medium flex flex-col gap-1">
          <div className="text-paragraph-p3 text-white">
            <Trans>付</Trans>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-medium">
              {walletInfo?.icon ? (
                <img src={walletInfo.icon} className="size-6 rounded object-contain" alt={walletInfo.name} />
              ) : (
                <div className="size-6 rounded bg-brand-default" />
              )}
              <div className="flex flex-col gap-1">
                <div className="text-paragraph-p2 text-content-1">{walletInfo?.name || <Trans>未知钱包</Trans>}</div>
                <div className="text-paragraph-p3 text-content-4">{formatAddress(fromWalletAddress)}</div>
              </div>
            </div>
            <div className="text-paragraph-p2 text-content-1">
              {BNumber.toFormatNumber(depositAmount, {
                positive: false,
                forceSign: true,
                unit: selectedTokenConfig?.symbol,
                volScale: selectedTokenConfig?.displayDecimals
              })}
            </div>
          </div>
        </div>

        {/* To Card */}
        <div className="border border-brand-default rounded-small px-xl py-medium flex flex-col gap-1">
          <div className="text-paragraph-p3 text-white">
            <Trans>收</Trans>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-medium">
              {selectedTokenConfig?.iconUrl ? (
                <img src={selectedTokenConfig.iconUrl} className="size-6 rounded-full object-contain" alt="USDC" />
              ) : (
                <IconUSDC className="size-6" />
              )}
              <div className="flex flex-col gap-1">
                <div className="text-paragraph-p2 text-content-1">{renderFallback(selectedAccount?.id)}</div>
                <div className="text-paragraph-p3 text-content-4">{formatAddress(toWalletAddress)}</div>
              </div>
            </div>
            <div className="text-paragraph-p2 text-content-1">
              {BNumber.toFormatNumber(depositAmount, {
                positive: false,
                forceSign: true,
                unit: selectedTokenConfig?.symbol,
                volScale: selectedTokenConfig?.displayDecimals
              })}
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="flex flex-col gap-medium text-paragraph-p2">
          <div className="flex items-center justify-between">
            <span className="text-content-4">
              <Trans>兑换率</Trans>
            </span>
            <span className="text-content-1">1 : 1</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-content-4">
              <Trans>到账时间</Trans>
            </span>
            <span className="text-content-1">
              ≈1<Trans>分钟</Trans>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-content-4">
              <Trans>Gas费</Trans>
            </span>
            <span className="text-content-1">0.0001 SOL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-content-4">
              <Trans>预计到账</Trans>
            </span>
            <span className="text-content-1">
              {BNumber.toFormatNumber(depositAmount, {
                unit: selectedTokenConfig?.symbol,
                volScale: selectedTokenConfig?.displayDecimals
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-content-4">
              <Trans>服务费</Trans>
            </span>
            <span className="text-content-1">
              <Trans>免费</Trans>
            </span>
          </div>
        </div>
      </div>

      <ModalFooter className="p-0">
        <Button block color="primary" size="lg" onClick={handleConfirmTransfer} disabled={signing} loading={signing}>
          {signing ? <Trans>等待签名</Trans> : <Trans>确定</Trans>}
        </Button>
      </ModalFooter>
    </>
  )
}
