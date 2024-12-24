export default {
  name: 'Lynfoo', // 系统名称
  offical: 'www.lynfoo.io',
  logo: '/img/platform/lynfoo/pc-logo.svg',
  logoDark: '/img/platform/lynfoo/pc-logo-dark.svg',
  favicon: '/img/platform/lynfoo/favicon.ico',
  klineWatermarkLogo: '/img/platform/lynfoo/kline-water-logo.svg', // K线水印
  klineWatermarkLogoDark: '/img/platform/lynfoo/kline-water-logo-dark.svg', // K线水印
  featureWatermarkLogo: '/img/platform/lynfoo/feature-water-logo.svg', // 合约属性水印LOGO
  featureWatermarkLogoDark: '/img/platform/lynfoo/feature-water-logo-dark.png', // 合约属性水印LOGO
  // 秘钥
  CLIENT_ID: 'StelluxTrader-client', // 客户端id
  CLIENT_SECRET: 'stellux_trader_client_secret', // 客户端密钥
  // 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
  REGISTER_APP_CODE: '123456', // @TODO 正式部署在修改
  // webapp端配置
  webapp: {
    smallLogo: '/img/platform/lynfoo/logo-small.png',
    textLogo: '/img/platform/lynfoo/logo-text.png',
    grayLogo: '/img/platform/lynfoo/logo-gray.png',
    logo: '/img/platform/lynfoo/webapp-logo.png'
  }
}
