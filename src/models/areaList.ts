import { useRequest } from '@umijs/max'

import { getAreaDataList } from '@/services/api/user'

export default function AreaList() {
  // 使用ahooks
  const { data, loading } = useRequest(async () => {
    const res = await getAreaDataList()
    if (res.success) {
      const data = res.result as User.AreaCodeItem[]
      return data
    }
    return []
  })

  return {
    data,
    loading
  }
}
