import { Trans } from '@/libs/lingui/react/macro'
import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle, ModalCloseButton } from '@/libs/ui/components/modal'
import { Iconify, IconSuccess } from '@/libs/ui/components/icons'
import { BNumber } from '@/libs/utils/number'
import { formatAddress } from '@/libs/utils/format'

interface Step3SuccessProps {
  onBack: () => void
  onClose: () => void
  onConfirm: () => void
  toAddress: string
  amount: string
  tokenSymbol?: string
  tokenDecimals?: number
}

export const UsdcStep3Success = ({
  onBack,
  onClose,
  onConfirm,
  toAddress,
  amount,
  tokenSymbol = 'USDC',
  tokenDecimals = 2
}: Step3SuccessProps) => {
  const formattedAmount = BNumber.toFormatNumber(amount, {
    volScale: tokenDecimals,
    unit: tokenSymbol
  })

  const formattedAddress = formatAddress(toAddress)

  return (
    <>
      <ModalHeader className="w-full gap-2xl">
        <ModalTitle className="flex items-center justify-between w-full" showCloseButton={false}>
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-6" />
          </IconButton>
          <Trans>状态</Trans>
          <ModalCloseButton iconClassName="size-6" onClick={onClose} />
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col gap-2xl flex-1">
        {/* Success Status */}
        <div className="flex flex-col items-center justify-center py-xl gap-large">
          <IconSuccess width={50} height={50} />
          <div className="text-paragraph-p2 text-white">
            <Trans>取现提交成功，等待链上交易确认</Trans>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="flex flex-col gap-none">
          <div className="flex items-center justify-between text-paragraph-p2">
            <span className="text-content-4">
              <Trans>向{formattedAddress} 转入</Trans>
            </span>
            <span className="text-content-1">{formattedAmount}</span>
          </div>
        </div>

        {/* Notice */}
        <div className="text-paragraph-p3 text-content-5">
          <Trans>等待链上交易确认后Mullet以站内消息通知您，请您注意关注站内消息</Trans>
        </div>

        {/* Footer Button */}
        <Button block color="primary" size="lg" onClick={onConfirm}>
          <Trans>我知道了</Trans>
        </Button>
      </div>
    </>
  )
}
