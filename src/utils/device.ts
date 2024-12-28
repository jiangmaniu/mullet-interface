export type BrowserDeviceType =
  | 'Chrome'
  | 'Safari'
  | 'Mozilla Firefox'
  | 'Microsoft Internet Explorer'
  | 'Microsoft Edge'
  | 'Opera'
  | 'Unknown Browser'

export const isInStandaloneMode = () =>
  // fullscreen：全屏显示，会尽可能将所有的显示区域都占满
  window.matchMedia('(display-mode: fullscreen)').matches ||
  // standalone：独立应用模式，这种模式下打开的应用有自己的启动图标，并且不会有浏览器的地址栏。因此看起来更像一个Native App
  window.matchMedia('(display-mode: standalone)').matches ||
  // 与standalone相比，该模式会多出地址栏
  window.matchMedia('(display-mode: minimal-ui)').matches ||
  // @ts-ignore Safari 判断
  window.navigator?.standalone ||
  document?.referrer?.includes?.('android-app://')

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
