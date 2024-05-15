// @ts-nocheck

export const getGeoInfo = async () => {
  return new Promise<{ data?: any; country?: string }>((resolve, reject) => {
    if (typeof window.geoip2 !== 'undefined') {
      geoip2.city(
        (geoipResponse) => {
          console.log('geoipResponse', geoipResponse)

          resolve({
            data: geoipResponse,
            country: geoipResponse?.country?.iso_code?.toLowerCase()
          })
        },
        (error) => {
          console.log('获取geo失败')
          resolve({})
        }
      )
    } else {
      resolve({})
    }
  })
}
