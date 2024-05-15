import { useRequest } from 'ahooks'

import { getPromotionNumber } from '@/services/api/agent/referralLink'

type PromotionData = {
  [key: string]: string
}

export type PromotionItem = {
  url: string
  promotionNum: string
  /**推广类型 */
  promotionNumType: string
  /**手续费 */
  fee: number
  index: number
}

// 修改inviteCode => inviterCode
const updateInviteCode = (url: string) => {
  // 匹配 inviteCode= 后面的参数值
  const regex = /inviteCode=([^&]+)/

  // 使用 replace 方法替换参数名
  const updatedUrl = url.replace(regex, 'inviterCode=$1')

  return updatedUrl
}

function matchPromotionUrls(data: PromotionData): PromotionItem[] {
  const result: PromotionItem[] = []
  const unquieArr = new Set<number>()

  Object.keys(data).forEach((key) => {
    const matchPromotionNum = key.match(/^promotionNum-(\d+)$/)
    const matchUrl = key.match(/^url-(\d+)$/) || []

    if (matchPromotionNum || matchUrl) {
      const index = Number(matchPromotionNum ? matchPromotionNum[1] : matchUrl[1])
      const promotionNum = data[`promotionNum-${index}`]
      const url = data[`url-${index}`]

      if (promotionNum !== undefined && url !== undefined) {
        const promotionNumType = promotionNum.replace(data.agentid, '')
        const fee = Number(promotionNumType.replace(/[^0-9]/g, ''))

        if (!unquieArr.has(index)) {
          result.push({ fee, promotionNum, url, index, promotionNumType })
          unquieArr.add(index)
        }
      }
    }
  })

  // 根据 isNoLoad 进行排序
  result.sort((a, b) => a.index - b.index)

  return result
}

export default function Page() {
  const { data, loading, run } = useRequest(getPromotionNumber, { manual: true })

  const dataInfo = data?.result?.content?.Data || {}

  const listData = matchPromotionUrls(dataInfo)

  return {
    data: listData,
    loading,
    run
  }
}
