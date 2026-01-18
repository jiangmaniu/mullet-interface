'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react'

import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/libs/ui/components/modal'

import {
  IconArbitrum,
  IconBitcoin,
  Iconify,
  IconMetamask,
  IconOkxWallet,
  IconpEthereumEth,
  IconSpecialIconLoader,
  IconUSDC,
  IconVisa
} from '@/libs/ui/components/icons'
import { Separator } from '@/libs/ui/components/separator'
import { IconMasterCord } from '@/libs/ui/components/icons/set/master-cord'
import { WalletAssets } from './wallet-assets'
import { Cryptocurrency } from './cryptocurrency'
import { CreditCardBuy } from './credit-card-buy'

export const MOCK_DEPOSIT_ADDRESSES: Record<string, string> = {
  Tron: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
  Ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  Solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  Arbitrum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  BSC: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  Bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
}

export type DepositModalProps = {
  isOpen?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

type DepositView = 'menu' | 'wallet' | 'crypto' | 'buy'

export const DepositModal = observer(({ isOpen, onClose, children }: DepositModalProps) => {
  const [activeView, setActiveView] = useState<DepositView>('menu')

  // Reset to menu when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setActiveView('menu'), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const content = useMemo(() => {
    switch (activeView) {
      case 'menu':
        return <DepositMenuContent onSelect={setActiveView} />
      case 'wallet':
        return <WalletAssets onBack={() => setActiveView('menu')} />
      case 'crypto':
        return <Cryptocurrency onBack={() => setActiveView('menu')} />
      case 'buy':
        return <CreditCardBuy onBack={() => setActiveView('menu')} />
      default:
        return <DepositMenuContent onSelect={setActiveView} />
    }
  }, [activeView])

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      {children && <ModalTrigger asChild>{children}</ModalTrigger>}

      <ModalContent onInteractOutside={(event) => event.preventDefault()} className="flex w-full max-w-[360px] min-w-[360px] gap-2xl p-2xl">
        {content}
      </ModalContent>
    </Modal>
  )
})

const DepositMenuContent = observer(({ onSelect }: { onSelect: (view: DepositView) => void }) => {
  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle>
          <div className="">
            <Trans>存款</Trans>
          </div>
        </ModalTitle>
        <div className="text-paragraph-p3 text-content-4">
          <Trans>选择适合您的入金方式</Trans>
        </div>
      </ModalHeader>

      <div className="flex flex-col gap-2xl">
        {/* Wallet Deposit */}
        <div
          onClick={() => onSelect('wallet')}
          className="group relative flex items-center gap-2 px-xl py-medium rounded-small border border-default transition-all cursor-pointer hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white"
        >
          <Iconify icon="iconoir:wallet-solid" className="w-6 h-6" />

          <div className="flex flex-col gap-xs flex-1">
            <div className="text-paragraph-p2 text-content-1">
              <Trans>钱包资产入金</Trans>
            </div>
            <div className="text-paragraph-p3 text-content-4">
              <Trans>无限制 · 即时</Trans>
            </div>
          </div>

          <div className="flex -space-x-xs items-center">
            <IconMetamask />
            <IconOkxWallet />
            <IconArbitrum />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <Separator className="flex-1 border-brand-divider-line" />
          <span className="text-paragraph-p3 text-content-4">
            <Trans>或者</Trans>
          </span>
          <Separator className="flex-1 border-brand-divider-line" />
        </div>

        {/* Crypto Deposit */}
        <div
          onClick={() => onSelect('crypto')}
          className="group relative flex items-center gap-2 px-xl py-medium rounded-small border border-default transition-all cursor-pointer hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white"
        >
          <Iconify icon="iconoir:flash-solid" className="w-6 h-6" />

          <div className="flex flex-col gap-xs flex-1">
            <div className="text-paragraph-p2 text-content-1">
              <Trans>加密货币入金</Trans>
            </div>
            <div className="text-paragraph-p3 text-content-4">
              <Trans>无限制 · 即时</Trans>
            </div>
          </div>
          <div className="flex -space-x-xs items-center">
            <IconBitcoin />
            <IconpEthereumEth />
            <IconUSDC />
          </div>
        </div>

        {/* Credit Card Buy */}
        <div
          onClick={() => onSelect('buy')}
          className="group relative flex items-center gap-2 px-xl py-medium rounded-small border border-default transition-all cursor-pointer hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white"
        >
          <Iconify icon="iconoir:credit-card-solid" className="w-6 h-6" />

          <div className="flex flex-col gap-xs flex-1">
            <div className="text-paragraph-p2 text-content-1">
              <Trans>信用卡买币</Trans>
            </div>
            <div className="text-paragraph-p3 text-content-4">
              <Trans>$50000 · 5分钟</Trans>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <IconVisa />
            <IconMasterCord />
          </div>
        </div>
      </div>
    </>
  )
})
