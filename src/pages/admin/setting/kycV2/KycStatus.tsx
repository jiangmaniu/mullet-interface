import Iconfont from '@/components/Base/Iconfont'
import { getKycStatus } from '@/pages/webapp/hooks/useKycStatusInfo'
import { cn } from '@/utils/cn'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { observer } from 'mobx-react'
import { useMemo } from 'react'

const KycStatus = ({ onClick }: { onClick: (status: number) => void }) => {
  const intl = useIntl()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus
  const isBaseAuth = currentUser?.isBaseAuth || false
  const isKycAuth = currentUser?.isKycAuth || false

  const status = useMemo(() => {
    return getKycStatus(kycStatus, isBaseAuth, isKycAuth)
  }, [kycStatus, isBaseAuth, isKycAuth])

  const statusLabels = [
    {
      label: <FormattedMessage id="mt.weiwanchengchujirenzheng" />,
      desc: <FormattedMessage id="mt.qingwanchengchujirenzheng" />,
      operation: <FormattedMessage id="mt.quchujirenzheng" />,
      color: 'text-red'
    },
    {
      label: <FormattedMessage id="mt.yiwanchengchujirenzheng" />,
      desc: <FormattedMessage id="mt.weifangbianchujin" />,
      operation: <FormattedMessage id="mt.qugaojirenzheng" />,
      color: 'text-green'
    },
    {
      label: <FormattedMessage id="mt.shenhezhong" />,
      desc: <FormattedMessage id="mt.qingnaixindenghoushenhe" />,
      operation: <FormattedMessage id="mt.chakanjindu" />,
      color: 'text-yellow-500'
    },
    {
      label: <FormattedMessage id="mt.gaojirenzhengbeijujue" />,
      desc: <FormattedMessage id="mt.qingzixianzhaoshuomingchongshi" />,
      operation: <FormattedMessage id="mt.zaishiyici" />,
      color: 'text-red'
    },
    {
      label: <FormattedMessage id="mt.yiwanchenggaojirenzheng" />,
      desc: <FormattedMessage id="mt.ninyiwanchengsuoyourenzheng" />,
      operation: <FormattedMessage id="mt.chakanxinxi" />,
      color: 'text-green'
    }
  ]

  return (
    <div className="border border-gray-150 rounded-[7px] py-[22px] px-[26px] flex items-center justify-between">
      <div className="flex items-center gap-5">
        <img src={`/img/kyc-status-${status}.png`} width={70} height={70} className="w-[70px] h-[70px]" />
        <div className="flex flex-col items-start justify-start gap-1.5">
          <span className=" text-sm ">
            <FormattedMessage id="mt.yanzhengzhuangtai" />
          </span>
          <span className={cn('text-sm font-semibold', statusLabels[status].color)}>{statusLabels[status].label}</span>
          <span className=" text-xs text-gray-600 ">{statusLabels[status].desc}</span>
        </div>
      </div>
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => {
          onClick(status)
        }}
      >
        <span className=" text-base font-medium ">{statusLabels[status].operation}</span>
        <Iconfont name="jinru" size={20} />
      </div>
    </div>
  )
}

export default observer(KycStatus)
