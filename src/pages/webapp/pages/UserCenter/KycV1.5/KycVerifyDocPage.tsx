import { onBack } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import VerifyDoc from './VerifyDoc'

export default function KycVerifyDocPage() {
  const user = useModel('user')

  return (
    <VerifyDoc
      onSuccess={async () => {
        // 刷新用户信息
        await user.fetchUserInfo()
        onBack()
      }}
    />
  )
}
