import Button from '@/pages/webapp/components/Base/Button'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'

type IProps = {
  title?: string
}

const Children = observer(({ title }: IProps) => {
  const i18n = useI18n()
  const { t } = i18n

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const isBaseAuth = currentUser?.isBaseAuth || false
  const isKycAuth = currentUser?.isKycAuth || false

  const onClick = () => {
    if (!isBaseAuth) {
      navigateTo('/app/user-center/verify-msg')
    } else if (!isKycAuth) {
      navigateTo('/app/user-center/verify-document')
    }
  }
  return (
    <div className="px-[14px] pt-6 flex flex-col justify-center gap-9">
      <img src={'/img/webapp/kyc-shenhezhong.png'} alt="kyc_status2" style={{ width: '145px', height: '145px', alignSelf: 'center' }} />
      <Text size="base" weight="medium" className="text-center">
        {t('mt.wanshanzhanghuziliao', { value: isKycAuth && !isBaseAuth ? t('mt.shoucirujin') : t('mt.shoucichujin') })}
      </Text>
      <Button type="primary" size="large" className="w-full mb-2.5" onClick={onClick}>
        {t('mt.wanshangerenziliao')}
      </Button>
    </div>
  )
})

/** 选择账户弹窗 */

const KycTipsModal = ({ title }: IProps, ref: ForwardedRef<ModalRef>) => {
  const i18n = useI18n()
  const { t } = i18n

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      title={t('mt.wanshangerenziliao')}
      height={400}
      autoHeight
      // snapPoints={['80%', '100%']} // 增加這個功能後 dismiss 會出現按鈕點擊異常問題
      // onConfirm={onConfirm}
      hiddenFooter
      children={<Children />}
    />
  )
}

export default forwardRef(KycTipsModal)
