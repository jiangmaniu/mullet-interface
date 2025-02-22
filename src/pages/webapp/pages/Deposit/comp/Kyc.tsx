import Iconfont from '@/components/Base/Iconfont'
import { getIntl, useIntl, useModel } from '@umijs/max'

export default function Kyc({ onClick }: { onClick: () => void }) {
  const intl = useIntl()

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const kycAuthInfo = currentUser?.kycAuth?.[0]
  const kycStatus = kycAuthInfo?.status as API.ApproveStatus // kyc状态
  const isBaseAuth = currentUser?.isBaseAuth

  return (
    <>
      {/* {!isBaseAuth && ( */}
      <div className=" border border-gray-150 rounded-lg px-5 py-2.5 flex justify-between bg-white mb-5" onClick={onClick}>
        <div className="flex flex-row items-center gap-[12px]">
          <Iconfont name="renzheng" width={32} height={32} />
          <div className=" text-md font-semibold text-gray-900">
            {intl.formatMessage({ id: 'mt.wanshanzhanghuziliao' }, { value: getIntl().formatMessage({ id: 'mt.shoucichujin' }) })}
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  )
}
