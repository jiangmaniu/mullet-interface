// 线上生产环境 lynfoo平台
import config from './config'

export default {
  ...config,
  tradingViewUrl: 'https://tradingview.lynfoocn.com',
  baseURL: 'https://client.lynfoocn.com',
  ws: 'wss://websocket.lynfoocn.com:443/websocketServer',
  imgDomain: 'https://file.lynfoocn.com/trade/'
}
