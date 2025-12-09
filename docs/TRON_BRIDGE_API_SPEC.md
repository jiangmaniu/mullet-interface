# TRON 跨链桥接后端 API 规范

## API Base URL

**生产环境**: `https://api.mulletfinance.xyz`  
**测试环境**: `http://localhost:8787`

---

## 1. TRON 交易标准签名

### `POST /api/tron-transaction/sign`

用于 TRON 交易的标准签名（用户自己支付 Gas 费用）。

#### Request Headers

```
Content-Type: application/json
Authorization: Bearer {PRIVY_ACCESS_TOKEN}
```

#### Request Body

```typescript
{
  "transaction": string,      // Base64 编码的 TRON 交易数据
  "walletId": string,          // Privy 钱包 ID
  "publicKey": string,         // TRON 公钥（Base64 或 Hex）
  "chainId": string            // 可选，链 ID（默认 "0x2b6653dc" 表示 TRON Mainnet）
}
```

#### Response

**成功 (200)**:

```typescript
{
  "success": true,
  "data": {
    "signedTransaction": string,  // 签名后的交易（Base64）
    "txID": string                // 交易 ID（可选）
  }
}
```

**失败 (400/401/500)**:

```typescript
{
  "success": false,
  "error": string,
  "message": string
}
```

#### 示例

```bash
curl -X POST https://api.mulletfinance.xyz/api/tron-transaction/sign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "transaction": "CiYKID...",
    "walletId": "did:privy:abc123",
    "publicKey": "04a1b2c3...",
    "chainId": "0x2b6653dc"
  }'
```

---

## 2. TRON 交易 Gas 赞助签名

### `POST /api/tron-transaction/sponsor-and-sign`

用于 TRON 交易的 Gas 赞助签名（平台支付 Gas 费用，用户无需持有 TRX）。

#### Request Headers

```
Content-Type: application/json
Authorization: Bearer {PRIVY_ACCESS_TOKEN}
```

#### Request Body

```typescript
{
  "transaction": string,      // Base64 编码的 TRON 交易数据
  "walletId": string,          // Privy 钱包 ID
  "publicKey": string,         // TRON 公钥（Base64 或 Hex）
  "chainId": string,           // 可选，链 ID（默认 "0x2b6653dc"）
  "userAddress": string        // 用户的 TRON 地址（用于限额检查）
}
```

#### Response

**成功 (200)**:

```typescript
{
  "success": true,
  "data": {
    "signedTransaction": string,  // 签名后的交易（Base64）
    "txID": string,               // 交易 ID（可选）
    "sponsored": true,            // 表示已赞助
    "gasFeePaid": string          // 平台支付的 Gas 费用（TRX）
  }
}
```

**失败 - 超出限额 (429)**:

```typescript
{
  "success": false,
  "error": "DAILY_LIMIT_EXCEEDED",
  "message": "Daily gas sponsorship limit reached. Please try again tomorrow or pay your own gas fees.",
  "limit": {
    "daily": number,      // 每日限额（次数）
    "used": number,       // 已使用次数
    "resetAt": string     // 重置时间（ISO 8601）
  }
}
```

**失败 (400/401/500)**:

```typescript
{
  "success": false,
  "error": string,
  "message": string
}
```

#### Gas 赞助限制

- **每日限额**: 每个用户每天最多 5 笔赞助交易
- **单笔限额**: 最高赞助 50 TRX Gas 费用
- **重置时间**: 每天 UTC 00:00 重置
- **超出限额**: 返回 429 错误，前端需回退到标准签名

#### 示例

```bash
curl -X POST https://api.mulletfinance.xyz/api/tron-transaction/sponsor-and-sign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "transaction": "CiYKID...",
    "walletId": "did:privy:abc123",
    "publicKey": "04a1b2c3...",
    "chainId": "0x2b6653dc",
    "userAddress": "TXYZaBcD..."
  }'
```

---

## 安全要求

### 1. 身份验证

- 所有请求必须包含有效的 Privy Access Token
- 验证 token 有效性和用户权限
- 验证 `walletId` 属于该用户

### 2. 交易验证

- 验证交易数据完整性
- 检查交易金额是否合理（防止异常大额）
- 验证目标地址有效性
- 检查 token 地址是否在白名单（USDT/USDC）

### 3. Gas 赞助限制

- 实现每日限额（推荐 5 笔/用户/天）
- 实现单笔 Gas 费用上限（推荐 50 TRX）
- 记录所有赞助交易日志
- 监控异常使用模式

### 4. 错误处理

- 详细记录所有错误日志
- 不暴露敏感信息（如私钥、内部错误）
- 提供友好的错误消息

---

## 实现建议

### 后端技术栈

