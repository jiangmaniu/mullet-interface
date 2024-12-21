export default {
  name: 'Lynfoo', // 系统名称
  offical: 'www.lynfoo.io',
  logo: '', // @TODO 待提供和替换
  klineWatermarkLogo: '/img/platform/lynfoo/kline-water-logo.png', // K线水印 @TODO 待提供和替换
  // 秘钥
  CLIENT_ID: 'StelluxTrader-client', // 客户端id
  CLIENT_SECRET: 'stellux_trader_client_secret', // 客户端密钥
  // 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
  REGISTER_APP_CODE: '123456', // @TODO 正式部署在修改
  // webapp端配置
  webapp: {
    smallLogo: '/img/platform/lynfoo/logo-small.png',
    textLogo: '/img/platform/lynfoo/logo-text.png',
    grayLogo: '/img/platform/lynfoo/logo-gray.png'
  }
}
