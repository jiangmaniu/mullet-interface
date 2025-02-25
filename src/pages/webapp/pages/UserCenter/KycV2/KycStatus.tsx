import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import useKycStatusInfo from '@/pages/webapp/hooks/useKycStatusInfo'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { View } from '../../../components/Base/View'

export const getKycStatus = (kycStatus: API.ApproveStatus, isBaseAuth: boolean, isKycAuth: boolean) => {
  if (isBaseAuth && isKycAuth) {
    return 4 // 审核通过
  } else if (isBaseAuth && !isKycAuth && kycStatus !== 'TODO' && kycStatus !== 'CANCEL' && kycStatus !== 'DISALLOW') {
    return 1 // 初级审核通过，待申请高级认证
  } else if (isBaseAuth && kycStatus === 'TODO') {
    return 2 // 初级审核通过，高级认证待审批
  } else if (isBaseAuth && kycStatus === 'DISALLOW') {
    return 3 // 初级审核已通过，高级认证不通过
  } else {
    return 0 // 初始
  }
}

const KycStatus = () => {
  const { cn, theme } = useTheme()
  const { t } = useI18n()

  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const isBaseAuth = currentUser?.isBaseAuth || false
  const isKycAuth = currentUser?.isKycAuth || false

  // const status = useMemo(() => {
  //   return getKycStatus(kycStatus, isBaseAuth, isKycAuth)
  // }, [kycStatus, isBaseAuth, isKycAuth])

  // const statusLabels = [
  //   {
  //     label: <FormattedMessage id="mt.weiwanchengchujirenzheng" />,
  //     desc: <FormattedMessage id="mt.qingwanchengchujirenzheng" />,
  //     operation: <FormattedMessage id="mt.quchujirenzheng" />,
  //     color: 'text-red'
  //   },
  //   {
  //     label: <FormattedMessage id="mt.yiwanchengchujirenzheng" />,
  //     desc: <FormattedMessage id="mt.weifangbianchujin" />,
  //     operation: <FormattedMessage id="mt.qugaojirenzheng" />,
  //     color: 'text-green'
  //   },
  //   {
  //     label: <FormattedMessage id="mt.shenhezhong" />,
  //     desc: <FormattedMessage id="mt.qingnaixindenghoushenhe" />,
  //     operation: <FormattedMessage id="mt.chakanjindu" />,
  //     color: 'text-yellow-500'
  //   },
  //   {
  //     label: <FormattedMessage id="mt.gaojirenzhengbeijujue" />,
  //     desc: <FormattedMessage id="mt.qingzixianzhaoshuomingchongshi" />,
  //     operation: <FormattedMessage id="mt.zaishiyici" />,
  //     color: 'text-red'
  //   },
  //   {
  //     label: <FormattedMessage id="mt.yiwanchenggaojirenzheng" />,
  //     desc: <FormattedMessage id="mt.ninyiwanchengsuoyourenzheng" />,
  //     operation: <FormattedMessage id="mt.chakanxinxi" />,
  //     color: 'text-green'
  //   }
  // ]

  const kycInfo = useKycStatusInfo()
  const status = kycInfo?.status

  const onClick = () => {
    if (status === 1) {
      // 初级审核通过，待申请高级认证
      navigateTo('/app/user-center/verify-document')
    } else if (status === 2) {
      // 初级审核通过，高级认证待审批
      navigateTo('/app/user-center/verify-status')
    } else if (status === 3) {
      // 初级审核已通过，高级认证不通过
      navigateTo('/app/user-center/verify-status')
    } else if (status === 4) {
      navigateTo('/app/user-center/verify-information')
      // 审核通过
    } else {
      // 初始
      navigateTo('/app/user-center/verify-msg')
    }
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
    </View>
  )
}

export default observer(KycStatus)
