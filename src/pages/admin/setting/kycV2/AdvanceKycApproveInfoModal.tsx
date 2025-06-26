import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import { useTheme } from '@/context/themeProvider'
import KycStepThreeForm from '../kycStepForm/KycStepThreeForm'

type IProps = {
  trigger?: JSX.Element
  onSuccess?: () => void
}

function AdvanceKycApproveInfoModal({ trigger, onSuccess }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { theme } = useTheme()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const handleSubmit = () => {
    modalRef.current?.close()
    onSuccess?.()
  }

  return (
    <Modal
      styles={{
        header: {
          backgroundColor: theme.colors.backgroundColor.secondary,
          marginBottom: 0
        }
      }}
      contentStyle={{ padding: 0 }}
      renderTitle={() => (
        <>
          <div className="h-[100px] w-[280px] relative">
            <FormattedMessage id="mt.kycgaojirenzheng" />
            <img src="/img/kyc-i1.png" className="absolute top-0 right-0" width={102} height={102} />
          </div>
        </>
      )}
      trigger={trigger}
      width={528}
      footer={null}
      ref={modalRef}
    >
      <KycStepThreeForm onSuccess={handleSubmit} onClose={() => modalRef.current?.close()} />
    </Modal>
  )
}

export default forwardRef(AdvanceKycApproveInfoModal)
