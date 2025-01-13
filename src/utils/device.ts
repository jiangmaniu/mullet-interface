export const isInStandaloneMode = () =>
  // standalone：独立应用模式，这种模式下打开的应用有自己的启动图标，并且不会有浏览器的地址栏。因此看起来更像一个Native App
  window.matchMedia('(display-mode: standalone)').matches ||
  // @ts-ignore Safari 判断
  window.navigator?.standalone ||
  document?.referrer?.includes?.('android-app://')
