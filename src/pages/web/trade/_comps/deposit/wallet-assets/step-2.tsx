import { Trans } from '@/libs/lingui/react/macro'
import { useState } from 'react'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle, ModalFooter } from '@/libs/ui/components/modal'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { cn } from '@/libs/ui/lib/utils'
import { Iconify, IconSolana, IconUSDC } from '@/libs/ui/components/icons'
import { NumberInputPrimitive } from '@/libs/ui/components/number-input-primitive'
import { BNumber } from '@/libs/utils/number'

export const WalletAssetsStep2 = ({
  onBack,
  selectedAsset,
  amount,
  onAmountChange,
  onNext
}: {
  onBack: () => void
  selectedAsset: { symbol: string; chainName: string } | null
  amount: string
  onAmountChange: (val: string) => void
  onNext: () => void
}) => {
  const [percent, setPercent] = useState<number | null>(null)

  const handlePercentSelect = (p: number) => {
    setPercent(p)
    // Mock calculation: Total balance is 153568.00
    const total = 153568.0
    if (p === 100) {
      onAmountChange(total.toFixed(2))
    } else {
      onAmountChange(((total * p) / 100).toFixed(2))
    }
  }

  const isEmpty = amount === '' || parseFloat(amount) === 0

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center w-full gap-medium">
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
          </IconButton>
          <div className="flex flex-col gap-xs">
            <Trans>充值您的钱包</Trans>
            <div className="text-paragraph-p3 text-content-4 !font-normal">
              <Trans>钱包余额：$153,568.00</Trans>
            </div>
          </div>
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl">
        {/* Input Section */}
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center gap-xs py-2xl text-title-h2">
            <span className="text-content-1 flex-shrink-0">$</span>
            <div className="w-auto relative">
              <div className="opacity-0 text-nowrap">{BNumber.toFormatNumber(amount ?? 0, { fallbackToZero: true, volScale: 2 })}</div>
              <NumberInputPrimitive
                value={amount}
                onValueChange={(val: any) => {
                  onAmountChange(val.value)
                }}
                placeholder="0.00"
                thousandSeparator
                decimalScale={2}
                className={cn('absolute top-0 left-0 w-full h-full', isEmpty ? 'text-content-4' : 'text-white')}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-paragraph-p2 text-content-4">
            <Iconify icon="iconoir:data-transfer-both" fontSize={16} />
            <span>{BNumber.toFormatNumber(amount, { fallbackToZero: true, volScale: 2, unit: 'USDC' })}</span>
          </div>
        </div>

        <div className="w-full">
          <Tabs value={percent?.toString() || ''} onValueChange={(val) => handlePercentSelect(Number(val))} variant="solid" size="sm">
            <TabsList className="w-full items-center justify-center gap-medium">
              {[25, 50, 75, 100].map((p) => (
                <TabsTrigger key={p} value={p.toString()} className="[&>div]:px-2xl [&>div]:py-small">
                  {p === 100 ? 'Max' : `${p}%`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Send -> Receive Visual */}
        <div className="flex flex-col gap-xs">
          <div className="text-paragraph-p3 text-content-4 text-center">
            <Trans>最低存款金额$1</Trans>
          </div>
          <div className="flex items-center justify-center gap-large p-xl">
            <div className="flex items-center gap-medium">
              <div className="relative h-6">
                <IconUSDC />
                <IconSolana width={10} height={10} className="absolute bottom-0 right-0 translate-y-1/5 translate-x-1/5" />
              </div>
              <div className="flex flex-col">
                <span className="text-paragraph-p2 text-content-1">
                  <Trans>您将发送</Trans>
                </span>
                <span className="text-paragraph-p3 text-content-4">{selectedAsset?.symbol}</span>
              </div>
            </div>

            <Iconify icon="iconoir:arrow-right-tag-solid" fontSize={24} className="text-brand-secondary-1" />

            <div className="flex items-center gap-medium justify-center">
              <div className="relative h-6">
                <IconUSDC />
                <IconSolana width={10} height={10} className="absolute bottom-0 right-0 translate-y-1/5 translate-x-1/5" />
              </div>

              <div className="flex flex-col">
                <span className="text-paragraph-p2 text-content-1">
                  <Trans>您将收到</Trans>
                </span>
                <span className="text-paragraph-p3 text-content-4">USDC</span>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter className="p-0">
          <Button block color="primary" size="lg" disabled={!amount || parseFloat(amount) <= 0} onClick={onNext}>
            <Trans>确定</Trans>
          </Button>
        </ModalFooter>
      </div>
    </>
  )
}
