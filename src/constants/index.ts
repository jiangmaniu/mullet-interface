const NAMESPACE = 'stellux_client'

// 系统名称
export const SYSTEM_NAME = 'StelluX'

// 秘钥
export const CLIENT_ID = 'StelluxTrader-client' // 客户端id
export const CLIENT_SECRET = 'stellux_trader_client_secret' // 客户端密钥
// 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
export const REGISTER_APP_CODE = '123456' // @TODO 正式部署在修改

// 字体图标 @TODO 替换设计提供的地址 https://blog.csdn.net/weixin_44119268/article/details/102629409
// 注意：UI图标更新后，需要重新更新地址和本地代码
export const ICONFONT_URL =
  process.env.NODE_ENV === 'development' ? '//at.alicdn.com/t/c/font_4571567_tkz4ooxnhn.js' : '/iconfont/iconfont.js'

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

// 当前切换的主题色
export const KEY_THEME = NAMESPACE + '_' + 'theme'

// 默认语言 en-US
export const DEFAULT_LOCALE = 'en-US'

export const isProd = process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'prod'

// 貨幣
export const CURRENCY = 'USDT'

// 测试环境
const development = {
  tradingViewUrl: 'http://localhost:3000',
  baseURL: 'http://192.168.5.60:8000',
  ws: 'ws://192.168.5.60:19109/websocketServer',
  imgDomain: 'http://192.168.5.60:19000/trade/' // 图片域名前缀
}
// 正式环境
const production = {
  tradingViewUrl: 'https://tradingview.stellux.io',
  baseURL: 'https://client.stellux.io',
  ws: 'wss://websocket.stellux.io/websocketServer',
  imgDomain: 'https://file.stellux.io/trade/'
}

const env = isProd ? production : development

export const URLS = {
  offical: 'www.stellux.com',
  ...env
}
