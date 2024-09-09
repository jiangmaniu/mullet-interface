import { useModel } from '@umijs/max'
import { useCallback } from 'react'

import { tradeFollowAccountFollowStatus } from '@/services/api/tradeFollow/lead'

export const useUpdateFollowStatus = () => {
  // let updatedAccountList: User.AccountItem[] = accountList
  // 使用 Promise.all 处理异步操作

  const { initialState, setInitialState } = useModel('@@initialState')

  const updateFollowStatus = useCallback(() => {
    const currentUser = initialState?.currentUser
    const accountList = currentUser?.accountList

    if (!accountList) return

    Promise.all(
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
      .then((updatedAccountList) => {
        setInitialState({
          ...initialState,
          currentUser: {
            ...currentUser,
            accountList: updatedAccountList
          }
        })
      })
      .catch((error) => {
        console.error('更新跟单状态失败', error)
      })
  }, [initialState, setInitialState])

  return updateFollowStatus
}
