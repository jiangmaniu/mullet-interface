const NAMESPACE = `stellux_client_${process.env.APP_ENV}` // 命名空间

// 系统名称
export const SYSTEM_NAME = 'StelluX'

// 秘钥
export const CLIENT_ID = 'StelluxTrader-client' // 客户端id
export const CLIENT_SECRET = 'stellux_trader_client_secret' // 客户端密钥
// 注册识别码(从后台客户组获取，部署每套应用都需要填写不同的识别码，区分不同的应用，例如mc/cc/cd)
export const REGISTER_APP_CODE = '123456' // @TODO 正式部署在修改

// 字体图标 替换设计提供的地址 https://blog.csdn.net/weixin_44119268/article/details/102629409
// 注意：UI图标更新后，需要重新更新地址和本地代码
export const ICONFONT_URL =
  process.env.NODE_ENV === 'development' ? '//at.alicdn.com/t/c/font_4571567_lpk2h04u4cm.js' : '/iconfont/iconfont.js'

// 首页
export const WEB_HOME_PAGE = '/trade' // pc端首页
export const ADMIN_HOME_PAGE = '/account'
export const MOBILE_HOME_PAGE = '/app/quote' // 移动端首页

// 本地存储-用户信息-键
export const KEY_ACCOUNT_PASSWORD = NAMESPACE + '_' + 'account_password'
export const KEY_TOKEN = NAMESPACE + '_' + 'token'
export const KEY_USER_INFO = NAMESPACE + '_' + 'userInfo'
export const KEY_PARAMS = NAMESPACE + '_' + 'params'
export const KEY_PWD = NAMESPACE + '_' + 'pwd'
export const KEY_NEXT_REFRESH_TOKEN_TIME = NAMESPACE + '_' + 'nextRefreshTokenTime'
export const KEY_TRADE_PAGE_SHOW_TIME = NAMESPACE + '_' + 'trade_page_show_time' // 进入交易页面时间，用来刷新k线，避免长时间不进入行情断开

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
export const KEY_TRADE_THEME = NAMESPACE + '_' + 'trade_theme'

// 默认语言 en-US
export const DEFAULT_LOCALE = 'en-US'

// 貨幣
export const SOURCE_CURRENCY = 'USD'
export const CURRENCY = 'USDT'
export const CURRENT_YEAR = 2024
export const DEFAULT_CURRENCY_DECIMAL = 2 // 默认货币精度

// 分页默认值
export const DEFAULT_PAGE_SIZE = 10

// 快速下单选择状态
export const KEY_QUICK_PLACE_ORDER_CHECKED = NAMESPACE + '_' + 'quick_place_order_checked'

// 订单二次确认弹窗
export const KEY_ORDER_CONFIRM_CHECKED = NAMESPACE + '_' + 'order_confirm_checked'

// 平仓二次确认弹窗
export const KEY_POSITION_CONFIRM_CHECKED = NAMESPACE + '_' + 'position_confirm_checked'
