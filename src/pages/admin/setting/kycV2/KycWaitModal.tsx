import { FormattedMessage, useModel } from '@umijs/max'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'
import { getKycStatus } from '@/pages/webapp/hooks/useKycStatusInfo'

type IProps = {
  trigger?: JSX.Element
  onClose?: () => void
}

function KycWaitModal({ trigger, onClose }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const isBaseAuth = currentUser?.isBaseAuth || false
  const isKycAuth = currentUser?.isKycAuth || false
  const phone = currentUser?.userInfo?.phone || ''

  const status = useMemo(() => {
    return getKycStatus(kycStatus, isBaseAuth, isKycAuth, phone)
  }, [kycStatus, isBaseAuth, isKycAuth, phone])

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
        <div className="h-[100px] w-[260px] relative">
          <FormattedMessage id="mt.shenhezhong" />
          <img src="/img/kyc-i1.png" className="absolute top-0 right-0" width={102} height={102} />
        </div>
      )}
      trigger={trigger}
      title={<FormattedMessage id="mt.shenhezhong" />}
      width={480}
      footer={null}
      ref={modalRef}
    >
      <div className="flex flex-col items-center gap-2 mb-5">
        <span className=" text-xl font-bold">
          <FormattedMessage id="mt.shenfenrenzhengshenhezhong" />
        </span>
        <span className=" text-sm text-gray-500 text-center">
          <FormattedMessage id="mt.womenhuijinkuaiwanchengshenhe" />
        </span>
      </div>
      <Button
        className="!h-[44px]"
        block
        onClick={() => {
          modalRef?.current?.close()
        }}
      >
        <FormattedMessage id="common.confirm" />
      </Button>
    </Modal>
  )
}

export default forwardRef(KycWaitModal)
