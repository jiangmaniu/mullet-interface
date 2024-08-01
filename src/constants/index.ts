export const isDev = process.env.APP_ENV === 'dev'
const ENV_PREFIX = isDev ? 'dev' : 'prod'

const NAMESPACE = `stellux_client_${ENV_PREFIX}` // 命名空间

// 秘钥
export const CLIENT_ID = 'StelluxTrader-client' // 客户端id
export const CLIENT_SECRET = 'stellux_trader_client_secret' // 客户端密钥
// 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
export const REGISTER_APP_CODE = '123456' // @TODO 正式部署在修改

// 字体图标 @TODO 替换设计提供的地址 https://blog.csdn.net/weixin_44119268/article/details/102629409
// 注意：UI图标更新后，需要重新更新地址和本地代码
export const ICONFONT_URL =
  process.env.NODE_ENV === 'development' ? '//at.alicdn.com/t/c/font_4571567_1karvotvhcb.js' : '/iconfont/iconfont.js'

// 首页
export const WEB_HOME_PAGE = '/trade'
export const ADMIN_HOME_PAGE = '/account'

// 本地存储-用户信息-键
export const KEY_TOKEN = NAMESPACE + '_' + 'token'
export const KEY_USER_INFO = NAMESPACE + '_' + 'userInfo'
export const KEY_PARAMS = NAMESPACE + '_' + 'params'
export const KEY_PWD = NAMESPACE + '_' + 'pwd'
export const KEY_NEXT_REFRESH_TOKEN_TIME = NAMESPACE + '_' + 'nextRefreshTokenTime'

// 临时缓存在sessionStorage中的语言
export const KEY_TEMP_LNG = NAMESPACE + '_' + 'temp_lang'

// 定位信息
export const KEY_LOCATION_INFO = NAMESPACE + '_' + 'location_info'

// 打开的品种名称
export const KEY_SYMBOL_NAME_LIST = NAMESPACE + '_' + 'open_symbol_name_list'
export const KEY_ACTIVE_SYMBOL_NAME = NAMESPACE + '_' + 'active_symbol_name'
// 收藏
export const KEY_FAVORITE = NAMESPACE + '_' + 'favorite_list'

// 按账户id储存用户的设置信息：自选、打开的品种列表、激活的品种名称
export const KEY_USER_CONF_INFO = NAMESPACE + '_' + 'user_conf_info'

// 默认语言 en-US
export const DEFAULT_LOCALE = 'en-US'

// 测试环境
const development = {
  tradingViewUrl: 'https://tradingview-dev.stellux.io',
  baseURL: 'https://manager-dev.stellux.io',
  ws: 'wss://websocket-dev.stellux.io/websocketServer',
  imgDomain: 'https://file-dev.stellux.io/trade/' // 图片域名前缀
}
// 正式环境
const production = {
  tradingViewUrl: 'https://tradingview.stellux.io',
  baseURL: 'https://manager.stellux.io',
  ws: 'wss://websocket.stellux.io/websocketServer',
  imgDomain: 'https://file.stellux.io/trade/'
}

const env = isDev ? development : production

export const URLS = {
  offical: 'www.stellux.com',
  ...env
}
