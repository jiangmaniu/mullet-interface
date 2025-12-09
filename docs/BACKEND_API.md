# Backend API Requirements for Cross-Chain Bridge

本文档描述了前端跨链桥接功能所需的后端 API 接口。

## Overview

前端使用 **Privy 嵌入式钱包**进行 TRON 链上的交易签名。由于 TRON 钱包是由 Privy 托管的,前端无法直接访问私钥,因此所有 TRON 交易签名都需要通过后端 API 中转到 Privy 服务器。

## Required Endpoints

### 1. Sign TRON Transaction (Standard)

**Endpoint**: `POST /api/tron-transaction/sign`

**Description**: 签名标准的 TRON 交易(用户需自备 TRX 作为 Gas)

**Authentication**: Bearer Token (Privy Access Token)

**Request Body**:

```json
{
  "walletId": "string",           // Privy wallet ID 或地址
  "transactionHash": "string",    // 交易的 txID
  "transaction": {                // 完整的 TRON 交易对象
    "txID": "string",
    "raw_data": { ... },
    "raw_data_hex": "string"
  },
  "publicKey": "string"           // 用户的 TRON 公钥
}
```

**Response**:

```json
{
  "success": true,
  "txid": "string",               // 已签名交易的 txID
  "transactionHash": "string",    // 同 txid
  "signedTransaction": {          // 已签名的完整交易
    "signature": ["string"],
    "txID": "string",
    "raw_data": { ... },
    "raw_data_hex": "string"
  }
}
```

**Error Response**:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error"
}
```

---

### 2. Sign TRON Transaction with Gas Sponsorship

**Endpoint**: `POST /api/tron-transaction/sponsor-and-sign`

**Description**: 签名 TRON 交易并由后端支付 Gas 费用(用户无需 TRX)

**Authentication**: Bearer Token (Privy Access Token)

**Request Body**:

```json
{
  "walletId": "string",           // Privy wallet ID 或地址
  "transactionHash": "string",    // 交易的 txID
  "transaction": {                // 完整的 TRON 交易对象
    "txID": "string",
    "raw_data": { ... },
    "raw_data_hex": "string"
  },
  "publicKey": "string"           // 用户的 TRON 公钥
}
```

**Response**: (Same as standard sign endpoint)

```json
{
  "success": true,
  "txid": "string",
  "transactionHash": "string",
  "signedTransaction": { ... }
}
```

**Notes**:

- 后端使用多签名账户支付 Gas 费用
- 支持用户在没有 TRX 的情况下进行桥接
- 后端需要维护一个 TRX 资金池用于支付手续费

---

## Implementation Details

### Frontend Flow

1. **构建交易**:

   ```typescript
   const tronWeb = new TronWeb({ fullHost: TRON_RPC_URL })
   const transaction = await tronWeb.transactionBuilder.triggerSmartContract(...)
   ```

2. **注入自定义数据** (仅桥接订单):

   ```typescript
   transaction.raw_data.contract[0].parameter.value.data = customCalldata

   // 重新计算 raw_data_hex 和 txID
   const txPb = tronWeb.utils.transaction.txJsonToPb(transaction)
   const rawDataBytes = txPb.getRawData().serializeBinary()
   transaction.raw_data_hex = tronWeb.utils.code.byteArray2hexStr(rawDataBytes)
   transaction.txID = tronWeb.utils.code.byteArray2hexStr(tronWeb.utils.crypto.SHA256(rawDataBytes))
   ```

3. **发送到后端签名**:

   ```typescript
   const response = await fetch('/api/tron-transaction/sponsor-and-sign', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       Authorization: `Bearer ${accessToken}`
     },
     body: JSON.stringify({
       walletId: tronWallet.address,
       transaction,
       publicKey: userPublicKey,
       transactionHash: transaction.txID
     })
   })
   ```

4. **广播已签名交易**:
   ```typescript
   const result = await response.json()
   // 交易已由后端广播到 TRON 网络
   console.log('Transaction hash:', result.txid)
   ```

### Backend Requirements

1. **Privy Integration**:

   - 需要配置 Privy App ID 和 App Secret
   - 验证 Bearer Token 的有效性
   - 调用 Privy Embedded Wallet API 进行签名

2. **Gas Sponsorship**:

   - 配置多签名账户用于支付 TRX 手续费
   - 监控资金池余额并及时充值
   - 记录每笔交易的 Gas 消耗

3. **Error Handling**:

   - Token 验证失败 → 401 Unauthorized
   - 签名失败 → 500 Internal Server Error
   - Gas 不足 → 503 Service Unavailable
   - 交易参数错误 → 400 Bad Request

4. **Rate Limiting**:
   - 每个用户每分钟最多 10 次签名请求
   - 防止滥用 Gas 赞助功能

---

## Example: Approve Token

```typescript
// Frontend: 构建 approve 交易
const approveTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
  tokenAddress,
  'approve(address,uint256)',
  { feeLimit: 50_000_000, callValue: 0 },
  [
    { type: 'address', value: spenderAddress },
    { type: 'uint256', value: amount }
  ],
  userAddress
)

// Frontend: 发送到后端签名 (with gas sponsorship)
const response = await fetch(`${apiEndpoint}/api/tron-transaction/sponsor-and-sign`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    walletId: userAddress,
    transaction: approveTransaction.transaction,
    publicKey: userPublicKey,
    transactionHash: approveTransaction.transaction.txID
  })
})

const result = await response.json()
console.log('Approve tx hash:', result.txid)
```

---

## Security Considerations

1. **Authentication**:

   - 必须验证 Privy Access Token 的有效性
   - 确保 walletId 与 token 中的用户匹配

2. **Transaction Validation**:

   - 验证交易的目标地址是否在白名单中
   - 检查交易的 value 和 calldata 是否合理
   - 防止恶意交易消耗 Gas 资金池

3. **Rate Limiting**:

   - 每个用户每天最多使用 Gas 赞助 100 USDT 等值的桥接
   - 防止单个用户耗尽 Gas 资金池

4. **Monitoring**:
   - 记录所有签名请求和交易哈希
   - 监控 Gas 资金池余额
   - 异常交易量告警

---

## Testing

### Test Endpoint Availability

```bash
# Health check
curl -X POST https://api.example.com/api/tron-transaction/sign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "walletId": "TXxx...",
    "transactionHash": "abc123...",
    "transaction": { ... },
    "publicKey": "04..."
  }'
```

### Expected Response Times

- Standard sign: < 2 seconds
- Sponsor-and-sign: < 5 seconds (includes multi-sig coordination)

---

## References

- [Privy Embedded Wallets Documentation](https://docs.privy.io/guide/react/wallets/embedded)
- [TRON Transaction Format](https://developers.tron.network/docs/transaction)
- [deBridge API Documentation](https://docs.debridge.finance/api/)
