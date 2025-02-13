import { FormattedMessage, useModel } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { getEnum } from '@/constants/enum'

type IProps = {
  trigger?: JSX.Element
}

function AdvanceKycApproveInfoModal({ trigger }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { getCountryName } = useModel('areaList')
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const userInfo = currentUser?.userInfo
  const countryName = getCountryName(currentUser?.country)
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const identificationType = kycAuthInfo?.identificationType as string

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  return (
    <Modal trigger={trigger} title={<FormattedMessage id="mt.shenfenxinxi" />} width={430} footer={null} ref={modalRef}>
      <div className="flex items-center">
        <img src="/img/default-avatar.png" width={40} height={40} />
        <div className="pl-3">
          {kycAuthInfo?.firstName && (
            <div className="text-base text-primary font-semibold">
              {kycAuthInfo?.firstName}·{kycAuthInfo?.lastName}
            </div>
          )}
          <div className="text-xs text-primary pt-2">
            <FormattedMessage id="common.guojia" />：{countryName || '-'}
          </div>
        </div>
      </div>
      <div className="py-7 flex items-center">
        <div className="flex flex-col">
          <div className="text-secondary text-sm">
            <FormattedMessage id="mt.zhengjianleixing" />
          </div>
          <div className="text-primary text-sm font-semibold pt-2">
            {getEnum().Enum.IdentificationType[identificationType]?.text || '-'}
          </div>
        </div>
        <div className="flex flex-col pl-[50px]">
          <div className="text-secondary text-sm">
            <FormattedMessage id="mt.zhengjianhaoma" />
          </div>
          <div className="text-primary text-sm font-semibold pt-2">{kycAuthInfo?.identificationCode || '-'}</div>
        </div>
      </div>
      <Button
        className="!h-[44px]"
        type="primary"
        block
        onClick={() => {
          modalRef?.current?.close()
        }}
      >
        <FormattedMessage id="common.queren" />
      </Button>
    </Modal>
  )
}

export default forwardRef(AdvanceKycApproveInfoModal)
