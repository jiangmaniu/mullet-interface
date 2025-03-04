import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { getEnum } from '@/constants/enum'
import { useTheme } from '@/context/themeProvider'
import { observer } from 'mobx-react'

type IProps = {
  trigger?: JSX.Element
}

function KycApproveInfoModal({ trigger }: IProps, ref: any) {
  const modalRef = useRef<any>()
  const intl = useIntl()
  const { getCountryName } = useModel('areaList')
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const userInfo = currentUser?.userInfo
  const countryName = getCountryName(currentUser?.country)
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const identificationType = kycAuthInfo?.identificationType as string
  const isKycAuth = currentUser?.isKycAuth || false
  const { theme } = useTheme()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  return (
    <Modal
      styles={{
        header: {
          backgroundColor: theme.colors.backgroundColor.secondary
        }
      }}
      contentStyle={{ padding: 18 }}
      renderTitle={() => (
        <div className="h-[100px] w-60 relative">
          <div className="flex flex-row">
            <FormattedMessage id="mt.shenfenxinxi" />{' '}
            <div className="bg-[rgba(69, 164, 138, 0.1)] flex items-center justify-center py-1 px-1 rounded text-green text-xs font-medium pl-2">
              <FormattedMessage id="mt.gaojirenzheng" />
            </div>
          </div>
          <img src="/img/kyc-i1.png" className="absolute top-0 right-0" width={102} height={102} />
        </div>
      )}
      trigger={trigger}
      width={430}
      footer={null}
      ref={modalRef}
    >
      <div className="flex items-center">
        {/* <img src="/img/default-avatar.png" width={40} height={40} /> */}
        <div className="">
          {kycAuthInfo?.firstName && (
            <div className="text-base text-primary font-semibold">
              {intl.locale === 'zh-TW'
                ? `${currentUser?.lastName || 'lastName'}${currentUser?.firstName || 'firstName'}`
                : `${currentUser?.firstName || 'firstName'} ${currentUser?.lastName || 'lastName'}`}
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
        type="default"
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

export default observer(forwardRef(KycApproveInfoModal))
