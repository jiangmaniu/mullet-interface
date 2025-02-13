import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import { useTheme } from '@/context/themeProvider'
import KycStepThreeForm from '../kycStepForm1.5/KycStepThreeForm'

type IProps = {
  trigger?: JSX.Element
}

function AdvanceKycApproveInfoModal({ trigger }: IProps, ref: any) {
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
      title={<FormattedMessage id="mt.kycgaojirenzheng" />}
      trigger={trigger}
      width={596}
      footer={null}
      ref={modalRef}
    >
      <KycStepThreeForm onSuccess={onSuccess} />
    </Modal>
  )
}

export default forwardRef(AdvanceKycApproveInfoModal)
