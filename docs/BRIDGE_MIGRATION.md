# Cross-Chain Bridge Migration Summary

## 概述

跨链桥接功能迁移到 mullet-frontend 项目,支持 TRON / Ethereum / Solana 三条链的资产桥接。

## 已完成的工作

### 1. 核心服务层

#### `src/config/lifiConfig.ts`

- **功能**: LiFi SDK 配置,支持跨链路由
- **特性**:
  - 10 个 LiFi integrator 账户(每分钟自动轮换,规避速率限制)
  - Ankr Premium RPC 配置(ETH/SOL/TRON)
  - 支持的链和 Token 配置
  - 默认设置: 0.25% 手续费, 3% 滑点容差

#### `src/services/debridgeService.ts`

- **功能**: deBridge API 集成,处理跨链桥接订单
- **核心函数**:

  1. `getDeBridgeQuote()` - 获取桥接报价,验证最低金额
  2. `getDeBridgeOrderStatus()` - 查询订单状态
  3. `createDeBridgeOrderEthereum()` - 创建以太坊桥接订单
  4. `createDeBridgeOrderTron()` - 创建 TRON 桥接订单(使用 Privy 嵌入式钱包)
  5. `waitForOrderCompletion()` - 等待订单完成(轮询状态)
  6. `bridgeTronToEthereum()` - TRON → Ethereum 简化接口
  7. `bridgeEthereumToSolana()` - Ethereum → Solana 简化接口

- **TRON 集成细节**:
  - 使用 TronWeb 在本地构建交易
  - 通过后端 API 发送到 Privy 服务器签名
  - 支持 Gas 赞助(用户无需 TRX 即可桥接)
  - 自动处理 Token 授权

---

### 2. UI 组件

#### `src/components/Web/WalletTopUp/index.tsx`

- **功能**: 充值入口,提供三种充值方式
- **方法**:
  1. **Swap** - 兑换不同链上的资产为 USDT
  2. **Transfer** - 跨链转账到 Solana
  3. **Card** - 信用卡购买(使用 Privy fundWallet)

#### `src/components/Web/TransferCryptoDialog/index.tsx`

- **功能**: 跨链充值对话框
- **特性**:
  - 显示充值地址和二维码
  - 支持 TRON / Ethereum / Solana 三条链
  - 自动监听充值(使用 `useDepositListener` hook)
  - 检测到充值后自动触发桥接
  - 实时显示桥接进度

#### `src/components/Web/SwapDialog/index.tsx`

- **功能**: 资产兑换对话框
- **特性**:
  - 使用 LiFi SDK 获取最优路由
  - 支持多链资产兑换
  - 实时显示报价(每 30 秒自动刷新)
  - 显示预估手续费和时间

---

### 3. Hooks

#### `src/hooks/useDepositListener.ts`

- **功能**: 监听用户钱包的充值
- **支持**:
  - TRON: 通过 TronGrid API 监听
  - Ethereum: 通过 Ankr RPC 监听
  - Solana: 通过 Solana RPC 监听
- **特性**:
  - 可配置轮询间隔(默认 5 秒)
  - 自动对比余额变化
  - 返回充值金额、Token 和链信息

---

### 4. 文档

#### `docs/BACKEND_API.md`

- **内容**: 后端 API 接口文档
- **端点**:
  1. `POST /api/tron-transaction/sign` - 标准签名(用户自备 TRX)
  2. `POST /api/tron-transaction/sponsor-and-sign` - Gas 赞助签名
- **包含**:
  - 请求/响应格式
  - 认证要求(Privy Access Token)
  - 实现细节
  - 安全考虑
  - 测试示例

---

## 技术架构

### 跨链桥接流程

```
TRON → Ethereum → Solana
  ↓         ↓         ↓
deBridge  deBridge   目标
 Order    Bridge    账户
```

#### Step 1: TRON → Ethereum

