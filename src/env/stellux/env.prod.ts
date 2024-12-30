// 线上生产环境

import config from './config'

export default {
  ...config,
  tradingViewUrl: 'https://tradingview.stellux.io',
  baseURL: 'https://client.stellux.io',
  ws: 'wss://websocket.stellux.io/websocketServer',
  imgDomain: 'https://file.stellux.io/trade/'
}
