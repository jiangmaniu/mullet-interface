import { tradeFollowAccountFollowStatus } from '@/services/api/tradeFollow/lead'
import { STORAGE_GET_USER_INFO, STORAGE_SET_USER_INFO } from '@/utils/storage'

export const useUpdateFollowStatus = async () => {
  const localUserInfo = STORAGE_GET_USER_INFO() || {}
  if (localUserInfo.accountList && Array.isArray(localUserInfo.accountList)) {
    // 使用 Promise.all 处理异步操作

    const updatedAccountList = await Promise.all(
      localUserInfo.accountList.map(async (item: User.AccountItem) => {
        const res = await tradeFollowAccountFollowStatus({
          tradeAccountId: item.id
        })
        if (res.success && res.data) {
          return { ...item, followStatus: 1 }
        }
        return item // 如果没有成功，返回原始 item
      })
    )
    // 更新本地的用户信息
    const updatedUserInfo = { ...localUserInfo, accountList: updatedAccountList }
    console.log('STORAGE_SET_USER_INFO', updatedUserInfo)
    STORAGE_SET_USER_INFO(updatedUserInfo)
  }
}
