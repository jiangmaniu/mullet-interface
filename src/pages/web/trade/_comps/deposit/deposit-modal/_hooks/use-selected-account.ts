import { useMemo } from 'react'
import { useModel } from '@umijs/max'
import { useDepositStore } from '../_store'

/**
 * 获取当前选中的充值账户
 */
export function useSelectedDepositAccount() {
  const { initialState } = useModel('@@initialState')
  const selectedAccountId = useDepositStore((s) => s.selectedAccountId)

  return useMemo(() => {
    if (!selectedAccountId) return null
    const currentUser = initialState?.currentUser
    const accountList = currentUser?.accountList || []
    return accountList.find((account) => account.id === selectedAccountId) ?? null
  }, [selectedAccountId, initialState?.currentUser])
}
