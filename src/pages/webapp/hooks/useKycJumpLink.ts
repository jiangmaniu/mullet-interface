import useKycAuth from '../../../hooks/useKycAuth'

// 获取kyc跳转地址
export default function useKycJumpLink() {
  const kycInfo = useKycAuth()
  const status = kycInfo?.status

  const jumpLink =
    {
      // 初级审核通过，待申请高级认证
      1: '/app/user-center/verify-document',
      // 初级审核通过，高级认证待审批
      2: '/app/user-center/verify-status',
      // 初级审核已通过，高级认证不通过
      3: '/app/user-center/verify-status',
      4: '/app/user-center/verify-success'
    }[status] || '/app/user-center/verify-msg'

  return { jumpLink }
}
