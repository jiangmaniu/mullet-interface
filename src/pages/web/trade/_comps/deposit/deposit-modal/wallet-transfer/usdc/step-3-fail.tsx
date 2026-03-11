import { Trans } from '@/libs/lingui/react/macro'
import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle, ModalCloseButton } from '@/libs/ui/components/modal'
import { Iconify, IconFail } from '@/libs/ui/components/icons'

interface Step3FailProps {
  onBack: () => void
  onClose: () => void
  onRetry: () => void
}

export const UsdcStep3Fail = ({ onBack, onClose, onRetry }: Step3FailProps) => {
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
        {/* Fail Status */}
        <div className="flex flex-col items-center justify-center py-xl gap-large">
          <IconFail width={50} height={50} />
          <div className="text-paragraph-p2 text-white">
            <Trans>钱包连接失败</Trans>
          </div>
          <div className="text-paragraph-p3 text-status-warning">
            <Trans>手动取消/其它未知错误导致钱包签名失败</Trans>
          </div>
        </div>

        {/* Footer Button */}
        <Button block color="primary" size="lg" onClick={onRetry}>
          <Trans>重新连接</Trans>
        </Button>
      </div>
    </>
  )
}
