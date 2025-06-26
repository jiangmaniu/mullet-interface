import { FormattedMessage, useModel } from '@umijs/max'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'
import { getKycStatus } from '@/hooks/useKycAuth'

type IProps = {
  trigger?: JSX.Element
  onSuccess?: () => void
}

function KycRejectModal({ trigger, onSuccess }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const isBaseAuth = currentUser?.isBaseAuth || false
  const isKycAuth = currentUser?.isKycAuth || false
  const remark = kycAuthInfo?.remark

  const status = useMemo(() => {
    return getKycStatus(kycStatus, isBaseAuth, isKycAuth)
  }, [kycStatus, isBaseAuth, isKycAuth])

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const { theme } = useTheme()

  return (
    <Modal
      styles={{
        header: {
          backgroundColor: theme.colors.backgroundColor.secondary
        }
      }}
      contentStyle={{ padding: 20 }}
      renderTitle={() => (
        <div className="h-[100px] w-60 relative">
          <FormattedMessage id="mt.shenheshibai" />
          <img src="/img/webapp/kyc-shenheshibai.png" className="absolute top-0 right-0" width={102} height={102} />
        </div>
      )}
      trigger={trigger}
      title={<FormattedMessage id="mt.shenheshibai" />}
      width={430}
      footer={null}
      ref={modalRef}
    >
      <div className="flex flex-col items-center gap-2 mb-5">
        <span className="text-xl font-bold">
          <FormattedMessage id="mt.shenfenrenzhengshibai" />
        </span>
        <span className=" text-sm text-gray-500 break-all">
          {status === 3 && remark ? remark : <FormattedMessage id="mt.nintijiaodeziliaobuquanqieyoucuowu" />}
        </span>
      </div>
      <Button
        className="!h-[44px] !bg-red"
        type="primary"
        block
        onClick={() => {
          modalRef?.current?.close()
          onSuccess?.()
        }}
      >
        <FormattedMessage id="mt.chongxinrenzheng" />
      </Button>
    </Modal>
  )
}

export default forwardRef(KycRejectModal)
