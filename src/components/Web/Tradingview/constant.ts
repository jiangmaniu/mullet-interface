// tradingview常量
import { ResolutionString } from '@/libs/charting_library'
import { genStorageGet, genStorageSet, storageRemove } from '@/utils/storage'

// tradingview图表配置
export const KEY_TRADINGVIEW_CHART_PROPS = 'tradingview.chartproperties'

// 本地存储-tradingview图表设置
export const STORAGE_GET_CHART_PROPS = genStorageGet(KEY_TRADINGVIEW_CHART_PROPS)
export const STORAGE_SET_CHART_PROPS = genStorageSet(KEY_TRADINGVIEW_CHART_PROPS)
export const STORAGE_REMOVE_CHART_PROPS = storageRemove(KEY_TRADINGVIEW_CHART_PROPS)

// 主题色配置
export const ThemeConst = {
  primary: '#183EFC',
  textPrimary: '#183EFC',
  white: '#fff',
  black: '#1C192F', // 黑色主题背景色
  red: '#C54747',
  green: '#45A48A'
}

// 默认展示的分辨率
export const defaultInterval = '15' as ResolutionString // 分辨率，时间间隔，例如1W代表每个条形1周的 默认周期  1/5/15/30/60/240-> 1/5/15/30/60/240分钟  D->一天   W->一周   M->一月

