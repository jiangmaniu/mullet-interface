'use client'

import { Trans } from '@/libs/lingui/react/macro'
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

export const WalletDepositMoneyModal = ({ isOpen, onClose, children }: DepositModalProps) => {
  const [activeTab, setActiveTab] = useState('deposit')

  const TABS_OPTIONS = [
    {
      label: <Trans>钱包资产入金</Trans>,
      value: 'deposit',
      content: <ExchangeTabContent />
    },
    {
      label: <Trans>加密货币入金</Trans>,
      value: 'exchange',
      content: <DepositTabContent />
    },
    {
      label: <Trans>信用卡买币</Trans>,
      value: 'buy',
      content: <BuyTabContent />
    }
  ]

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      {children && <ModalTrigger asChild>{children}</ModalTrigger>}

      <ModalContent onInteractOutside={(event) => event.preventDefault()} className="flex min-h-[260px] w-full max-w-[360px] min-w-[360px]">
        <ModalHeader className="w-full">
          <ModalTitle className="flex items-center justify-between gap-3">
            <div className={cn('')}>
              <Trans>存款</Trans>
            </div>
          </ModalTitle>
        </ModalHeader>

        <Tabs value={activeTab} size={'md'} variant={'underline'} onValueChange={setActiveTab}>
          <TabsList>
            {TABS_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="flex-1 [&>div]:p-0 [&>div]:py-xl">
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS_OPTIONS.map((option) => (
            <TabsContent key={option.value} value={option.value} className="mt-2xl">
              {option.content}
            </TabsContent>
          ))}
        </Tabs>
      </ModalContent>
    </Modal>
  )
}

const DepositTabContent = () => {
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
    <div className="flex flex-col gap-2xl flex-1">
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
            <div className="font-mono text-xs text-foreground break-all line-clamp-2 flex-1">{depositAddress}</div>
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
            <Trans>确认存款</Trans>
          </Button>
        </ModalClose>
      </ModalFooter>
    </div>
  )
}

const ExchangeTabContent = () => {
  const [payAmount, setPayAmount] = useState<string>('')

  const [payState, setPayState] = useState<{ symbol: string; chainName: string }>({
    symbol: 'USDC',
    chainName: 'Solana'
  })

  const allTokenOptions = useMemo(() => {
    const options: Array<{ symbol: string; chainId: string; chainName: string; token: any }> = []

    SUPPORTED_BRIDGE_CHAINS.forEach((chain) => {
      const tokens = SUPPORTED_TOKENS[chain.id as keyof typeof SUPPORTED_TOKENS]
      if (tokens) {
        tokens.forEach((token) => {
          options.push({
            symbol: token.symbol,
            chainId: chain.id,
            chainName: chain.displayName,
            token
          })
        })
      }
    })
    return options
  }, [])

  return (
    <div className="flex flex-col gap-0 flex-1">
      {/* Pay Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <NumberInput
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            placeholder="0.00"
            className="!border-none flex-1 p-0 [&>input]:font-semibold [&>input]:!text-xl [&>input]:p-0 hover:ring-0 focus-within:border-none focus-within:ring-0"
          />

          <Select
            value={`${payState.chainName}:${payState.symbol}`}
            onValueChange={(val) => {
              const [chainName, symbol] = val.split(':')
              setPayState({ chainName, symbol })
            }}
          >
            <SelectTrigger size="md">
              <SelectValue asChild>
                <div className="flex items-center space-x-xs">
                  <img
                    src={getTokenIcon(payState.symbol)}
                    className="w-6 h-6 rounded-full bg-white"
                    alt={payState.symbol}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <span className="font-medium text-sm">{payState.symbol}</span>
                  {CHAIN_ICONS[payState.chainName] && (
                    <img
                      src={CHAIN_ICONS[payState.chainName]}
                      className="w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border border-black"
                      alt={payState.chainName}
                    />
                  )}
                </div>
              </SelectValue>
            </SelectTrigger>

            <RichSelectContent position="popper" align="end" className="w-[328px]">
              {allTokenOptions.map((option) => (
                <RichSelectItem
                  key={`${option.chainName}:${option.symbol}`}
                  value={`${option.chainName}:${option.symbol}`}
                  className="py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={getTokenIcon(option.symbol)}
                        className="w-6 h-6 rounded-full bg-white object-contain"
                        alt={option.symbol}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      {CHAIN_ICONS[option.chainName] && (
                        <img
                          src={CHAIN_ICONS[option.chainName]}
                          className="w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border border-black"
                          alt={option.chainName}
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 justify-center">
                      <div className="flex items-center justify-between">
                        <span className="text-paragraph-p2 text-content-1">{option.symbol}</span>
                        <span className="text-paragraph-p2 tex  t-content-1">19253.00000 USDC</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-paragraph-p3 text-content-4">{option.chainName}</span>
                        <span className="text-paragraph-p3 text-content-4">US$19253.00000</span>
                      </div>
                    </div>
                  </div>
                </RichSelectItem>
              ))}
            </RichSelectContent>
          </Select>
        </div>

        <div className="text-xs flex justify-end gap-1">
          <span className="text-content-4">0.000000 {payState.symbol}</span>
          <span className="text-white">最大</span>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center py-xs">
        <Separator className="flex-1" />
        <Iconify icon="iconoir:data-transfer-both" fontSize={24} className="text-zinc-400" />
        <Separator className="flex-1" color="rgba(101, 104, 134, 0.20)" />
      </div>

      {/* Receive Input Section */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-zinc-300">0.00</div>
        <div className="shrink-0 ml-4">
          <div className="flex items-center gap-xs rounded-2 px-xl py-large border border-border box-border h-11">
            <img src={getTokenIcon('USDC')} className="w-6 h-6 rounded-full bg-white" alt="USDC" />
            <span className="font-medium text-small">USDC</span>
          </div>
        </div>
      </div>

      {/* Warning/Info */}
      <Alert className="mt-2xl">
        <Iconify icon="iconoir:chat-bubble-warning" className="size-4" />
        <AlertTitle>
          <Trans>预计在3分钟内完成，请留意通知或查看钱包余额</Trans>
        </AlertTitle>
      </Alert>

      {/* Fees */}
      <div className="flex items-center text-xs text-content-4 px-1 gap-9 leading-4 my-2xl">
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
            <Trans>确认兑换</Trans>
          </Button>
        </ModalClose>
      </ModalFooter>
    </div>
  )
}

const BuyTabContent = () => {
  return (
    <div className="flex items-center justify-center py-4xl">
      <IconSpecialIconLoader />
    </div>
  )
}

const ExchangeLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-4xl pb-3xl gap-2.5">
      <img src={getTokenIcon('USDC')} alt="USDC" className="w-[50px] h-[50px] rounded-full bg-white object-contain" />
      <div className="flex items-center gap-xs">
        <IconCodexLoader className=" animate-spin" />
        <span className="text-paragraph-p2">
          <Trans>正在兑换USDC...</Trans>
        </span>
      </div>
    </div>
  )
}

const ExchangeError = () => {
  return (
    <div className="flex-col gap-2xl">
      <div className="flex flex-col items-center justify-center py-4xl gap-2.5">
        <IconFail width={50} height={50} />
        <span className="text-paragraph-p2">
          <Trans>USDC兑换失败</Trans>
        </span>
      </div>
      <Button block color="primary" size="lg">
        <Trans>重新兑换</Trans>
      </Button>
    </div>
  )
}
