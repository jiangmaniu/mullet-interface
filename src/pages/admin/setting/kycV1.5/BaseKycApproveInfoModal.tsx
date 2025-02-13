import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import { useTheme } from '@/context/themeProvider'
import KycStepTwoForm from '../kycStepForm1.5/KycStepTwoForm'

type IProps = {
  trigger?: JSX.Element
}

function BaseKycApproveInfoModal({ trigger }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { theme } = useTheme()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const onSuccess = () => {
    modalRef.current?.close()
  }

  return (
    <Modal
      styles={{
        header: {
          backgroundColor: theme.colors.backgroundColor.secondary
        }
      }}
      contentStyle={{ padding: 20 }}
      title={<FormattedMessage id="mt.kycjichurenzheng" />}
      trigger={trigger}
      width={596}
      footer={null}
      ref={modalRef}
    >
      <KycStepTwoForm onSuccess={onSuccess} />
    </Modal>
  )
}

export default forwardRef(BaseKycApproveInfoModal)