// 临时测试，后面使用接口请求的
export const symbolInfoArr = [
  { name: 'USDHKD', description: '美元港币', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'AUDJPY', description: '澳元日元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 3 },
  {
    name: 'USDCNH',
    description: '美元离岸人民币',
    type: 'forex',
    session: '24x7',
    exchange: '外汇',
    timezone: 'Europe/London',
    precision: 5
  },
  { name: 'AUDNZD', description: '澳元纽元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'EURUSD', description: '欧元美元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'EURAUD', description: '欧元澳元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'USDCHF', description: '美元瑞郎', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'NZDUSD', description: '纽元美元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'GBPCHF', description: '英镑瑞郎', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'GBPJPY', description: '英镑日元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 3 },
  { name: 'EURCHF', description: '欧元瑞郎', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'EURJPY', description: '欧元日元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 3 },
  { name: 'NZDJPY', description: '纽元日元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 3 },
  { name: 'CADJPY', description: '加元日元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 3 },
  { name: 'USDCAD', description: '美元加元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'EURGBP', description: '欧元英镑', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'GBPUSD', description: '英镑美元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'AUDUSD', description: '澳元美元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'USDJPY', description: '美元日元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 3 },
  { name: 'GBPAUD', description: '英镑澳元', type: 'forex', session: '24x7', exchange: '外汇', timezone: 'Europe/London', precision: 5 },
  { name: 'USOIL', description: '美国原油', type: 'goods', session: '24x7', exchange: '商品', timezone: 'Europe/London', precision: 3 },
  { name: 'UKOIL', description: '英国原油', type: 'goods', session: '24x7', exchange: '商品', timezone: 'Europe/London', precision: 3 },
  { name: 'XAUUSD', description: '伦敦金', type: 'goods', session: '24x7', exchange: '商品', timezone: 'Europe/London', precision: 2 },
  { name: 'GOLD', description: '伦敦金', type: 'goods', session: '24x7', exchange: '商品', timezone: 'Europe/London', precision: 2 },
  { name: 'XAGUSD', description: '伦敦银', type: 'goods', session: '24x7', exchange: '商品', timezone: 'Europe/London', precision: 3 },
  { name: 'SILVER', description: '伦敦银', type: 'goods', session: '24x7', exchange: '商品', timezone: 'Europe/London', precision: 3 },
  { name: 'XNGUSD', description: '天然气', type: 'goods', session: '24x7', exchange: '商品', timezone: 'Europe/London', precision: 4 },
  { name: 'HK50', description: '恒生指数', type: 'index', session: '24x7', exchange: '指数', timezone: 'Europe/London', precision: 1 },
  {
    name: 'NAS100',
    description: '纳斯达克指数',
    type: 'index',
    session: '24x7',
    exchange: '指数',
    timezone: 'Europe/London',
    precision: 2
  },
  { name: 'JPN225', description: '日经指数', type: 'index', session: '24x7', exchange: '指数', timezone: 'Europe/London', precision: 1 },
  { name: 'US500', description: '标准普尔指数', type: 'index', session: '24x7', exchange: '指数', timezone: 'Europe/London', precision: 2 },
  { name: 'US30', description: '道琼斯指数', type: 'index', session: '24x7', exchange: '指数', timezone: 'Europe/London', precision: 2 },
  { name: 'GER30', description: '德国指数', type: 'index', exchange: '指数', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'CHINA300', type: 'index', defaultType: 1, session: '24x7', timezone: 'Europe/London', description: '中华300', precision: 1 },
  { name: 'CHA50', type: 'index', defaultType: 1, description: '中华A50', session: '24x7', timezone: 'Europe/London', precision: 1 },
  { name: 'KO', type: 'stock', defaultType: 1, description: '可口可乐', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BABA', type: 'stock', defaultType: 1, description: '阿里巴巴', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'AAPL', type: 'stock', defaultType: 1, description: '苹果', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'FB', type: 'stock', defaultType: 1, description: '脸书', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'GS', type: 'stock', defaultType: 1, description: '高盛', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'DIS', type: 'stock', defaultType: 1, description: '迪士尼', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'NTES', type: 'stock', defaultType: 2, description: '网易', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BIDU', type: 'stock', defaultType: 2, description: '百度', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'MSFT', type: 'stock', defaultType: 2, description: '微软', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '00388.hk', type: 'stock', defaultType: 2, description: '香港交易所', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '00005.hk', type: 'stock', defaultType: 1, description: '汇丰控股', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '01299.hk', type: 'stock', defaultType: 2, description: '友邦保险', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '00763.hk', type: 'stock', defaultType: 2, description: '中兴通讯', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '02318.hk', type: 'stock', defaultType: 2, description: '中国平安', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '01810.hk', type: 'stock', defaultType: 2, description: '小米集团', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '03968.hk', type: 'stock', defaultType: 2, description: '招商银行', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'IQ', type: 'stock', defaultType: 2, description: '爱奇艺', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'PDD', type: 'stock', defaultType: 2, description: '拼多多', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'AMZN', type: 'stock', defaultType: 1, description: '亚马逊', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: '00700.hk', type: 'stock', defaultType: 2, description: '腾讯控股', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'BCHx10/usdt', type: 'usdt', description: 'BCHx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BCHx20/usdt', type: 'usdt', description: 'BCHx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BCHx50/usdt', type: 'usdt', description: 'BCHx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'BTCx10/usdt', type: 'usdt', description: 'BTCx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BTCx20/usdt', type: 'usdt', description: 'BTCx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BTCx50/usdt', type: 'usdt', description: 'BTCx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'LTCx10/usdt', type: 'usdt', description: 'LTCx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'LTCx20/usdt', type: 'usdt', description: 'LTCx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'LTCx50/usdt', type: 'usdt', description: 'LTCx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'DOTx10/usdt', type: 'usdt', description: 'DOTx10', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'DOTx20/usdt', type: 'usdt', description: 'DOTx20', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'DOTx50/usdt', type: 'usdt', description: 'DOTx50', session: '24x7', timezone: 'Europe/London', precision: 4 },

  { name: 'ETHx10/usdt', type: 'usdt', description: 'ETHx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ETHx20/usdt', type: 'usdt', description: 'ETHx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ETHx50/usdt', type: 'usdt', description: 'ETHx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'BTCusdt10x', type: 'usdt', description: 'BCHx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BTCusdt20x', type: 'usdt', description: 'BCHx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BTCusdt50x', type: 'usdt', description: 'BCHx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'BCHusdt10x', type: 'usdt', description: 'BTCx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BCHusdt20x', type: 'usdt', description: 'BTCx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BCHusdt50x', type: 'usdt', description: 'BTCx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'LTCusdt10x', type: 'usdt', description: 'LTCx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'LTCusdt20x', type: 'usdt', description: 'LTCx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'LTCusdt50x', type: 'usdt', description: 'LTCx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'DOTusdt10x', type: 'usdt', description: 'DOTx10', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'DOTusdt20x', type: 'usdt', description: 'DOTx20', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'DOTusdt50x', type: 'usdt', description: 'DOTx50', session: '24x7', timezone: 'Europe/London', precision: 4 },

  { name: 'ETHusdt10x', type: 'usdt', description: 'ETHx10', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ETHusdt20x', type: 'usdt', description: 'ETHx20', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ETHusdt50x', type: 'usdt', description: 'ETHx50', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'BTC50x', type: 'usdt', description: 'BTC50倍', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BTC100x', type: 'usdt', description: 'BTC100倍', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'ETH50x', type: 'usdt', description: 'ETH50倍', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ETH100x', type: 'usdt', description: 'ETH100倍', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'LTC50x', type: 'usdt', description: 'LTC50倍', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'LTC100x', type: 'usdt', description: 'LTC100倍', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'DOT50x', type: 'usdt', description: 'DOT50倍', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'DOT100x', type: 'usdt', description: 'DOT100倍', session: '24x7', timezone: 'Europe/London', precision: 4 },

  { name: 'BCH50x', type: 'usdt', description: 'BCH50倍', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BCH100x', type: 'usdt', description: 'BCH100倍', session: '24x7', timezone: 'Europe/London', precision: 2 },

  { name: 'FIL50x', type: 'usdt', description: 'FIL50倍', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'FIL100x', type: 'usdt', description: 'FIL100倍', session: '24x7', timezone: 'Europe/London', precision: 4 },

  { name: 'ADA50x', type: 'usdt', description: 'ADA50倍', session: '24x7', timezone: 'Europe/London', precision: 5 },
  { name: 'ADA100x', type: 'usdt', description: 'ADA100倍', session: '24x7', timezone: 'Europe/London', precision: 5 },

  { name: 'DOGE50x', type: 'usdt', description: 'DOGE50倍', session: '24x7', timezone: 'Europe/London', precision: 5 },
  { name: 'DOGE100x', type: 'usdt', description: 'DOGE100倍', session: '24x7', timezone: 'Europe/London', precision: 5 },

  { name: 'AXS100x', type: 'usdt', description: 'AXS100倍', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'SOL100x', type: 'usdt', description: 'SOL100倍', session: '24x7', timezone: 'Europe/London', precision: 4 },

  { name: 'BTCUSDT', mtName: 'BTC100x', type: 'usdt', description: 'BTCUSDT', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ETHUSDT', mtName: 'ETH100x', type: 'usdt', description: 'ETHUSDT', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'BCHUSDT', mtName: 'BCH100x', type: 'usdt', description: 'BCHUSDT', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'DOTUSDT', mtName: 'DOT100x', type: 'usdt', description: 'DOTUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'SOLUSDT', mtName: 'SOLUSDT', type: 'usdt', description: 'SOLUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'LTCUSDT', mtName: 'LTC100x', type: 'usdt', description: 'LTCUSDT', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ATOMUSDT', mtName: 'ATOMUSDT', type: 'usdt', description: 'ATOMUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'FILUSDT', mtName: 'FIL100x', type: 'usdt', description: 'FILUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'SANDUSDT', mtName: 'SANDUSDT', type: 'usdt', description: 'SANDUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'DOGEUSDT', mtName: 'DOGE100x', type: 'usdt', description: 'DOGEUSDT', session: '24x7', timezone: 'Europe/London', precision: 5 },
  { name: 'AXSUSDT', mtName: 'AXSUSDT', type: 'usdt', description: 'AXSUSDT', session: '24x7', timezone: 'Europe/London', precision: 2 },
  { name: 'ADAUSDT', mtName: 'ADA100x', type: 'usdt', description: 'ADAUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'AAVEUSDT', type: 'usdt', description: 'AAVEUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 },
  { name: 'UNIUSDT', type: 'usdt', description: 'UNIUSDT', session: '24x7', timezone: 'Europe/London', precision: 4 }
]
