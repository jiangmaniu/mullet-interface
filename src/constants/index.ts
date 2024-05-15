import axios from 'axios'

const NAMESPACE = 'mt_admin'

// 首页
export const HOME_PAGE = '/account'

// 本地存储-用户信息-键
export const KEY_TOKEN = NAMESPACE + '_' + 'token'
export const KEY_USER_INFO = NAMESPACE + '_' + 'userInfo'
export const KEY_PARAMS = NAMESPACE + '_' + 'params'
export const KEY_PWD = NAMESPACE + '_' + 'pwd'

// 临时缓存在sessionStorage中的语言
export const KEY_TEMP_LNG = NAMESPACE + '_' + 'temp_lang'

// 定位信息
export const KEY_LOCATION_INFO = NAMESPACE + '_' + 'location_info'

// 打开的菜单路径
export const KEY_OPEN_MENU_LIST = NAMESPACE + '_' + 'open_menu_list'
export const KEY_ACTIVE_MENU_PATH = NAMESPACE + '_' + 'active_menu_path'

// 默认语言 en-US
export const DEFAULT_LOCALE = 'en-US'

// 本地测试环境、线上测试环境
const isDev = process.env.NODE_ENV === 'development' || process.env.BUILD_ENV === 'dev'

export let URLS = {
  offical: 'www.StelluX.com',
  cdex: 'https://www.cd-ex.com',
  // 入金地址
  // PAY_API: isDev ? 'https://upay.antswallets.lan' : 'https://upay.antswallets.com',
  PAY_API_DEFAULT: 'https://upay.antswallets.com',
  PAY_API: 'https://upay.antswallets.com',
  live800:
    'https://f88.live800.com/live800/chatClient/chatbox.jsp?companyID=1539023&configID=158453&jid=1533075335&lan=en&subject=%E5%92%A8%E8%AF%A2&prechatinfoexist=1&s=1',
  ws: isDev
    ? {
        y: ['ws://192.168.137.113:9000/api/mca/noauth/websocks/mt5sock'],
        d: ['ws://192.168.137.113:9000/api/mca/auth/websocks/mt5sock'],
        r: ['ws://192.168.137.113:9000/api/mca/auth/websocks/mt5sock']
      }
    : {
        y: ['wss://tradeapi-cdex.appcdex.com/api/bbtc/noauth/websocks/mt5sock'], // 访客
        d: ['wss://tradeapi-cdex.appcdex.com/api/bbtc/auth/websocks/mt5sock'], // 真实
        r: ['wss://tradeapi-cdex.appcdex.com/api/bbtc/demoauth/websocks/mt5sock'] // 模拟
      },
  config: {}
}

// 读取缓存初始化url
async function initURLS() {
  try {
    const val = await localStorage.getItem('@URLS')
    const data = val ? JSON.parse(val) : {}
    URLS = {
      ...URLS,
      ...data
    }
    return URLS
  } catch (e) {}
}

// 设置地址
function setURLS(data: any) {
  try {
    URLS = {
      ...URLS,
      ...data
    }
    localStorage.setItem('@URLS', JSON.stringify(URLS))
  } catch (e) {}
}

// 获取数组第一项返回
const getFistItem = (config: any) => {
  const res: any = {}
  Object.keys(config).forEach((key) => {
    res[key] = config[key]?.[0]
  })
  return res
}

// 动态获取全局配置
export async function fetchURLS() {
  // 获取国家简称
  // const geoInfo = await getGeoInfo().catch((e) => e)
  // const isIndia = geoInfo?.country === 'in'

  let res = await axios.get('/api/services/app/UniversalConfig/GetDomainByType', {
    params: { type: 2 },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem(KEY_TOKEN)
    }
  })
  const config = res?.data?.result?.api
  // const config = {
  //   BASE_API: ['https://awapis.cd-ex.io', 'https://awapis.cdexapp500.com'],
  //   PAY_API: ['https://idcdex2ant.nbtwcw.com:14430/', 'https://incdex2ant.nbtwcw.com:14430/', 'https://cdex2ant.nbtwcw.com/'],
  //   WAP_URI: ['https://www.cd-ex.com/', 'https://www.cd-ex.com/'],
  //   WEB_URI: ['https://mt.cd-ex.io/'],
  //   CRM_API: ['https://crm.etescape.com:12343/maidian/scada/collect'],
  //   KLine_API: ['https://cckl.gwchart.com', 'https://cckl.gneia.com', 'https://cckl.gwchart.com'],
  //   KLinePage: ['https://mt.cd-ex.io/tradecdex'],
  //   CMS_API: ['https://crossnz.jiwqsa.com:50000/', 'https://crossnz.tienae.com:50000/'],
  //   CDEX_Live800: [
  //     'https://f88.live800.com/live800/chatClient/chatbox.jsp?companyID=1539023&configID=158453&jid=1533075335&subject=%E5%92%A8%E8%AF%A2&prechatinfoexist=1&s=1'
  //   ]
  // }
  if (config) {
    // 根据地区切换入金地址
    // const getUPayUrl = (urls: string[]) => {
    //   let resultUrl: any = ''
    //   const isInUrl = (url: string) => {
    //     const temp = new URL(url)?.host?.split('.')?.[0]
    //     return temp?.startsWith('id') || temp?.startsWith('in')
    //   }
    //   const inUrl = (urls || []).find((v) => isInUrl(v))
    //   if (isIndia) {
    //     resultUrl = inUrl
    //   } else {
    //     resultUrl = urls.find((v) => !isInUrl(v))
    //   }
    //   return resultUrl || urls[0] || URLS.PAY_API
    // }

    URLS = {
      ...URLS,
      ...getFistItem(config), // 获取数组第一项展示
      config,
      // PAY_API: getUPayUrl(config.PAY_API),
      updateTime: Date.now()
    }
    setURLS(URLS)
  }
}

// 初始化配置
export async function initConfig() {
  // 初始化local中缓存的配置
  const urlInfo: any = await initURLS()
  const updateTime = urlInfo?.updateTime
  // 拉取配置：缓存时间大于1分钟、初次载入
  if ((updateTime && Date.now() - updateTime > 1 * 60 * 1000) || !updateTime) {
    await fetchURLS() // 拉取动态域名配置信息
  }
}
