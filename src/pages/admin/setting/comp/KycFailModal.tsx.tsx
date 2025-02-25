import { FormattedMessage, useModel } from '@umijs/max'
import { useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { goKefu, push } from '@/utils/navigator'

type IProps = {
  trigger: JSX.Element
}

export default function KycFailModal({ trigger }: IProps) {
  const modalRef = useRef<any>()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const remark = kycAuthInfo?.remark as string

  return (
    <Modal trigger={trigger} width={442} footer={null} ref={modalRef}>
      <div className="mb-8 flex items-center justify-center flex-col">
        <img src="/img/kyc-fail-icon.png" width={136} height={136} />
        <div className="pt-3 text-primary text-base break-all">{remark || <FormattedMessage id="mt.shenfenrenzhengweitongguotips" />}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center flex-1" onClick={goKefu}>
          <img src="/img/kefu.png" width={28} height={28} />
          <span className="text-base text-primary">
            <FormattedMessage id="mt.lianxikefu" />
          </span>
        </div>
        <Button
          className="!h-[44px] !w-[225px]"
          type="primary"
          block
          onClick={() => {
            modalRef?.current?.close()
            push('/setting/kyc')
          }}
        >
          <FormattedMessage id="mt.chongxinrenzheng" />
        </Button>
      </div>
    </Modal>
  )
}