1. 用户在 TRON 钱包充值 USDT
2. `useDepositListener` 检测到充值
3. 调用 `debridgeService.bridgeTronToEthereum()`:
   - 获取 deBridge 报价
   - 授权 Token(如需要)
   - 创建桥接订单
   - 通过后端 API 签名交易(Privy)
   - 广播到 TRON 网络
4. 等待订单完成(轮询状态)

#### Step 2: Ethereum → Solana

1. TRON 订单完成后,资金到达 Ethereum 钱包
2. 调用 `debridgeService.bridgeEthereumToSolana()`:
   - 获取 deBridge 报价
   - 使用 Privy Ethereum 钱包签名
   - 创建桥接订单
3. 资金最终到达 Solana 目标地址

---

## Privy TRON 钱包集成

### 为什么使用后端签名?

- Privy 嵌入式钱包是**托管钱包**,私钥由 Privy 服务器管理
- 前端无法直接访问私钥
- 所有 TRON 交易签名都必须通过 Privy API

### 签名流程

```typescript
// 1. 前端构建交易
const transaction = await tronWeb.transactionBuilder.triggerSmartContract(...)

// 2. 注入自定义 calldata (仅桥接订单)
transaction.raw_data.contract[0].parameter.value.data = customCalldata
transaction.txID = recalculateTxID(transaction)

// 3. 发送到后端签名
const response = await fetch('/api/tron-transaction/sponsor-and-sign', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${privyAccessToken}`
  },
  body: JSON.stringify({
    walletId: tronWallet.address,
    transaction,
    publicKey: userPublicKey,
    transactionHash: transaction.txID
  })
})

// 4. 后端返回已签名交易
const { txid } = await response.json()
console.log('Transaction broadcast:', txid)
```

### Gas 赞助机制

- 用户无需持有 TRX 即可进行桥接
- 后端使用多签名账户支付 Gas 费用
- 降低用户使用门槛

---

## 集成到现有系统

### 在 DepositModal 中使用

```tsx
import WalletTopUp from '@/components/Web/WalletTopUp'
import TransferCryptoDialog from '@/components/Web/TransferCryptoDialog'
import SwapDialog from '@/components/Web/SwapDialog'

