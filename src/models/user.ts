import { useModel } from '@umijs/max'
import { flushSync } from 'react-dom'

import { stores } from '@/context/mobxProvider'
import { isEmail } from '@/utils'

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

  // 该账号是否是邮箱注册方式，注册的时候已经确定，不能再次修改
  const isEmailRegisterWay = isEmail(initialState?.currentUser?.userInfo?.account as string)

  return {
    fetchUserInfo,
    isEmailRegisterWay
  }
}
