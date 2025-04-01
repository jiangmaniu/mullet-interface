import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { replace } from '@/utils/navigator'
import { appendHideParamIfNeeded } from '@/utils/request'

type IProps = {
  trigger?: JSX.Element
}

function CompleteModal(props: IProps, ref: any) {
  const modalRef = useRef<any>()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  return (
    <Modal width={430} title={<FormattedMessage id="mt.yiwanchengzhifu" />} footer={null} ref={modalRef}>
      <Button
        type="primary"
        className="w-full"
        onClick={() => {
          replace(appendHideParamIfNeeded(`/app/record/payment?type=RUJIN`))
        }}
      >
        <FormattedMessage id="common.queren" />
      </Button>
    </Modal>
  )
}

export default forwardRef(CompleteModal)
