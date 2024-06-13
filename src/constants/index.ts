const NAMESPACE = 'mt_uc'

// 秘钥
export const clientId = 'StelluxTrader' // 客户端id
export const clientSecret = 'stellux_trader_secret' // 客户端密钥

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

// 默认语言 en-US
export const DEFAULT_LOCALE = 'en-US'

// 本地测试环境、线上测试环境
const isDev = process.env.NODE_ENV === 'development' || process.env.APP_ENV === 'dev'

export let URLS = {
  offical: 'www.stellux.com',
  tradingViewUrl: isDev ? 'http://localhost:3000' : 'https://tradingview.stellux.io',
  ws: isDev ? 'ws://192.168.5.60:19109/websocketServer' : 'ws://172.31.26.227:19109/websocketServer',
  imgDomain: isDev ? 'http://192.168.5.60:19000/trade/' : '' // 图片域名前缀 @TODO 替换正式环境图片域名
}
