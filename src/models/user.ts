import { useModel } from '@umijs/max'
import { flushSync } from 'react-dom'

import { stores } from '@/context/mobxProvider'

export default function User() {
  const { initialState, setInitialState } = useModel('@@initialState')

  // 重新获取用户信息赋值
  const fetchUserInfo = async (refreshAccount?: boolean) => {
    const userInfo = await stores.global.fetchUserInfo(refreshAccount)
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo
        }))
      })
    }
  }

  return {
    fetchUserInfo
  }
}