function DepositModal() {
  const [showTopUp, setShowTopUp] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showSwap, setShowSwap] = useState(false)

  return (
    <>
      <Button onClick={() => setShowTopUp(true)}>Add Funds (Cross-Chain)</Button>

      <WalletTopUp
        open={showTopUp}
        onClose={() => setShowTopUp(false)}
        onSwapClick={() => {
          setShowTopUp(false)
          setShowSwap(true)
        }}
        onTransferClick={() => {
          setShowTopUp(false)
          setShowTransfer(true)
        }}
      />

      <TransferCryptoDialog
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        onDepositDetected={(amount, token, chain) => {
          console.log('Deposit detected:', { amount, token, chain })
        }}
      />

      <SwapDialog
        open={showSwap}
        onClose={() => setShowSwap(false)}
        onSwapComplete={(txHash) => {
          console.log('Swap completed:', txHash)
        }}
      />
    </>
  )
}
```

---

## 依赖项

### 需要安装的包

```json
{
  "dependencies": {
    "@lifi/sdk": "^3.0.0",
    "tronweb": "^5.0.0",
    "@solana/web3.js": "^1.80.0"
  }
}
```

### 安装命令

```bash
pnpm add @lifi/sdk tronweb @solana/web3.js
```

---

## 后端要求

### 必需的 API 端点

1. **`POST /api/tron-transaction/sign`**

   - 标准 TRON 交易签名
   - 用户需自备 TRX

2. **`POST /api/tron-transaction/sponsor-and-sign`**
   - Gas 赞助签名
   - 后端支付 TRX 手续费

### 认证

- 使用 Privy Access Token (Bearer Token)
- 验证 token 有效性
- 确保 walletId 与 token 中的用户匹配

### 环境变量

```bash
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
TRON_RPC_URL=https://rpc.ankr.com/premium-http/tron/...
```

详见: `docs/BACKEND_API.md`

---

## 配置

### 环境变量 (前端)

```typescript
// .env
VITE_BASE_URL=https://client-test.mullet.top
```

### LiFi Integrators

在 `src/config/lifiConfig.ts` 中配置多个 integrator 账户以规避速率限制:

```typescript
export const LIFI_CONFIG = {
  integrators: [
    'mullet-app-01',
    'mullet-app-02'
    // ... 10 个账户
  ]
}
```

### RPC URLs

```typescript
export const CUSTOM_RPC_URLS = {
  1: ['https://rpc.ankr.com/premium-http/eth/...'], // Ethereum
  1151111081099710: ['https://rpc.ankr.com/premium-http/solana/...'], // Solana
  195: ['https://rpc.ankr.com/premium-http/tron/...'] // TRON
}
```

---

## 测试

### 测试跨链桥接

1. 打开 TransferCryptoDialog
2. 选择 TRON / USDT
3. 向显示的地址发送测试金额(≥$20)
4. 等待自动检测充值
5. 观察桥接进度:
   - TRON → Ethereum (约 5-10 分钟)
   - Ethereum → Solana (约 5-10 分钟)
6. 验证 Solana 钱包收到资金

### 测试 Swap

1. 打开 SwapDialog
2. 选择源链和目标链
3. 输入兑换金额
4. 查看实时报价
5. 执行兑换

---

## 已知限制

### 最低充值金额

- **TRON**: $20 USD
- **Ethereum**: $3 USD
- **Solana**: $10 USD

### 桥接时间

- 单次桥接: 5-10 分钟
- 双步桥接(TRON → ETH → SOL): 10-20 分钟

### Gas 赞助限制

建议后端设置每用户每日限额,防止滥用:

- 每天最多 100 USDT 等值的桥接
- 超过限额后要求用户自备 TRX

---

## 故障排查

### 1. "Missing required wallets"

**原因**: Privy 钱包未初始化

**解决**:

```tsx
const { ready, authenticated } = usePrivy()
if (!ready || !authenticated) return <div>Loading...</div>
```

### 2. "Failed to get access token"

**原因**: Privy token 过期

**解决**:

```tsx
const accessToken = await getAccessToken()
if (!accessToken) {
  // 重新登录
  await login()
}
```

### 3. Backend signing 失败

**检查**:

- Bearer Token 是否正确
- 后端 API 端点是否可访问
- Privy App ID/Secret 是否配置

### 4. 充值检测失败

**检查**:

- RPC 配置是否正确
- API Key 是否有效(TronGrid / Ankr)
- 轮询间隔是否太长

---

## 下一步

### 需要完成的工作

1. **后端实现**:

   - [ ] 实现 `/api/tron-transaction/sign`
   - [ ] 实现 `/api/tron-transaction/sponsor-and-sign`
   - [ ] 配置 Privy 凭证
   - [ ] 设置 TRX 资金池

2. **前端优化**:

   - [ ] 获取用户 TRON 公钥
   - [ ] 优化错误处理
   - [ ] 添加交易历史记录
   - [ ] 添加桥接状态通知

3. **测试**:
   - [ ] 端到端测试
   - [ ] 压力测试(速率限制)
   - [ ] 错误场景测试
   - [ ] Gas 赞助限额测试

---

## 参考资料

- [LiFi SDK Documentation](https://docs.li.fi/)
- [deBridge API Documentation](https://docs.debridge.finance/api/)
- [Privy Embedded Wallets](https://docs.privy.io/guide/react/wallets/embedded)
- [TronWeb Documentation](https://developers.tron.network/docs/tronweb-introduction)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

---

## 总结

✅ 已迁移跨链桥接功能

✅ 支持 TRON / Ethereum / Solana 三条链

✅ 使用 Privy 嵌入式钱包 + 后端签名

✅ 支持 Gas 赞助(用户无需 TRX)

✅ 自动检测充值并触发桥接

⚠️ 需要后端实现签名 API 接口

📝 详细文档: `docs/BACKEND_API.md`
