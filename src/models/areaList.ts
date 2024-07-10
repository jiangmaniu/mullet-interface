import { useRequest } from 'ahooks'
import { useEffect } from 'react'

import { useLang } from '@/context/languageProvider'
import { getAreaCode } from '@/services/api/common'

/**获取国家地区、手机区号 */
export default function AreaList() {
  const { lng } = useLang()
  const { data, loading, run } = useRequest(getAreaCode, { manual: true })
  const list = data?.data || []

  useEffect(() => {
    run()
  }, [])

  // 根据国家简称获取国家名称
  const getCountryName = (abbr: any) => {
    if (!abbr) return ''

    const info = list.find((item) => item.abbr === abbr)

    const countryName = lng === 'zh-TW' ? info?.nameTw : info?.nameEn

    return countryName
  }

  return {
    list,
    loading,
    getCountryName,
    run
  }
}
