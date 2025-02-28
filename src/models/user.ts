import { useModel } from '@umijs/max'
import { flushSync } from 'react-dom'

import { stores } from '@/context/mobxProvider'
import { isEmail } from '@/utils'
import { replace } from '@/utils/navigator'
import { STORAGE_SET_SHOW_PWA_ADD_MODAL, setLocalUserInfo } from '@/utils/storage'

export default function User() {
  const { initialState, setInitialState } = useModel('@@initialState')

  const lastUpdateTime = stores.global.lastUpdateTime
  const setLastUpdateTime = stores.global.setLastUpdateTime

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
    return userInfo
  }

  // 该账号是否是邮箱注册方式，注册的时候已经确定，不能再次修改
  const isEmailRegisterWay = isEmail(initialState?.currentUser?.userInfo?.account as string)

  const handleLoginSuccess = async (result: User.UserInfo) => {
    // 缓存用户信息
    setLocalUserInfo(result)

    // 标识弹窗
    STORAGE_SET_SHOW_PWA_ADD_MODAL(true)

    // 重新获取用户信息
    fetchUserInfo(true).then((res) => {
      const accountList = res?.accountList?.filter((item) => !item.isSimulate)
      if (accountList && accountList.length >= 1) {
        // 关闭其他页面，跳转主页面
        // replace('Main')
        // replace('/app/account/select?back=false')
        replace('/app/quote?back=false')
      } else {
        replace('/app/account/create?back=false')
      }
    })
  }

  return {
    fetchUserInfo,
    handleLoginSuccess,
    isEmailRegisterWay,
    lastUpdateTime,
    setLastUpdateTime
  }
}
