import { Trans } from '@/libs/lingui/react/macro'
import { useState, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalFooter, ModalHeader, ModalTitle } from '@/libs/ui/components/modal'

import { Select, SelectValue } from '@/libs/ui/components/select'
import { getTokenIcon, CHAIN_ICONS } from '@/config/tokenIcons'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/ui/components/accordion'
import { IconCodexLoader, Iconify } from '@/libs/ui/components/icons'
import { Alert, AlertTitle } from '@/libs/ui/components/alert'
import { RichSelectContent, RichSelectItem, RichSelectTrigger } from '@/libs/ui/components/rich-select'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'

import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { GeneralTooltip } from '@/components/tooltip'
import { IconSuccess } from '@/libs/ui/components/icons/set/success'

export const MOCK_DEPOSIT_ADDRESSES: Record<string, string> = {
  Tron: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
  Ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  Solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  Arbitrum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  BSC: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  Bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
}

export const Cryptocurrency = ({ onBack }: { onBack: () => void }) => {
  const [selectedAsset, setSelectedAsset] = useState<string>('USDC')
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Arbitrum')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')

  // Mock balance
  const walletBalance = '153,568.00'

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

  const availableNetworks = useMemo(() => {
    return SUPPORTED_BRIDGE_CHAINS.filter((chain) => {
      const chainTokens = SUPPORTED_TOKENS[chain.id as keyof typeof SUPPORTED_TOKENS]
      return chainTokens?.some((t) => t.symbol === selectedAsset)
    })
  }, [selectedAsset])

  const depositAddress = MOCK_DEPOSIT_ADDRESSES[selectedNetwork] || MOCK_DEPOSIT_ADDRESSES['Ethereum']

  const handleCopy = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress)
      toast.success(<Trans>您可以向此地址发送任何可接受的代币，它将自动兑换成USDC转入您的账户。</Trans>)
    }
  }

  const handleConfirm = () => {
    setStatus('processing')
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
    }, 3000)
  }

  const handleCloseStatus = () => {
    setStatus('idle')
  }

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center w-full gap-medium">
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
          </IconButton>
          <div className="flex flex-col gap-xs">
            <Trans>加密货币入金</Trans>
            <div className="text-paragraph-p3 text-content-4 !font-normal">
              <Trans>钱包余额：${walletBalance}</Trans>
            </div>
          </div>
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl px-1">
        {/* ... Asset and Network Selectors ... */}
        <div className="flex flex-col relative">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
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
                <RichSelectItem key={asset.symbol} value={asset.symbol} className="p-xl">
                  <div className="flex items-center gap-medium">
                    <img
                      src={getTokenIcon(asset.symbol)}
                      alt={asset.symbol}
                      className="w-6 h-6 rounded-full object-contain bg-white"
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

        {/* Network Selector */}
        <div className="flex flex-col relative">
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
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
                <RichSelectItem key={net.displayName} value={net.displayName} className="p-xl">
                  <div className="flex items-center gap-medium">
                    {CHAIN_ICONS[net.displayName] && (
                      <img src={CHAIN_ICONS[net.displayName]} alt={net.displayName} className="w-6 h-6 rounded-full object-contain" />
                    )}
                    <span className="text-paragraph-p2">{net.displayName}</span>
                  </div>
                </RichSelectItem>
              ))}
            </RichSelectContent>
          </Select>
        </div>

        {/* Deposit Address */}
        <div className="flex flex-col gap-medium">
          <div className="text-paragraph-p3 text-content-4">
            <Trans>存款地址</Trans>
          </div>

          <div className="flex flex-col items-center gap-medium">
            <div className="p-2 bg-white rounded-medium">
              <QRCodeSVG value={depositAddress} size={120} level="M" includeMargin={false} />
            </div>

            <div className="group w-full flex items-center gap-2xl p-2xl bg-pop-up-mask rounded-small">
              <div className="text-paragraph-p3 text-content-1 break-all line-clamp-2 flex-1">{depositAddress}</div>
              <Tooltip>
                <TooltipTrigger>
                  <IconButton variant="ghost" size="icon-sm" onClick={handleCopy}>
                    <Iconify icon="iconoir:copy" className="size-4 text-brand-special" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>
                  <Trans>点击复制</Trans>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert>
          <Iconify icon="iconoir:chat-bubble-warning" className="size-4" />
          <AlertTitle>
            <Trans>您可以向此地址发送任何可接受的代币，它将⾃动兑换成USDC转⼊您的账⼾</Trans>
          </AlertTitle>
        </Alert>

        {/* Transaction Details */}
        <div className="bg-surface-elevation-2 rounded-small overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="py-medium px-large hover:no-underline">
                <span className="text-paragraph-p3 text-content-4">
                  <Trans>交易明细</Trans>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-large pb-medium">
                <div className="space-y-medium">
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>价格影响</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>价格影响</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">0.00%</span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>预估滑点</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>预估滑点</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">
                      <Trans>自动</Trans> 0.00%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-paragraph-p3">
                    <span className="text-content-4">
                      <GeneralTooltip content={<Trans>处理时间</Trans>}>
                        <TooltipTriggerDottedText>
                          <Trans>处理时间</Trans>
                        </TooltipTriggerDottedText>
                      </GeneralTooltip>
                    </span>
                    <span className="text-white">
                      <Trans>不到1分钟</Trans>
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Help Link */}
        <div className="text-paragraph-p3 text-content-4">
          <Trans>遇到问题？</Trans>
          <a href="#" className="underline text-white ml-1">
            <Trans>获取帮助</Trans>
          </a>
        </div>

        {/* Status Transition Overlay */}
        {status !== 'idle' && (
          <div className="absolute bottom-0 left-0 right-0 z-10 w-full animate-in slide-in-from-bottom duration-300">
            <div className="bg-primary rounded-large border border-brand-default p-2xl">
              <div className="flex items-start justify-between mb-xl">
                <div className="flex items-center gap-medium">
                  {status === 'processing' ? <IconCodexLoader className="h-6 w-6 animate-spin" /> : <IconSuccess className="h-6 w-6" />}
                  <div className="flex flex-col gap-xs">
                    <span className="text-paragraph-p2 text-content-1">
                      {status === 'processing' ? <Trans>存款已接收并正在处理中...</Trans> : <Trans>存款完成</Trans>}
                    </span>
                    <span className="text-paragraph-p3 text-content-4">
                      {status === 'processing' ? <Trans>您的存款很快到账</Trans> : <Trans>您的存款已入账户</Trans>}
                    </span>
                  </div>
                </div>
                <div className="h-full">
                  <IconButton variant="ghost" size="icon-sm" onClick={handleCloseStatus}>
                    <Iconify icon="iconoir:xmark" className="size-6 text-brand-special" />
                  </IconButton>
                </div>
              </div>

              <div className="mt-large space-y-xs border border-default rounded-small px-xl py-medium">
                <div className="flex items-center justify-between text-paragraph-p2">
                  <span className="text-content-1">
                    <Trans>存款交易</Trans>
                  </span>
                  <a href="#">
                    <span className="text-content-4">3212...rowt</span>
                  </a>
                </div>

                {status === 'success' && (
                  <div className="flex items-center justify-between text-paragraph-p2">
                    <span className="text-content-1">
                      <Trans>完成交易</Trans>
                    </span>
                    <a href="#">
                      <span className="text-content-4">3212...rowt</span>
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between text-paragraph-p2">
                  <span className="text-content-1">
                    <Trans>订单已提交</Trans>
                  </span>
                  <span className="text-content-4">1月15日 12:00:00</span>
                </div>

                {status === 'success' && (
                  <div className="flex items-center justify-between text-paragraph-p2">
                    <span className="text-content-1">
                      <Trans>订单已成交</Trans>
                    </span>
                    <span className="text-content-4">1月15日 12:00:00</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ModalFooter className="p-0 mt-auto">
          <Button block color="primary" size="lg" onClick={handleConfirm}>
            <Trans>确认存款</Trans>
          </Button>
        </ModalFooter>
      </div>
    </>
  )
}
