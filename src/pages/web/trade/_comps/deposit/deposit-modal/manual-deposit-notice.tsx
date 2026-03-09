import { Trans } from '@/libs/lingui/react/macro'
import { Button } from '@/libs/ui/components/button'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/libs/ui/components/modal'
import { Iconify } from '@/libs/ui/components/icons'
import { Alert, AlertTitle } from '@/libs/ui/components/alert'

export type ManualDepositNoticeProps = {
  isOpen?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export const ManualDepositNotice = ({ isOpen, onClose, children }: ManualDepositNoticeProps) => {
  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      {children && <ModalTrigger asChild>{children}</ModalTrigger>}

      <ModalContent onInteractOutside={(event) => event.preventDefault()} className="flex w-full max-w-[360px] min-w-[360px] gap-2xl p-2xl">
        <ModalHeader className="w-full">
          <ModalTitle>
            <div className="flex items-center gap-medium">
              <Iconify icon="iconoir:info-circle" className="size-6 text-brand-primary" />
              <Trans>手动充值须知</Trans>
            </div>
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col gap-2xl">
          {/* Warning Alert */}
          <Alert variant="destructive">
            <Iconify icon="iconoir:chat-bubble-warning" className="size-4" />
            <AlertTitle>
              <Trans>跨链交易可能需要较长时间完成，请耐心等待</Trans>
            </AlertTitle>
          </Alert>

          {/* Notice Content */}
          <div className="flex flex-col gap-large">
            <div className="flex flex-col gap-medium">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>1. 确认网络和代币</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>请确保您选择的网络和代币与您的钱包中的资产匹配，否则可能导致资产丢失。</Trans>
              </div>
            </div>

            <div className="flex flex-col gap-medium">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>2. 最低充值金额</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>请确保您的充值金额不低于最低充值金额，否则可能无法到账。</Trans>
              </div>
            </div>

            <div className="flex flex-col gap-medium">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>3. 到账时间</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>跨链交易通常需要 5-30 分钟，具体时间取决于网络拥堵情况。</Trans>
              </div>
            </div>

            <div className="flex flex-col gap-medium">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>4. 交易确认</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>您可以在交易历史中查看充值进度，或通过区块链浏览器查询交易状态。</Trans>
              </div>
            </div>
          </div>

          {/* Help Link */}
          <div className="text-paragraph-p3 text-content-4">
            <Trans>遇到问题？</Trans>
            <a href="#" className="underline text-white ml-1">
              <Trans>联系客服</Trans>
            </a>
          </div>

          {/* Footer Button */}
          <Button block color="primary" size="lg" onClick={onClose}>
            <Trans>我知道了</Trans>
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}
