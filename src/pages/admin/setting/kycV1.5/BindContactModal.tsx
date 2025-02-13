import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import BindEmailPhoneForm from '../kycStepForm1.5/BindEmailPhoneForm'

type IProps = {
  trigger?: JSX.Element
}

function BindContactModal({ trigger }: IProps, ref: any) {
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
      title={
        stores.global.registerWay === 'EMAIL' ? <FormattedMessage id="mt.bangdingshouji" /> : <FormattedMessage id="mt.bangdingyouxiang" />
      }
      trigger={trigger}
      width={596}
      footer={null}
      ref={modalRef}
    >
      <BindEmailPhoneForm onSuccess={onSuccess} />
    </Modal>
  )
}

export default forwardRef(BindContactModal)
