import { useMainAccount } from '@/hooks/user/use-main-account'
import { PoolManageWrapper, useGetPoolDetailApiOptions } from '@/services/api/trade-core/hooks/follow-manage/pool-detail'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@umijs/max'

export type VaultDetail = PoolManageWrapper & { isOwner: boolean }

export function useVaultDetail() {
  const { vaultId } = useParams<{ vaultId: string }>()
  const mainAccount = useMainAccount()

  const { getPoolDetailApiOptions } = useGetPoolDetailApiOptions({
    id: Number(vaultId)
  })
  const { data: vaultDetail, ...rest } = useQuery({
    ...getPoolDetailApiOptions,
    select: (data) => {
      if (data) {
        return {
          ...data,
          isOwner: mainAccount?.id === data?.mainAccountId
        }
      }

      return data
    }
  })

  return { vaultDetail, ...rest }
}
