import { Trans } from '@/libs/lingui/react/macro'
import { useCallback, useState } from 'react'
import type { NumberFormatValues } from 'react-number-format'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle, ModalFooter, ModalCloseButton, ModalDescription } from '@/libs/ui/components/modal'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { Iconify, IconUSDC } from '@/libs/ui/components/icons'
import { NumberInputPrimitive, NumberInputSourceInfo, NumberInputSourceType } from '@/libs/ui/components/number-input-primitive'
import { BNumber } from '@/libs/utils/number'
import { renderFallbackPlaceholder } from '@/utils/format/fallback'
import { useUSDCTokenConfig } from '../_hooks/use-token-config'
import { useSelectedTokenBalance } from '../_hooks/use-selected-balance-info'
import { useDepositActions } from '../../_hooks/use-deposit-state'
import { Image } from '@/libs/ui/components/images'

const PERCENT_OPTIONS = [
  { label: '25%', value: '25' },
  { label: '50%', value: '50' },
  { label: '75%', value: '75' },
  { label: 'Max', value: '100' }
]

export const UsdcStep1 = ({ onBack, onClose, onNext }: { onBack: () => void; onClose: () => void; onNext: () => void }) => {
  const [amount, setAmount] = useState<string>('')
  const { setDepositAmount } = useDepositActions()
  const [selectedPercent, setSelectedPercent] = useState<string>('')
  const selectedTokenConfig = useUSDCTokenConfig()
  const selectedTokenBalance = useSelectedTokenBalance()

  // Handle amount change
  const handleValueChange = (values: NumberFormatValues, { source }: NumberInputSourceInfo) => {
    if (source === NumberInputSourceType.EVENT) {
      setAmount(values.value)
      setSelectedPercent('')
    }
  }

  // Handle percent selection
  const handlePercentChange = (value: string) => {
    setSelectedPercent(value)
    const pct = Number(value)
    if (pct > 0) {
      const calculated = BNumber.from(selectedTokenBalance?.amount ?? 0)
        .multipliedBy(pct)
        .dividedBy(100)
        .toString()
      setAmount(calculated)
    }
  }
  // 是否余额不足
  const isInsufficientBalance = BNumber.from(amount).gt(selectedTokenBalance?.amount)
  // 是否满足最低充值
  const isValid = BNumber.from(amount).gte(selectedTokenBalance?.minAmount) && BNumber.from(amount).lte(selectedTokenBalance?.amount)

  const handleConfirm = () => {
    if (amount && isValid) {
      // 保存充值金额
      setDepositAmount(amount)
      onNext()
    }
  }

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

        <ModalDescription>
          <Trans>
            余额：
            {BNumber.toFormatNumber(selectedTokenBalance?.amount, {
              unit: selectedTokenConfig?.symbol,
              volScale: selectedTokenConfig?.displayDecimals
            })}
          </Trans>
        </ModalDescription>
      </ModalHeader>

      <div className="flex flex-col gap-2xl flex-1">
        {/* USDC Icon and Amount Input */}
        <div className="flex flex-col gap-none items-center">
          <div className="flex items-center gap-xs h-8">
            {selectedTokenConfig?.iconUrl ? <Image src={selectedTokenConfig?.iconUrl} width={24} height={24} /> : null}
            <div className="text-paragraph-p2 text-content-1">{selectedTokenConfig?.symbol}</div>
          </div>

          <div className="border-b border-brand-default py-4 w-full">
            <NumberInputPrimitive
              value={amount}
              onValueChange={handleValueChange}
              placeholder={renderFallbackPlaceholder({ volScale: selectedTokenConfig?.displayDecimals })}
              decimalScale={selectedTokenConfig?.displayDecimals}
              className="text-title-h2 text-content-1 text-center p-0"
            />
          </div>
        </div>

        {/* Percent Tabs */}
        <Tabs value={selectedPercent} onValueChange={handlePercentChange} variant="solid" size="sm">
          <TabsList className="w-full gap-medium">
            {PERCENT_OPTIONS.map((opt) => (
              <TabsTrigger key={opt.value} value={opt.value} className="flex-1">
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <ModalFooter className="p-0">
        <Button block color="primary" size="lg" disabled={!isValid} onClick={handleConfirm}>
          {isInsufficientBalance ? <Trans>余额不足</Trans> : <Trans>继续</Trans>}
        </Button>
      </ModalFooter>
    </>
  )
}
