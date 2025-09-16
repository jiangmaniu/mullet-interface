import { Button } from '@/components/ui/button'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { cn } from '@/utils/cn'

export const CreateVaultModal = (props: React.ComponentProps<typeof Modal>) => {
  return (
    <Modal {...props}>
      <ModalContent aria-describedby={undefined} className="gap-5">
        <ModalHeader>
          <ModalTitle className="">创建金库</ModalTitle>
        </ModalHeader>

        <div className="">
          <div className="text-[12px] text-[#9FA0B0]">你选择分发的金额将按每个存款用户比例发放到对应交易账户中。</div>

          <div className="mt-5">
            <div className={cn(['flex gap-1.5 w-full items-center p-2.5 h-[34px] rounded-[8px] border border-[#3B3D52] box-border'])}>
              <input
                className={cn(['flex-1 text-white text-[14px] bg-transparent outline-none placeholder:text-[#767783]'])}
                placeholder="请创建您的金库名称"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className={cn(['flex gap-1.5 w-full items-center p-2.5 rounded-[8px] border border-[#3B3D52] box-border'])}>
              <textarea
                className={cn([
                  'h-[80px] resize-none flex-1 text-white text-[14px] bg-transparent outline-none placeholder:text-[#767783]'
                ])}
                placeholder="请输入您的金库描述"
              />
            </div>

            <div className="mt-2.5 text-[12px] text-[#9FA0B0]">描述为250个字符以内</div>
          </div>

          <div className="mt-5">
            <div className={cn(['flex gap-1.5 w-full items-center p-2.5 h-[34px] rounded-[8px] border border-[#3B3D52] box-border'])}>
              <input
                className={cn(['flex-1 text-white text-[14px] bg-transparent outline-none placeholder:text-[#767783]'])}
                placeholder="存款金额"
              />
            </div>
          </div>

          <div className="mt-2.5 text-[12px] flex justify-between">
            <div className="text-[#9FA0B0]">交易账户可用余额</div>
            <div className="text-white">56321.52 USDC</div>
          </div>

          <div className="mt-5 text-[12px] text-[#9FA0B0]">
            <div>首次创建金库您存入至少100USDC。</div>
            <div>作为创建者，您必须在金库中保持超过5%的流动性。</div>
            <div>金库创建费用为100USDC，金库关闭时不会退还。</div>
            <div>创建者通过管理金库将会获得10%的利润分享。</div>
          </div>

          <Button block className="mt-5">
            确定
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}
