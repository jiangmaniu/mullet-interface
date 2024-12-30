// 线上测试环境

import config from './config'

export default {
  ...config,
  tradingViewUrl: 'https://tradingview-dev.stellux.io',
  baseURL: 'https://client-dev.stellux.io',
  ws: 'wss://websocket-dev.stellux.io/websocketServer',
  imgDomain: 'https://file-dev.stellux.io/trade/' // 图片域名前缀
}
