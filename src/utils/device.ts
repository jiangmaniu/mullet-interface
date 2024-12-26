export type BrowserDeviceType =
  | 'Chrome'
  | 'Safari'
  | 'Mozilla Firefox'
  | 'Microsoft Internet Explorer'
  | 'Microsoft Edge'
  | 'Opera'
  | 'Unknown Browser'

//获取浏览器分类
export const getBrowser = (): BrowserDeviceType => {
  let userAgent = navigator.userAgent
  if (userAgent.indexOf('Chrome') !== -1 || userAgent.indexOf('CriOS') !== -1) {
    return 'Chrome'
  } else if (userAgent.indexOf('Safari') !== -1) {
    return 'Safari'
  } else if (userAgent.indexOf('Firefox') !== -1) {
    return 'Mozilla Firefox'
  } else if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1) {
    return 'Microsoft Internet Explorer'
  } else if (userAgent.indexOf('Edge') !== -1) {
    return 'Microsoft Edge'
  } else if (userAgent.indexOf('OPR') !== -1) {
    return 'Opera'
  } else {
    return 'Unknown Browser'
  }
}
//获取设备类型
export const getDeviceType = () => {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
  return isAndroid ? 'Android' : isiOS ? 'IOS' : ''
}
