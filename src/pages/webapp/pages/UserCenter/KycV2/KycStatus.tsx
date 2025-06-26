import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import useKycAuth from '@/hooks/useKycAuth'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useRef } from 'react'
import { View } from '../../../components/Base/View'
import BindEmailModal from '../Kyc/modal/BindEmailModal'
import BindPhoneModal from '../Kyc/modal/BindPhoneModal'

const KycStatus = () => {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  const bindPhoneRef = useRef<any>(null)
  const bindEmailRef = useRef<any>(null)

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycInfo = useKycAuth()
  const status = kycInfo?.status
  const phone = kycInfo?.phone
  const email = kycInfo?.email

  const onClick = () => {
    if (!phone) {
      // navigateTo('/app/person-info?back=true&bindPhone=true')
      // 绑定手机号弹窗
      bindPhoneRef.current?.show()
      return
    }
    if (!email) {
      // 绑定邮箱弹窗
      bindEmailRef.current.show()
      return
    }
    if (status === 1) {
      // 初级审核通过，待申请高级认证
      navigateTo('/app/user-center/verify-document')
      return
    }
    if (status === 2) {
      // 初级审核通过，高级认证待审批
      navigateTo('/app/user-center/verify-status')
      return
    }
    if (status === 3) {
      // 初级审核已通过，高级认证不通过
      navigateTo('/app/user-center/verify-status')
      return
    }
    if (status === 4) {
      // 审核通过
      navigateTo('/app/user-center/verify-success')
      return
    }
    // 初始
    navigateTo('/app/user-center/verify-msg')
  }

  return (
    <View className={cn('mb-5 bg-white rounded-xl py-4 border border-gray-130 ')} onClick={onClick}>
      <div className="flex items-center gap-1.5 px-2.5">
        <img src={`/img/kyc-status-${status}.png`} width={70} height={70} className="w-[70px] h-[70px]" />
        <div className="flex flex-col items-start justify-start gap-1.5">
          <span className={cn('text-base font-medium', kycInfo?.color)}>{kycInfo?.label}</span>
          <span className=" text-xs text-gray-600 ">{kycInfo?.desc}</span>
        </div>
      </div>
      <div
        className="flex cursor-pointer items-center justify-between gap-2 pt-4 border-t border-gray-130 px-5"
        onClick={() => {
          //   onClick(status)
        }}
      >
        <span className=" text-sm font-medium ">{kycInfo?.operation}</span>
        <Iconfont name="huazhuanjilu-zhixiang" size={20} />
      </div>

      {/* 绑定手机号弹窗 */}
      <BindPhoneModal ref={bindPhoneRef} />
      {/* 绑定邮箱弹窗 */}
      <BindEmailModal ref={bindEmailRef} />
    </View>
  )
}

export default observer(KycStatus)
