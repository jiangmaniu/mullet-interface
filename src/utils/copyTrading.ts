import { tradeFollowAccountFollowStatus } from '@/services/api/tradeFollow/lead'

export const useUpdateFollowStatus = async (accountList: User.AccountItem[]) => {
  let updatedAccountList: User.AccountItem[] = accountList
  // 使用 Promise.all 处理异步操作

  updatedAccountList = await Promise.all(
    accountList.map(async (item: User.AccountItem) => {
      const res = await tradeFollowAccountFollowStatus({
        tradeAccountId: item.id
      })
      if (res.success && res.data) {
        return { ...item, followStatus: 1 }
      }
      return item // 如果没有成功，返回原始 item
    })
  )
  return updatedAccountList
}
