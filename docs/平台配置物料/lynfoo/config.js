// 全局公共配置文件
export default {
  name: 'Lynfoo', // 系统名称
  platform: 'lyn', // 平台唯一标识，不要修改
  offical: 'www.lynfoo.io',
  manifest: '/platform/manifest.json', // PWA manifest
  logo: '/platform/img/pc-logo.svg',
  logoDark: '/platform/img/pc-logo-dark.svg',
  favicon: '/platform/favicon.ico',
  klineWatermarkLogo: '/platform/img/kline-water-logo.svg', // K线水印
  klineWatermarkLogoDark: '/platform/img/kline-water-logo-dark.svg', // K线水印
  featureWatermarkLogo: '/platform/img/feature-water-logo.svg', // 合约属性水印LOGO
  featureWatermarkLogoDark: '/platform/img/feature-water-logo-dark.png', // 合约属性水印LOGO
  ServiceTerm: '/platform/docs/serviceTerm.rtf', // 服务条款
  PrivacyAgreement: '/platform/docs/privacyAgreement.rtf', // 隐私协议
  // 秘钥
  CLIENT_ID: 'WpTrader-client', // 客户端id
  CLIENT_SECRET: 'wp_trader_client_secret', // 客户端密钥
  // 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
  REGISTER_APP_CODE: '123456', // @TODO 正式部署在修改
  // webapp端配置
  webapp: {
    smallLogo: '/platform/img/logo-small.png',
    textLogo: '/platform/img/logo-text.png',
    grayLogo: '/platform/img/logo-gray.png',
    logo: '/platform/img/webapp-logo.png'
  },

  tradingViewUrl: 'https://tradingview.lynfoocn.com',
  baseURL: 'https://client.lynfoocn.com', // 接口地址
  ws: 'wss://websocket.lynfoocn.com:443/websocketServer', // websocket地址
  imgDomain: 'https://file.lynfoocn.com/trade/' // 图片地址
}
