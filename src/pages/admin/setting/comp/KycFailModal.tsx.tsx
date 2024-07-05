import { FormattedMessage } from '@umijs/max'
import { useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'

type IProps = {
  trigger: JSX.Element
}

export default function KycFailModal({ trigger }: IProps) {
  const modalRef = useRef<any>()
  return (
    <Modal trigger={trigger} width={442} footer={null} ref={modalRef}>
      <div className="mb-8 flex items-center justify-center flex-col">
        <img src="/img/kyc-fail-icon.png" width={136} height={136} />
        <div className="pt-3 text-gray text-base">
          <FormattedMessage id="mt.shenfenrenzhengweitongguotips" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center flex-1">
          <img src="/img/kefu.png" width={28} height={28} />
          <span className="text-base text-gray">
            <FormattedMessage id="mt.lianxikefu" />
          </span>
        </div>
        <Button
          className="!h-[44px] !w-[225px]"
          type="primary"
          block
          onClick={() => {
            modalRef?.current?.close()
            // @TODO 跳转认证
          }}
        >
          <FormattedMessage id="mt.chongxinrenzheng" />
        </Button>
      </div>
    </Modal>
  )
}
