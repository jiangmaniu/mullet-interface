import { FormattedMessage } from '@umijs/max'
import { useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'

type IProps = {
  trigger: JSX.Element
}

export default function KycApproveInfoModal({ trigger }: IProps) {
  const modalRef = useRef<any>()
  return (
    <Modal trigger={trigger} title={<FormattedMessage id="mt.shenfenxinxi" />} width={430} footer={null} ref={modalRef}>
      <div className="flex items-center">
        <img src="/img/default-avatar.png" width={40} height={40} />
        <div className="pl-3">
          <div className="text-base text-gray font-semibold">姓名</div>
          <div className="text-xs text-gray pt-2">国家：日本</div>
        </div>
      </div>
      <div className="py-7 flex items-center">
        <div className="flex flex-col">
          <div className="text-gray-secondary text-sm">
            <FormattedMessage id="mt.zhengjianleixing" />
          </div>
          <div className="text-gray text-sm font-semibold pt-2">身份证</div>
        </div>
        <div className="flex flex-col pl-[50px]">
          <div className="text-gray-secondary text-sm">
            <FormattedMessage id="mt.zhengjianhaoma" />
          </div>
          <div className="text-gray text-sm font-semibold pt-2">27109412407130103714</div>
        </div>
      </div>
      <Button
        className="!h-[44px]"
        type="primary"
        block
        onClick={() => {
          modalRef?.current?.close()
        }}
      >
        <FormattedMessage id="common.queren" />
      </Button>
    </Modal>
  )
}
