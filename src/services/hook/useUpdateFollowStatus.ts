import { STORAGE_GET_USER_INFO, STORAGE_SET_USER_INFO } from '@/utils/storage'

import { tradeFollowAccountFollowStatus } from '../api/tradeFollow/lead'

export const useUpdateFollowStatus = () => {
  const localUserInfo = STORAGE_GET_USER_INFO() || {}

  // 遍历 localUserInfo.accountList, 替换
  localUserInfo.accountList.forEach(async (item: User.AccountItem) => {
    await tradeFollowAccountFollowStatus({
      tradeAccountId: item.id
    }).then((res) => {
      if (res.success && res.data) {
        item.followStatus = 1
      }
    })
  })

  // 更新本地的用户信息
  STORAGE_SET_USER_INFO(localUserInfo)

  // return accountList
}
