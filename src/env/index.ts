// 环境变量-仅仅用于调试

let ENV = {
  // ========= stellux 正式环境 ================
  baseURL: 'https://client.stellux.io', // API地址
  ws: 'wss://websocket.stellux.io/websocketServer', // websocket地址
  imgDomain: 'https://file.stellux.io/trade/' // 图片地址

  // ========= stellux 测试环境 ================
  // baseURL: 'https://client-dev.stellux.io',
  // ws: 'wss://websocket-dev.stellux.io/websocketServer',
  // imgDomain: 'https://file-dev.stellux.io/trade/' // 图片域名前缀

  // ========= lynfoo 正式环境 ================
  // baseURL: 'https://client.lynfoocn.com',
  // ws: 'wss://websocket.lynfoocn.com:443/websocketServer',
  // imgDomain: 'https://file.lynfoocn.com/trade/'
}

export default ENV
