import { action, makeAutoObservable, observable, runInAction } from 'mobx'

import { stores } from '@/context/mobxProvider'
import { getRegisterWay } from '@/services/api/common'
import { getClientDetail } from '@/services/api/crm/customer'
import { useUpdateFollowStatus } from '@/services/hook/useUpdateFollowStatus'
import { onLogout } from '@/utils/navigator'
import { STORAGE_GET_USER_INFO, STORAGE_SET_USER_INFO } from '@/utils/storage'

export class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }
  @observable registerWay: API.RegisterWay = 'EMAIL' // 注册方式: EMAIL | PHONE

  fetchUserInfo = async (refreshAccount?: boolean) => {
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

      // 更新跟单状态
      if (location.pathname.indexOf('/copy-trading') !== -1) {
        clientInfo.accountList && useUpdateFollowStatus()
      }

      // 刷新账户信息
      if (refreshAccount !== false) {
        // 初始化交易配置，在登录后才执行
        await stores.trade.init()

        // 初始化设置默认当前账号信息
        const localAccountId = stores.trade.currentAccountInfo?.id
        const hasAccount = (currentUser?.accountList || []).some((item) => item.id === localAccountId)
        // 本地不存在账号或本地存在账号但不在登录返回的accountList中，需重新设置默认值，避免切换不同账号登录使用上一次缓存
        if (!localAccountId || (localAccountId && !hasAccount)) {
          stores.trade.setCurrentAccountInfo(clientInfo.accountList?.[0] as User.AccountItem)
        } else if (localAccountId) {
          // 更新本地本地存在的账号信息，确保证数据是最新的
          stores.trade.setCurrentAccountInfo(clientInfo.accountList?.find((item) => item.id === localAccountId) as User.AccountItem)
        } else {
          stores.trade.getSymbolList()
        }
      }

      return currentUser
    } catch (error) {
      onLogout()
    }
    return undefined
  }

  // 获取该应用支持的注册方式，目前只支持一种，不支持同时切换手机、邮箱注册
  getRegisterWay = async () => {
    const res = await getRegisterWay()
    runInAction(() => {
      if (res.data) {
        this.registerWay = res.data as API.RegisterWay
      }
    })
  }

  // ========== 全局页面初始化执行 ================
  @action
  init = () => {
    this.getRegisterWay()
  }
}

const global = new GlobalStore()

export default global
