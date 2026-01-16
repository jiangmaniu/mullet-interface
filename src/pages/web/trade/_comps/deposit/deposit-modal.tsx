'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { Copy, ArrowLeft } from 'lucide-react'
import { observer } from 'mobx-react'

import { Button } from '@/libs/ui/components/button'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger, ModalClose, ModalFooter } from '@/libs/ui/components/modal'
import { Select, SelectTrigger, SelectValue } from '@/libs/ui/components/select'
import { getTokenIcon, CHAIN_ICONS } from '@/config/tokenIcons'

import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { NumberInput } from '@/components/input/number-input'
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
import { AlertTitle, Alert } from '@/libs/ui/components/alert'
import { RichSelectContent, RichSelectItem, RichSelectTrigger } from '@/libs/ui/components/rich-select'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { IconMasterCord } from '@/libs/ui/components/icons/set/master-cord'

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
        return <CryptoDepositView onBack={() => setActiveView('menu')} />
      case 'buy':
        return <FiatBuyView onBack={() => setActiveView('menu')} />
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

import { WalletAssets } from './wallet-assets'

const CryptoDepositView = observer(({ onBack }: { onBack: () => void }) => {
  const uniqueAssets = useMemo(() => {
    const assets = new Map<string, { symbol: string; name: string }>()
    Object.values(SUPPORTED_TOKENS)
      .flat()
      .forEach((token) => {
        if (!assets.has(token.symbol)) {
          assets.set(token.symbol, { symbol: token.symbol, name: token.name })
        }
      })
    return Array.from(assets.values())
  }, [])

  const [selectedAsset, setSelectedAsset] = useState<string>('USDC')
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Ethereum')

  const availableNetworks = useMemo(() => {
    return SUPPORTED_BRIDGE_CHAINS.filter((chain) => {
      const chainTokens = SUPPORTED_TOKENS[chain.id as keyof typeof SUPPORTED_TOKENS]
      return chainTokens?.some((t) => t.symbol === selectedAsset)
    })
  }, [selectedAsset])

  useEffect(() => {
    const isCurrentNetworkValid = availableNetworks.some((n) => n.displayName === selectedNetwork)
    if (!isCurrentNetworkValid && availableNetworks.length > 0) {
      setSelectedNetwork(availableNetworks[0].displayName)
    }
  }, [selectedAsset, availableNetworks, selectedNetwork])

  const depositAddress = MOCK_DEPOSIT_ADDRESSES[selectedNetwork] || ''

  const handleCopy = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress)
      toast.success('Address copied to clipboard')
    }
  }

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6 -ml-1 text-content-4 hover:text-foreground" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <Trans>加密货币入金</Trans>
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col gap-2xl flex-1">
        <div className="flex flex-col relative grid gap-4">
          <Select value={selectedAsset} onValueChange={(val) => setSelectedAsset(val)}>
            <RichSelectTrigger label={<Trans>选择币种</Trans>} className="w-full h-11">
              <SelectValue>
                <div className="flex items-center gap-medium">
                  <img
                    src={getTokenIcon(selectedAsset)}
                    alt={selectedAsset}
                    className="w-4 h-4 rounded-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <span className="text-paragraph-p2">{selectedAsset}</span>
                </div>
              </SelectValue>
            </RichSelectTrigger>
            <RichSelectContent position="popper">
              {uniqueAssets.map((asset) => (
                <RichSelectItem key={asset.symbol} value={asset.symbol} className="py-small">
                  <div className="flex items-center gap-medium">
                    <img
                      src={getTokenIcon(asset.symbol)}
                      alt={asset.symbol}
                      className="w-4 h-4 rounded-full object-contain bg-white"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <span className="text-paragraph-p2">{asset.symbol}</span>
                  </div>
                </RichSelectItem>
              ))}
            </RichSelectContent>
          </Select>

          <Select value={selectedNetwork} onValueChange={(val) => setSelectedNetwork(val)}>
            <RichSelectTrigger label={<Trans>选择网络</Trans>} className="w-full h-11">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {CHAIN_ICONS[selectedNetwork] && (
                    <img src={CHAIN_ICONS[selectedNetwork]} alt={selectedNetwork} className="w-4 h-4 rounded-full object-contain" />
                  )}
                  <span className="text-paragraph-p2">{selectedNetwork}</span>
                </div>
              </SelectValue>
            </RichSelectTrigger>
            <RichSelectContent position="popper">
              {availableNetworks.map((net) => (
                <RichSelectItem key={net.displayName} value={net.displayName} className="py-small">
                  <div className="flex items-center gap-medium">
                    {CHAIN_ICONS[net.displayName] && (
                      <img src={CHAIN_ICONS[net.displayName]} alt={net.displayName} className="w-4 h-4 rounded-full object-contain" />
                    )}
                    <span className="text-paragraph-p2">{net.displayName}</span>
                  </div>
                </RichSelectItem>
              ))}
            </RichSelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm text-content-4">
            <Trans>存款地址</Trans>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="p-2 bg-white rounded-medium">
              <QRCodeSVG value={depositAddress} size={120} level="M" includeMargin={false} />
            </div>

            <div
              className="group w-full flex items-center justify-between gap-2xl p-2xl bg-[rgba(6,_7,_23,_0.90)] rounded-lg border border-transparent hover:border-primary/30 transition-all cursor-pointer"
              onClick={handleCopy}
            >
              <div className="font-mono text-paragraph-p3 text-foreground break-all line-clamp-2 flex-1">{depositAddress}</div>
              <div className="shrink-0 text-content-4 group-hover:text-primary transition-colors">
                <Copy size={14} className="text-zinc-300" />
              </div>
            </div>
          </div>
        </div>

        <Alert>
          <Iconify icon="iconoir:chat-bubble-warning" className="size-4" />
          <AlertTitle>
            <Trans>您可以向此地址发送任何可接受的代币，它将⾃动兑换成USDC转⼊您的账⼾</Trans>
          </AlertTitle>
        </Alert>

        <div className="flex items-center text-paragraph-p3 text-content-4 px-1 gap-9 leading-4">
          <div className="flex flex-1 justify-between">
            <GeneralTooltip content={<Trans>预估滑点</Trans>}>
              <TooltipTriggerDottedText>
                <Trans>预估滑点</Trans>
              </TooltipTriggerDottedText>
            </GeneralTooltip>
            <span className="text-foreground ml-2">0.00 USDC</span>
          </div>

          <div className="flex flex-1 justify-between">
            <GeneralTooltip content={<Trans>交易费用</Trans>}>
              <TooltipTriggerDottedText>
                <Trans>交易费用</Trans>
              </TooltipTriggerDottedText>
            </GeneralTooltip>
            <span className="text-foreground ml-2">0.00 USDC</span>
          </div>
        </div>

        <ModalFooter className="p-0">
          <ModalClose asChild>
            <Button block color="primary" size="md">
              <Trans>确认存款</Trans>
            </Button>
          </ModalClose>
        </ModalFooter>
      </div>
    </>
  )
})

const FiatBuyView = observer(({ onBack }: { onBack: () => void }) => {
  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6 -ml-1 text-content-4 hover:text-foreground" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <Trans>信用卡买币</Trans>
        </ModalTitle>
      </ModalHeader>
      <div className="flex items-center justify-center py-4xl min-h-[300px]">
        <IconSpecialIconLoader />
      </div>
    </>
  )
})
