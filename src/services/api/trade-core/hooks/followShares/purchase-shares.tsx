import { useMutation } from '@tanstack/react-query'

import { getTradeCoreApiInstance } from '../../instance'
import { FollowShares } from '../../instance/gen'

export type DepositsApiMutationParams = FollowShares.PostFollowSharesPurchaseShares.RequestBody

export const useDepositsApiMutation = () => {
  const depositsApiMutation = useMutation({
    mutationFn: async (data: DepositsApiMutationParams) => {
      const tradeCoreApi = getTradeCoreApiInstance()
      const rs = await tradeCoreApi.followShares.postFollowSharesPurchaseShares(data)

      if (rs.data.success && rs.data.data) {
        return rs.data.data
      }
      return null
    },
    onSuccess: () => {
      // const queryClient = getQueryClient()
      // queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      // queryClient.invalidateQueries({ queryKey: getProductCartCountApiQueryKey })
    }
  })

  return depositsApiMutation
}
