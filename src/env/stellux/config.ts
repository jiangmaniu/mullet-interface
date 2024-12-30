export default {
  name: 'Stellux', // 系统名称
  offical: 'www.stellux.io',
  manifest: '/platform/stellux/manifest.json', // PWA manifest
  logo: '/platform/stellux/img/pc-logo.svg',
  logoDark: '/platform/stellux/img/pc-logo-dark.svg',
  favicon: '/platform/stellux/favicon.ico',
  klineWatermarkLogo: '/platform/stellux/img/kline-water-logo.png', // K线水印LOGO
  klineWatermarkLogoDark: '/platform/stellux/img/kline-water-logo.png', // K线水印LOGO
  featureWatermarkLogo: '/platform/stellux/img/kline-water-logo.png', // 合约属性水印LOGO
  featureWatermarkLogoDark: '/platform/stellux/img/feature-water-logo-dark.png', // 合约属性水印LOGO
  ServiceTerm: '', // 服务条款
  PrivacyAgreement: '', // 隐私协议
  // 秘钥
  CLIENT_ID: 'StelluxTrader-client', // 客户端id
  CLIENT_SECRET: 'stellux_trader_client_secret', // 客户端密钥
  // 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
  REGISTER_APP_CODE: '123456', // @TODO 正式部署在修改
  // webapp端配置
  webapp: {
    smallLogo: '/platform/stellux/img/logo-small.png',
    textLogo: '/platform/stellux/img/logo-text.png',
    grayLogo: '/platform/stellux/img/logo-gray.png',
    logo: '/platform/stellux/img/webapp-logo.png'
  }
}
