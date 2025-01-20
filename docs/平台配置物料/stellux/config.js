// 全局公共配置文件
export default {
  // 网站名称
  name: 'Stellux',
  platform: 'sux', // 平台唯一标识，不要修改
  // 官网地址
  offical: 'www.stellux.io',
  // PWA manifest配置文件
  manifest: '/trade/manifest.json',
  // logo地址
  logo: '/trade/img/pc-logo.svg',
  // logo水印图片
  logoDark: '/trade/img/pc-logo-dark.png',
  // favicon地址
  favicon: '/trade/favicon.ico',
  // K线水印LOGO
  klineWatermarkLogo: '/trade/img/kline-water-logo.png',
  // K线水印LOGO-黑色主题模式
  klineWatermarkLogoDark: '/trade/img/kline-water-logo.png',
  // 合约属性水印LOGO
  featureWatermarkLogo: '/trade/img/kline-water-logo.png',
  // 合约属性水印LOGO-黑色主题模式
  featureWatermarkLogoDark: '/trade/img/feature-water-logo-dark.png',
  // 服务条款地址
  ServiceTerm: '',
  // 隐私协议地址
  PrivacyAgreement: '',
  // 客户端id
  CLIENT_ID: 'StelluxTrader-client',
  // 客户端密钥
  CLIENT_SECRET: 'stellux_trader_client_secret',
  // 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用)
  REGISTER_APP_CODE: '123456',
  // webapp端配置
  webapp: {
    smallLogo: '/trade/img/logo-small.png',
    textLogo: '/trade/img/logo-text.png',
    grayLogo: '/trade/img/logo-gray.png',
    logo: '/trade/img/webapp-logo.png'
  },
  // k线图表地址
  tradingViewUrl: 'https://tradingview.stellux.io',
  // API地址
  baseURL: 'https://client.stellux.io',
  // websocket地址
  ws: 'wss://websocket.stellux.io/websocketServer',
  // 图片地址
  imgDomain: 'https://file.stellux.io/trade/'
}
