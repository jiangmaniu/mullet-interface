import { Trans } from '@/libs/lingui/react/macro'
import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalCloseButton, ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { Alert, AlertTitle } from '@/libs/ui/components/alert'
import { Iconify } from '@/libs/ui/components/icons'

export const CryptoStep1 = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  return (
    <div className="flex flex-col h-full gap-2xl">
      <ModalHeader className="flex-row items-center justify-between">
        <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
          <Iconify icon="iconoir:nav-arrow-left" className="size-6" />
        </IconButton>
        <ModalTitle className="text-important-1" showCloseButton={false}>
          <Trans>手动充值须知</Trans>
        </ModalTitle>
        <ModalCloseButton iconClassName="size-6" />
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl">
        {/* 说明文字 */}
        <div className="text-paragraph-p2 text-content-1 leading-relaxed">
          <Trans>
            Mullet仅支持Solana链上USDC充值，如果非Solana链上USDC充值请通过Mullet合作伙伴跨链桥交换至Swap交易; 交易过程有滑点，请留意
          </Trans>
        </div>

        {/* 警告提示框 */}
        <Alert>
          <Iconify icon="iconoir:chat-bubble-warning" className="size-4" />
          <AlertTitle>
            <Trans>跨链桥交易至Swap交易产生的Gas费由Mullet承担</Trans>
          </AlertTitle>
        </Alert>

        {/* 已知晓按钮 */}
        <Button block color="primary" size="lg" onClick={onNext} className="mt-auto">
          <Trans>已知晓</Trans>
        </Button>
      </div>
    </div>
  )
}
