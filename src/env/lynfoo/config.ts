export default {
  name: 'Lynfoo', // 系统名称
  offical: 'www.lynfoo.io',
  manifest: '/platform/lynfoo/manifest.json', // PWA manifest
  logo: '/platform/lynfoo/img/pc-logo.svg',
  logoDark: '/platform/lynfoo/img/pc-logo-dark.svg',
  favicon: '/platform/lynfoo/favicon.ico',
  klineWatermarkLogo: '/platform/lynfoo/img/kline-water-logo.svg', // K线水印
  klineWatermarkLogoDark: '/platform/lynfoo/img/kline-water-logo-dark.svg', // K线水印
  featureWatermarkLogo: '/platform/lynfoo/img/feature-water-logo.svg', // 合约属性水印LOGO
  featureWatermarkLogoDark: '/platform/lynfoo/img/feature-water-logo-dark.png', // 合约属性水印LOGO
  ServiceTerm: '/platform/lynfoo/serviceTerm.rtf', // 服务条款
  PrivacyAgreement: '/platform/lynfoo/privacyAgreement.rtf', // 隐私协议
  // 秘钥
  CLIENT_ID: 'StelluxTrader-client', // 客户端id
  CLIENT_SECRET: 'stellux_trader_client_secret', // 客户端密钥
  // 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
  REGISTER_APP_CODE: '123456', // @TODO 正式部署在修改
  // webapp端配置
  webapp: {
    smallLogo: '/platform/lynfoo/img/logo-small.png',
    textLogo: '/platform/lynfoo/img/logo-text.png',
    grayLogo: '/platform/lynfoo/img/logo-gray.png',
    logo: '/platform/lynfoo/img/webapp-logo.png'
  }
}
