import { onBack } from '@/utils/navigator'
import { useModel } from '@umijs/max'
import VerifyMsg from './VerifyMsg'

export default function KycVerifyMsgPage() {
  const user = useModel('user')

  return (
    <VerifyMsg
      onSuccess={async () => {
        // 刷新用户信息
        await user.fetchUserInfo()
        onBack()
      }}
    />
  )
}
