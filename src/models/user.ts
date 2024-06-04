import { useModel } from '@umijs/max'

export default function User() {
  const { initialState, setInitialState } = useModel('@@initialState')

  // 重新获取用户信息赋值
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      setInitialState((s) => ({
        ...s,
        ...userInfo
      }))
    }
  }

  return {
    fetchUserInfo
  }
}
