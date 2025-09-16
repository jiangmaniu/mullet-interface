import { Button } from '@/components/ui/button'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'

export const DistributeModal = (props: React.ComponentProps<typeof Modal>) => {
  return (
    <Modal {...props}>
      <ModalContent aria-describedby={undefined} className="gap-5">
        <ModalHeader>
          <ModalTitle className="">分发</ModalTitle>
        </ModalHeader>

        <div className="">
          <div className="text-[12px] text-[#9FA0B0]">你选择分发的金额将按每个存款用户比例发放到对应交易账户中。</div>

          <div className="mt-5">input</div>

          <div className="mt-2.5 text-[12px] flex justify-between">
            <div className="text-[#9FA0B0]">金库可用余额</div>
            <div className="text-white">56321.52 USDC</div>
          </div>

          <Button block className="mt-[30px]">
            确定
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}
