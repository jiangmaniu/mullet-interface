import { Trans } from '@/libs/lingui/react/macro'
import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { Button, IconButton } from '@/libs/ui/components/button'
import { Modal, ModalContent, ModalClose, ModalFooter, ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { Select, SelectValue } from '@/libs/ui/components/select'
import { getTokenIcon, CHAIN_ICONS } from '@/config/tokenIcons'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/ui/components/accordion'
import { IconCodexLoader, Iconify } from '@/libs/ui/components/icons'
import { Alert, AlertTitle } from '@/libs/ui/components/alert'
import { RichSelectContent, RichSelectItem, RichSelectTrigger } from '@/libs/ui/components/rich-select'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { Input } from '@/libs/ui/components/input'
import { Textarea } from '@/libs/ui/components/textarea'

import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { GeneralTooltip } from '@/components/tooltip'
import { IconSuccess } from '@/libs/ui/components/icons/set/success'

export type WithdrawalModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const [selectedAsset, setSelectedAsset] = useState<string>('USDC')
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Arbitrum')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStatus('idle')
        setWithdrawAddress('')
        setWithdrawAmount('')
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Mock balance
  const availableBalance = '0.00000'

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

  const handleMax = () => {
    setWithdrawAmount(availableBalance)
  }

  const handleConfirm = () => {
    if (!withdrawAddress) {
      toast.error(<Trans>请输入取现地址</Trans>)
      return
    }
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error(<Trans>请输入有效的取现数量</Trans>)
      return
    }

    setStatus('processing')
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
    }, 3000)
  }

  const handleCloseStatus = () => {
    setStatus('idle')
    setWithdrawAddress('')
    setWithdrawAmount('')
  }

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent onInteractOutside={(event) => event.preventDefault()} className="flex w-full max-w-[360px] min-w-[360px] gap-2xl p-2xl">
        <ModalHeader className="w-full">
          <ModalTitle className="flex items-center w-full gap-medium" showCloseButton={false}>
            {/* Back button logic if needed, currently reusing styles from deposit */}
            {/* If this is a standalone modal opened directly, onBack might not be needed or closes modal */}
            {/* Design shows just Title "取现" and Close button X */}
            <div className="flex flex-col gap-xs flex-1">
              <Trans>取现</Trans>
            </div>
            <ModalClose asChild>
              <IconButton variant="ghost" className="text-content-4 ml-auto" size={'icon-sm'}>
                <Iconify icon="iconoir:cancel" className="size-5" />
              </IconButton>
            </ModalClose>
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col flex-1 gap-2xl">
          {/* Asset Selector */}
          <div className="flex flex-col relative">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <RichSelectTrigger label={<Trans>选择币种</Trans>} value={selectedAsset} className="w-full h-11">
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
              <RichSelectTrigger label={<Trans>选择网络</Trans>} value={selectedNetwork} className="w-full h-11">
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

          {/* Withdrawal Address Input */}
          <Textarea
            labelText={<Trans>取现地址</Trans>}
            placeholder={<Trans>输入取现地址</Trans>}
            value={withdrawAddress}
            onValueChange={setWithdrawAddress}
            size="md"
            clean
          />

          <div className="flex flex-col gap-medium">
            {/* Withdrawal Amount Input */}
            <Input
              type="number"
              labelText={<Trans>取现数量</Trans>}
              placeholder={<Trans>输入取现数量</Trans>}
              value={withdrawAmount}
              onValueChange={setWithdrawAmount}
              size="md"
              RightContent={
                <div
                  className="px-medium text-paragraph-p3 text-content-1 cursor-pointer hover:text-white transition-colors"
                  onClick={handleMax}
                >
                  <Trans>全部</Trans>
                </div>
              }
            />
            <div className="flex items-center justify-between gap-xs text-paragraph-p3">
              <span className=" text-content-4">
                <Trans>可用</Trans>
              </span>
              <span className="text-content-1">
                {availableBalance} {selectedAsset}
              </span>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert className="border-warning/20 bg-warning/5 text-warning">
            <Iconify icon="iconoir:chat-bubble-warning" className="size-4 shrink-0 mt-0.5" />
            <AlertTitle className="text-paragraph-p3 font-normal leading-relaxed">
              <Trans>请确保您选择的提现⽹络，与您在外部钱包/交易所的收款⽹络⼀致。否则资产可能会丢失</Trans>
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
                        <GeneralTooltip content={<Trans>网络费用</Trans>}>
                          <TooltipTriggerDottedText>
                            <Trans>网络费用</Trans>
                          </TooltipTriggerDottedText>
                        </GeneralTooltip>
                      </span>
                      <span className="text-white">0.00 USDC</span>
                    </div>
                    <div className="flex items-center justify-between text-paragraph-p3">
                      <span className="text-content-4">
                        <GeneralTooltip content={<Trans>实际到账</Trans>}>
                          <TooltipTriggerDottedText>
                            <Trans>实际到账</Trans>
                          </TooltipTriggerDottedText>
                        </GeneralTooltip>
                      </span>
                      <span className="text-white">
                        {withdrawAmount ? withdrawAmount : '0.00'} {selectedAsset}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                        {status === 'processing' ? <Trans>提现申请已提交...</Trans> : <Trans>提现成功</Trans>}
                      </span>
                      <span className="text-paragraph-p3 text-content-4">
                        {status === 'processing' ? <Trans>您的提现正在处理中</Trans> : <Trans>您的提现已发出</Trans>}
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
                      <Trans>提现数量</Trans>
                    </span>
                    <span className="text-content-4">
                      {withdrawAmount} {selectedAsset}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-paragraph-p2">
                    <span className="text-content-1">
                      <Trans>提现网络</Trans>
                    </span>
                    <span className="text-content-4">{selectedNetwork}</span>
                  </div>

                  <div className="flex items-center justify-between text-paragraph-p2">
                    <span className="text-content-1">
                      <Trans>目标地址</Trans>
                    </span>
                    <span className="text-content-4 cursor-pointer hover:text-white" title={withdrawAddress}>
                      {withdrawAddress.slice(0, 6)}...{withdrawAddress.slice(-4)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-paragraph-p2">
                    <span className="text-content-1">
                      <Trans>提交时间</Trans>
                    </span>
                    <span className="text-content-4">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ModalFooter className="p-0 mt-auto">
            <Button block variant="primary" color="primary" size="lg" onClick={handleConfirm} className="text-black">
              <Trans>提取至{selectedNetwork}</Trans>
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  )
}
