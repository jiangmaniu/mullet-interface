import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'

type IProps = {
  trigger?: JSX.Element
  handleReset: () => void
}

function ConfirmModal(props: IProps, ref: any) {
  const modalRef = useRef<any>()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  return (
    <Modal
      width={430}
      title={<FormattedMessage id="mt.dingdanyichaoshi" />}
      footer={null}
      ref={modalRef}
      closable={false}
      maskClosable={false}
    >
      <Button
        type="primary"
        className="w-full"
        onClick={() => {
          props.handleReset()
        }}
      >
        <FormattedMessage id="common.queren" />
      </Button>
    </Modal>
  )
}

export default forwardRef(ConfirmModal)
