'use client'

import { Trans } from '@/libs/lingui/react/macro'
import { useEffect, useState } from 'react'
import { isUndefined } from 'lodash-es'

import { Alert, AlertDescription, AlertTitle } from '@/libs/ui/components/alert'
import { Button, IconButton } from '@/libs/ui/components/button'
import { Checkbox } from '@/libs/ui/components/checkbox'
import { IconClose, IconInfo, IconMinus, IconPlus } from '@/libs/ui/components/icons'
import { cn } from '@/libs/ui/lib/utils'
import { Modal, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '@/libs/ui/components/modal'
import { NumberInputPrimitive, NumberInputSourceType } from '@/libs/ui/components/number-input'
import { SliderTooltip } from '@/libs/ui/components/slider-tooltip'
import { BNumber } from '@/libs/utils/number'

enum MarginMode {
  CROSS_MARGIN = 'CROSS_MARGIN',
  ISOLATED_MARGIN = 'ISOLATED_MARGIN'
}

export type MarginModeModalProps = {
  isOpen?: boolean
  onClose?: () => void
  children?: React.ReactNode
  onSettingLeverage?: (mode: MarginMode) => void
  defaultMode?: MarginMode
}

export const MarginModeModal = ({
  onSettingLeverage: onSettingMarginMode,
  defaultMode,
  isOpen,
  onClose,
  children
}: MarginModeModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const [selectedMode, setSelectedMode] = useState<MarginMode>(MarginMode.CROSS_MARGIN)

  useEffect(() => {
    if (defaultMode) {
      setSelectedMode(defaultMode)
    }
  }, [defaultMode])

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await Promise.resolve(onSettingMarginMode?.(selectedMode))
      onClose?.()
    } finally {
      setIsLoading(false)
    }
  }

  const MODE_OPTIONS = [
    {
      label: <Trans>全仓</Trans>,
      description: (
        <Trans>
          账户内全部可用资金都会作为保证金共同承担风险。当某个仓位出现亏损时，可调用账户内的剩余资金来支撑，降低被强平的可能，但同时也可能牵连其他仓位。
        </Trans>
      ),
      value: MarginMode.CROSS_MARGIN
    },
    {
      label: <Trans>逐仓</Trans>,
      description: <Trans>每个仓位独立计算保证金和风险。若某个仓位亏损至保证金不足，将单独触发强平，不会影响账户内的其他仓位。</Trans>,
      value: MarginMode.ISOLATED_MARGIN
    }
  ]

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      {children && <ModalTrigger asChild>{children}</ModalTrigger>}

      <ModalContent onInteractOutside={(event) => event.preventDefault()} className="flex min-h-[260px] w-full max-w-[360px] min-w-[360px]">
        <ModalHeader className="w-full">
          <ModalTitle className="flex items-center justify-between gap-3">
            <div className={cn('')}>
              <Trans>保证金模式</Trans>
            </div>
          </ModalTitle>

          <div className="py-2xl gap-2xl flex flex-1 flex-col">
            {MODE_OPTIONS.map((option) => {
              const isSelected = selectedMode === option.value
              return (
                <Checkbox
                  key={option.value}
                  className={cn('rounded-2 py-3xl px-xl bg-card items-start border border-transparent', 'hover:bg-move-in', {
                    'border-white-base': isSelected
                  })}
                  checked={isSelected}
                  onCheckedChange={() => setSelectedMode(option.value)}
                  label={
                    <div className="gap-medium flex flex-col items-start">
                      <div>{option.label}</div>
                      <div className="text-paragraph-p3 text-content-4 text-left">{option.description}</div>
                    </div>
                  }
                ></Checkbox>
              )
            })}
          </div>

          <ModalFooter>
            <Button block color="primary" size="md" loading={isLoading} onClick={handleConfirm}>
              <Trans>确定</Trans>
            </Button>
          </ModalFooter>
        </ModalHeader>
      </ModalContent>
    </Modal>
  )
}