- **Cloudflare Workers**: 无服务器，全球分布
- **Privy SDK**: 用户身份验证和钱包管理
- **TronWeb**: TRON 区块链交互
- **KV Storage**: 存储用户限额数据

### 关键逻辑

```typescript
// 1. 验证 Privy Token
const user = await verifyPrivyToken(authHeader)

// 2. 验证钱包所有权
const wallet = user.linkedAccounts.find(w => w.walletId === walletId)
if (!wallet) throw new Error('Wallet not found')

// 3. 解析交易
const transaction = TronWeb.utils.transaction.deserialize(transactionBase64)

// 4. Gas 赞助检查（仅 sponsor-and-sign）
const usage = await checkDailyLimit(userAddress)
if (usage.count >= 5) {
  return { success: false, error: 'DAILY_LIMIT_EXCEEDED', ... }
}

// 5. 使用 Privy API 签名
const signed = await privy.signTransaction({ walletId, transaction })

// 6. 更新限额（仅 sponsor-and-sign）
await incrementDailyLimit(userAddress)

// 7. 返回签名结果
return { success: true, data: { signedTransaction: signed } }
```

---

## 前端集成示例

```typescript
// 使用项目的 request 工具
import { request } from '@/utils/request'

// 标准签名
const signResult = await request('/api/tron-transaction/sign', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`
  },
  data: {
    transaction: base64Transaction,
    walletId: 'did:privy:...',
    publicKey: '04a1b2c3...',
    chainId: '0x2b6653dc'
  }
})

// Gas 赞助签名（带回退）
try {
  const sponsorResult = await request('/api/tron-transaction/sponsor-and-sign', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: {
      transaction: base64Transaction,
      walletId: 'did:privy:...',
      publicKey: '04a1b2c3...',
      chainId: '0x2b6653dc',
      userAddress: 'TXYZaBcD...'
    }
  })

  if (!sponsorResult.success && sponsorResult.error === 'DAILY_LIMIT_EXCEEDED') {
    // 回退到标准签名
    console.warn('Gas sponsorship limit reached, falling back to standard signing')
    return signStandardTransaction()
  }
} catch (error) {
  // 赞助失败，回退到标准签名
  console.warn('Gas sponsorship failed, falling back to standard signing')
  return signStandardTransaction()
}
```

---

## 测试清单

### 功能测试

- [ ] 标准签名成功场景
- [ ] Gas 赞助签名成功场景
- [ ] 超出每日限额场景
- [ ] 无效 token 场景
- [ ] 无效 walletId 场景
- [ ] 无效交易数据场景

### 安全测试

- [ ] Token 验证正确
- [ ] 钱包所有权验证正确
- [ ] 限额机制工作正常
- [ ] 异常请求被拦截

### 性能测试

- [ ] 响应时间 < 2 秒
- [ ] 并发处理能力
- [ ] KV 存储读写性能

---

## 监控和日志

### 关键指标

- 请求成功率
- 平均响应时间
- Gas 赞助使用量
- 每日限额触发次数
- 错误类型分布

### 日志记录

```typescript
{
  timestamp: '2025-12-09T10:30:00Z',
  endpoint: '/api/tron-transaction/sponsor-and-sign',
  userId: 'did:privy:abc123',
  walletId: 'did:privy:wallet:xyz',
  userAddress: 'TXYZaBcD...',
  gasFeePaid: '15.5 TRX',
  success: true,
  responseTime: '1234ms'
}
```

---

## 部署说明

### Cloudflare Workers 环境变量

```bash
PRIVY_APP_ID=cmi9npyqo012tjp0c4451zwko
PRIVY_APP_SECRET=your-secret-here
TRON_MAINNET_RPC=https://rpc.ankr.com/premium-http/tron/...
SPONSOR_WALLET_PRIVATE_KEY=your-sponsor-wallet-key
MAX_DAILY_SPONSORSHIPS=5
MAX_GAS_PER_TX=50
```

### 部署命令

```bash
# 开发环境
wrangler dev

# 生产部署
wrangler publish --env production
```

---

## 常见问题

### Q1: 为什么需要两个端点？

A: `sign` 用于用户自付 Gas，`sponsor-and-sign` 用于平台赞助。分离便于监控和限额管理。

### Q2: Gas 赞助限额多少合理？

A: 建议 5 笔/天，每笔最高 50 TRX。根据实际使用情况调整。

### Q3: 如何处理限额超出？

A: 返回 429 错误，前端自动回退到标准签名（用户自付 Gas）。

### Q4: 安全性如何保证？

A: 验证 Privy Token → 验证钱包所有权 → 交易数据验证 → 限额控制 → 日志记录。

---

**文档版本**: 1.0  
**最后更新**: 2025-12-09  
**维护者**: Backend Team
