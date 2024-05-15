import { useRequest } from '@umijs/max'

import { getHomeInfo } from '@/services/api/agent/home'

export default function Home() {
  const { data: homeData, loading: homeInfoLoading, run: queryHomeInfo } = useRequest(getHomeInfo, { manual: true })

  const homeInfo = homeData?.result?.content?.Data

  return {
    homeInfo,
    homeInfoLoading,
    queryHomeInfo
  }
}
