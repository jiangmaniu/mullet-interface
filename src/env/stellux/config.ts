export default {
  name: 'Stellux', // 系统名称
  offical: 'www.stellux.io',
  logo: '/img/platform/stellux/pc-logo.svg',
  logoDark: '/img/platform/stellux/pc-logo-dark.svg',
  favicon: '/img/platform/stellux/favicon.ico',
  klineWatermarkLogo: '/img/platform/stellux/kline-water-logo.png', // K线水印LOGO
  klineWatermarkLogoDark: '/img/platform/stellux/kline-water-logo.png', // K线水印LOGO
  featureWatermarkLogo: '/img/platform/stellux/kline-water-logo.png', // 合约属性水印LOGO
  featureWatermarkLogoDark: '/img/platform/stellux/feature-water-logo-dark.png', // 合约属性水印LOGO
  // 秘钥
  CLIENT_ID: 'StelluxTrader-client', // 客户端id
  CLIENT_SECRET: 'stellux_trader_client_secret', // 客户端密钥
  // 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
  REGISTER_APP_CODE: '123456', // @TODO 正式部署在修改
  // webapp端配置
  webapp: {
    smallLogo: '/img/platform/stellux/logo-small.png',
    textLogo: '/img/platform/stellux/logo-text.png',
    grayLogo: '/img/platform/stellux/logo-gray.png',
    logo: '/img/platform/stellux/webapp-logo.png'
  }
}
