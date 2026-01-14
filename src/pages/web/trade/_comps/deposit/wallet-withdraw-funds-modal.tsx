'use client'

import { t, Trans } from '@/libs/lingui/react/macro'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

import { Button } from '@/libs/ui/components/button'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger, ModalClose, ModalFooter } from '@/libs/ui/components/modal'
import { Select, SelectTrigger, SelectValue } from '@/libs/ui/components/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { getTokenIcon, CHAIN_ICONS } from '@/config/tokenIcons'
import { cn } from '@/libs/ui/lib/utils'

import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { useMemo } from 'react'
import { NumberInput } from '@/components/input/number-input'
import { IconCodexLoader, IconFail, Iconify, IconSpecialIconLoader } from '@/libs/ui/components/icons'
import { Separator } from '@/libs/ui/components/separator'
import { AlertTitle, Alert } from '@/libs/ui/components/alert'
import { RichSelectContent, RichSelectItem, RichSelectTrigger } from '@/libs/ui/components/rich-select'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { Textarea } from '@/libs/ui/components/textarea'
import { Input } from '@/libs/ui/components/input'

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

export const WalletWithdrawFundsModal = ({ isOpen, onClose, children }: DepositModalProps) => {
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
      toast.success('Address copied to clipbo ard')
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      {children && <ModalTrigger asChild>{children}</ModalTrigger>}

      <ModalContent onInteractOutside={(event) => event.preventDefault()} className="flex min-h-[260px] w-full max-w-[360px] min-w-[360px]">
        <ModalHeader className="w-full">
          <ModalTitle className="flex items-center justify-between gap-3">
            <div className={cn('')}>
              <Trans>提现</Trans>
            </div>
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col gap-2xl flex-1 mt-2xl">
          <div className="flex flex-col relative">
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
          </div>

          <div className="flex flex-col relative">
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

          <div className="relative">
            <div className="text-paragraph-p3 text-content-4 absolute left-3 top-[-8px] bg-background z-10">
              <Trans>提现地址</Trans>
            </div>
            <Textarea placeholder={t`输入取现地址`} className="resize-none min-h-11 text-paragraph-p2 text-content-1" rows={2}></Textarea>
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative">
              <Input placeholder={t`输入取现数量`} className="min-h-11 text-paragraph-p2 text-content-1" />
            </div>
            <div className="flex items-center justify-between">
              <span>
                <Trans>可用</Trans>
              </span>
              <span>0.00000 USDC</span>
            </div>
          </div>

          <Alert>
            <Iconify icon="iconoir:chat-bubble-warning" className="size-4" />
            <AlertTitle>
              <Trans>请确保您选择的提现⽹络，与您在外部钱包/交易所的收款⽹络⼀致。否则资产可能会丢失</Trans>
            </AlertTitle>
          </Alert>

          <div className="flex items-center text-xs text-content-4 px-1 gap-9 leading-4">
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

          <ModalFooter>
            <ModalClose asChild>
              <Button block color="primary" size="md">
                <Trans>提取至Arbitrum</Trans>
              </Button>
            </ModalClose>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  )
}
