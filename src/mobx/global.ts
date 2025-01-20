import { stores } from '@/context/mobxProvider'
import { getRegisterWay } from '@/services/api/common'
import { getClientDetail } from '@/services/api/crm/customer'
import { getMyMessageList, getUnReadMessageCount } from '@/services/api/message'
import { onLogout } from '@/utils/navigator'
import { STORAGE_GET_TOKEN, STORAGE_GET_USER_INFO, STORAGE_SET_PLATFORM_CONFIG, STORAGE_SET_USER_INFO } from '@/utils/storage'
import { action, makeAutoObservable, observable, reaction, runInAction } from 'mobx'
import PLATFORM_DEFAULT_CONFIG from '../../public/platform/config.json'

export type TabbarActiveKey = '/app/quote' | '/app/trade' | '/app/position' | '/app/user-center'

export type DeviceType = 'PC' | 'MOBILE'

export type IPlatformConfig = typeof PLATFORM_DEFAULT_CONFIG

export class GlobalStore {
  constructor() {
    makeAutoObservable(this)

    reaction(
      () => this.verifyCodeDown,
      (down) => {
        if (down >= 0) {
          const time = setTimeout(() => {
            this.countDownVerifyCode(down)
          }, 1000)
          return () => {
            clearTimeout(time)
          }
        }
      }
    )
  }
  @observable registerWay: API.RegisterWay = 'EMAIL' // 注册方式: EMAIL | PHONE
  @observable messageList = [] as Message.MessageItem[] // 消息列表
  @observable messageCurrent = 1 // 消息列表页码
  @observable messageTotalCount = 1 // 总页码
  @observable unReadCount = 0 // 未读消息数量
  @observable tabBarActiveKey: TabbarActiveKey = '/app/quote'
  @observable lastDeviceType: DeviceType = 'PC' // 设置最后一次切换pc、mobile端设备类型
  @observable lastPcJumpPathname = '' // 记录最后一次PC端跳转的路径-方便响应式变化恢复到之前的地址
  @observable lastMobileJumpPathname = '' // 记录最后一次Mobile端跳转的路径-方便响应式变化恢复到之前的地址
  @observable pageIsFocused = true // 页面是否处于激活状态，进入页面默认是true，离开页面变为false
  @observable sheetModalOpen = true // 记录SheetModal是否打开
  @observable verifyCodeDown = -1 // 验证码倒计时
  @observable platformConfig = {} as IPlatformConfig // 平台配置

  // 获取平台配置
  getPlatformConfig = async () => {
    const config = await fetch(location.origin + '/platform/config.json')
      .then((res) => res.json())
      .then((data) => data)

    // 缓存配置到本地
    STORAGE_SET_PLATFORM_CONFIG(config)

    this.setPlatformConfig(config)

    return config
  }

  // 设置平台配置
  setPlatformConfig = (conf: any) => {
    runInAction(() => {
      this.platformConfig = conf
    })
  }

  @action countDownVerifyCode = async (down: number) => {
    this.verifyCodeDown = down - 1
  }

  // 设置页面是否处于激活状态
  @action
  setPageIsFocused = (isFocused: boolean) => {
    this.pageIsFocused = isFocused
  }

  @action
  setSheetModalOpen = (open: boolean) => {
    this.sheetModalOpen = open
  }

  // 设置H5底部tabbar激活项
  @action
  setTabBarActiveKey = (tabBarActiveKey: TabbarActiveKey) => {
    this.tabBarActiveKey = tabBarActiveKey
  }

  // 设置最后一次PC端跳转的路径
  @action
  setLastPcJumpPathname = (pathname: string) => {
    this.lastPcJumpPathname = pathname
  }

  // 设置最后一次Mobile端跳转的路径
  @action
  setLastMobileJumpPathname = (pathname: string) => {
    this.lastMobileJumpPathname = pathname
  }

  // 设置最后一次切换pc、mobile端设备类型
  @action
  setLastDeviceType = (lastDeviceType: DeviceType) => {
    this.lastDeviceType = lastDeviceType
  }

  fetchUserInfo = async (refreshAccount?: boolean) => {
    if (!STORAGE_GET_TOKEN()) {
      return undefined
    }

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

  // 获取消息列表
  @action
  getMessageList = async (isRefresh = false) => {
    const hasMore = !isRefresh && this.messageCurrent <= this.messageTotalCount
    if (hasMore) {
      this.messageCurrent += 1
    } else {
      this.messageCurrent = 1
    }

    const res = await getMyMessageList({ size: 10, current: this.messageCurrent })
    const list = (res.data?.records || []) as Message.MessageItem[]

    runInAction(() => {
      this.messageTotalCount = Number(res?.data?.pages)
      if (hasMore) {
        this.messageList = this.messageList.concat(list)
      } else {
        this.messageList = list
      }
    })
  }

  // 获取未读消息数量
  getUnreadMessageCount = async () => {
    const res = await getUnReadMessageCount()
    const count = res.data || 0

    runInAction(() => {
      this.unReadCount = count
    })
  }

  // ========== 全局页面初始化执行 ================

  init = () => {
    this.getRegisterWay()

    if (STORAGE_GET_TOKEN()) {
      this.getUnreadMessageCount()
      this.getMessageList()
    }
  }
}

const global = new GlobalStore()

export default global
