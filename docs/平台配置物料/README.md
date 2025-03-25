## 使用

> 部署不同平台时，把平台下的文件复制到 docker nginx 映射出来的目录

## client

按示例项目的目录结构替换`./web-trade-client/platform`下图片、配置信息

1. 按需修改配置文件 `web-trade-client/platform/config.json`

```json
{
  // 网站名称(必填)
  "name": "Stellux",
  // 客户ID (必填)
  "CLIENT_ID": "trade-pc-client",
  // 客户秘钥 (必填)
  "CLIENT_SECRET": "stellux_trader_client_secret",
  // 识别码 (必填) 在manager端新增填入 /zh-TW/customer-group
  "REGISTER_APP_CODE": "123456",
  // websocket地址 (必填)
  "ws": "wss://websocket.stellux.io/websocketServer",
  // 图片域名前缀地址 (必填)
  "imgDomain": "https://file.stellux.io/trade/",
  // 控制是否打开注册模块 (选填)
  "REGISTER_MODULE": true,
  // KYC 证件类型是否只显示身份证 (选填)
  "ID_CARD_ONLY": false,
  // 控制是否显示隐藏交易页面行情全部Tab标签 (选填)
  "SHOW_QUOTE_CATEGORY_ALL_TAB": true,
  // 隐藏账户转账功能 (选填)
  "HIDE_ACCOUNT_TRANSFER": false,
  // 隐藏创建账户功能 (选填)
  "HIDE_CREATE_ACCOUNT": false,
  // 隐藏账户重命名功能 (选填)
  "HIDE_ACCOUNT_RENAME": false,
  // 开启H5调试模式 (选填)
  "DEBUG": false,
  // salesmartly客服配置l地址 (选填) https://www.salesmartly.com/
  "salesmartlyJSUrl": "https://plugin-code.salesmartly.com/js/project_247867_254558_1739880055.js"
}
```

2. 修改h5 pwa桌面应用配置`platform/manifest.json`

```json
// 应用名称
"name": "Stellux",
// 简短名称
"short_name": "Stellux",
```

3. 按图片文件类型规则修改图片

- `platform/icons`
  - `icon-192x192.png`
  - `icon-384x384.png`
  - `icon-512x512.png`
- `platform/img` 按图片格式和大小替换图片即可
- `platform/favicon.ico` 网站ico图标

1. 修改Lottie动画json文件

`platform/lottie/loading.json`

