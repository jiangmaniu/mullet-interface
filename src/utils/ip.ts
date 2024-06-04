import axios from 'axios'

import { STORAGE_GET_LOCATION, STORAGE_SET_LOCATION } from './storage'

export type LocationData = {
  area_code: string
  city: string
  city_code: string
  continent: string
  country: string
  country_code: string
  district: string
  elevation: string
  ip: string
  isp: string
  latitude: string
  longitude: string
  province: string
  street: string
  time_zone: string
  weather_station: string
  zip_code: string
}

// 获取地区信息
export const getIpInfo = () => {
  const localLocationInfo = STORAGE_GET_LOCATION()

  return new Promise<LocationData>(async (resolve) => {
    if (localLocationInfo) {
      return resolve(localLocationInfo)
    }

    return axios
      .get('https://api.ipdatacloud.com/v2/query?key=dbd5ba57bf4011ee830d00163e25360e', { timeout: 5000 })
      .then((res) => {
        const location = res?.data?.data?.location
        //  const countryCode = location?.country_code // 国家区号 参考 https://www.chinassl.net/ssltools/country-code.html

        STORAGE_SET_LOCATION(location)
        resolve(location)
      })
      .catch(() => {
        resolve({} as LocationData)
      })
  })
}
