import { useModel } from '@umijs/max'

import { stores } from '@/context/mobxProvider'

export default function User() {
  const { initialState, setInitialState } = useModel('@@initialState')

  // 重新获取用户信息赋值
  const fetchUserInfo = async () => {
    const userInfo = await stores.global.fetchUserInfo()
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
