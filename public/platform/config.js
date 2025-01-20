// 全局公共配置文件
const config = {
  // 网站名称
  name: 'Stellux',
  // 平台唯一标识，不要修改
  platform: 'sux',
   // 官网地址
  offical: 'www.stellux.io',
  // PWA manifest配置文件
  manifest: '/platform/manifest.json',
   // logo地址
  logo: '/platform/img/pc-logo.svg',
  // logo水印图片
  logoDark: '/platform/img/pc-logo-dark.png',
  // favicon地址
  favicon: '/platform/favicon.ico',
   // K线水印LOGO
  klineWatermarkLogo: '/platform/img/kline-water-logo.png',
  // K线水印LOGO-黑色主题模式
  klineWatermarkLogoDark: '/platform/img/kline-water-logo.png',
  // 合约属性水印LOGO
  featureWatermarkLogo: '/platform/img/kline-water-logo.png',
  // 合约属性水印LOGO-黑色主题模式
  featureWatermarkLogoDark: '/platform/img/feature-water-logo-dark.png',
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
    smallLogo: '/platform/img/logo-small.png',
    textLogo: '/platform/img/logo-text.png',
    grayLogo: '/platform/img/logo-gray.png',
    logo: '/platform/img/webapp-logo.png'
  },
  // k线图表地址
  tradingViewUrl: 'https://tradingview.stellux.io',

  // ========= stellux 正式环境 ================
  baseURL: 'https://client.stellux.io',   // API地址
  ws: 'wss://websocket.stellux.io/websocketServer',   // websocket地址
  imgDomain: 'https://file.stellux.io/trade/',  // 图片地址

  // ========= stellux 测试环境 ================
  // baseURL: 'https://client-dev.stellux.io',
  // ws: 'wss://websocket-dev.stellux.io/websocketServer',
  // imgDomain: 'https://file-dev.stellux.io/trade/' // 图片域名前缀

  // ========= lynfoo 正式环境 ================
  // baseURL: 'https://client.lynfoocn.com',
  // ws: 'wss://websocket.lynfoocn.com:443/websocketServer',
  // imgDomain: 'https://file.lynfoocn.com/trade/'
}

export default config
