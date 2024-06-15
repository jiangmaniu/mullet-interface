import { action, makeAutoObservable } from 'mobx'

import { stores } from '@/context/mobxProvider'
import { getClientDetail } from '@/services/api/crm/customer'
import { onLogout } from '@/utils/navigator'
import { STORAGE_GET_USER_INFO, STORAGE_SET_USER_INFO } from '@/utils/storage'

export class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  fetchUserInfo = async () => {
    try {
      // 查询客户信息
      const clientInfo = await getClientDetail({
        id: STORAGE_GET_USER_INFO('user_id')
      })

      const localUserInfo = STORAGE_GET_USER_INFO() || {}

      const currentUser = {
        ...localUserInfo,
        ...clientInfo // 用户详细信息
      } as User.UserInfo
      // 更新本地的用户信息
      STORAGE_SET_USER_INFO(currentUser)

      // 初始化交易配置，在登录后才执行
      await stores.trade.init()

      // 初始化设置默认当前账号信息
      const localAccountId = stores.trade.currentAccountInfo?.id
      const hasAccount = (currentUser?.accountList || []).some((item) => item.id === localAccountId)
      // 本地不存在账号或本地存在账号但不在登录返回的accountList中，需重新设置默认值，避免切换不同账号登录使用上一次缓存
      if (!localAccountId || (localAccountId && !hasAccount)) {
        stores.trade.setCurrentAccountInfo(clientInfo.accountList?.[0])
      } else {
        stores.trade.getSymbolList()
      }

      return currentUser
    } catch (error) {
      onLogout()
    }
    return undefined
  }

  // ========== 全局页面初始化执行 ================
  @action
  init = () => {
    // trade.init()
  }
}

const global = new GlobalStore()

export default global
