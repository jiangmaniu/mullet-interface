# Cobo 充值监听使用指南

## 功能概述

前端充值监听功能支持：
1. ✅ **实时监听充值状态**：自动检测充值交易
2. ✅ **显示确认进度**：显示 `Confirming: 32/64` 确认进度
3. ✅ **充值完成通知**：显示 `Completed: 充值成功`
4. ✅ **进度条可视化**：彩色进度条显示确认百分比

---

## 使用方法

### 1. 使用 Hook

```tsx
import { useCoboDepositMonitor } from '@/hooks/useCoboDepositMonitor'

function MyComponent() {
  const depositAddress = '5i5g14ncp2tVDk98ZB89oKrbhsEWjE7mcgLp18J5TeA9'
  
  const {
    transactions,           // 所有交易列表
    latestDeposit,         // 最新完成的充值
    confirmingDeposit,     // 当前确认中的充值
    isMonitoring,          // 是否正在监听
    startMonitoring,       // 开始监听
    stopMonitoring,        // 停止监听
    getConfirmationProgress,   // 获取确认进度文本 "32/64"
    getConfirmationPercentage  // 获取确认百分比 50
  } = useCoboDepositMonitor({
    depositAddress,        // 充值地址（必填）
    walletIds: ['4887566c-3311-46a3-9dc7-16183e72d4f5'], // 可选
    enabled: true,
    pollInterval: 10000,   // 10秒轮询一次
    onDepositConfirming: (tx) => {
      // 确认中回调
      console.log(`确认进度: ${tx.confirmed_num}/${tx.confirming_threshold}`)
    },
    onDepositDetected: (tx) => {
      // 充值完成回调
      console.log('充值成功!', tx.destination.amount, tx.token_id)
    }
  })
  
  useEffect(() => {
    startMonitoring()
    return () => stopMonitoring()
  }, [])
  
  return (
    <div>
      {/* 确认中的交易 */}
      {confirmingDeposit && (
        <div>
          <p>{confirmingDeposit.destination.amount} {confirmingDeposit.token_id}</p>
          <p>确认进度: {getConfirmationProgress(confirmingDeposit)}</p>
          <Progress percent={getConfirmationPercentage(confirmingDeposit)} />
        </div>
      )}
      
      {/* 完成的交易 */}
      {latestDeposit && (
        <div>
          ✅ 充值成功! {latestDeposit.destination.amount} {latestDeposit.token_id}
        </div>
      )}
    </div>
  )
}
```

### 2. 使用组件

```tsx
import CoboDepositStatus from '@/components/CoboDepositStatus'

function MyPage() {
  const depositAddress = '5i5g14ncp2tVDk98ZB89oKrbhsEWjE7mcgLp18J5TeA9'
  
  return (
    <CoboDepositStatus
      depositAddress={depositAddress}
      autoStart={true}
      onDepositComplete={(amount, token) => {
        console.log('充值完成:', amount, token)
        // 刷新余额等操作
      }}
    />
  )
}
```

---

## API 参数说明

### useCoboDepositMonitor 参数

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| `depositAddress` | `string` | 否* | 充值地址（用于过滤） |
| `walletIds` | `string[]` | 否* | 钱包ID列表（用于过滤） |
| `enabled` | `boolean` | 否 | 是否启用监听，默认 `true` |
| `pollInterval` | `number` | 否 | 轮询间隔（毫秒），默认 `10000` |
| `onDepositConfirming` | `function` | 否 | 确认中回调 |
| `onDepositDetected` | `function` | 否 | 充值完成回调 |

> *注：`depositAddress` 和 `walletIds` 至少需要提供一个

### 返回值

| 字段 | 类型 | 说明 |
|-----|------|------|
| `transactions` | `CoboTransaction[]` | 所有交易列表 |
| `latestDeposit` | `CoboTransaction \| null` | 最新完成的充值 |
| `confirmingDeposit` | `CoboTransaction \| null` | 当前确认中的充值 |
| `isMonitoring` | `boolean` | 是否正在监听 |
| `error` | `string \| null` | 错误信息 |
| `startMonitoring` | `() => void` | 开始监听 |
| `stopMonitoring` | `() => void` | 停止监听 |
| `refetch` | `() => Promise<void>` | 手动刷新 |
| `getConfirmationProgress` | `(tx) => string` | 获取确认进度文本 |
| `getConfirmationPercentage` | `(tx) => number` | 获取确认百分比 |

---

## 交易数据结构

```typescript
interface CoboTransaction {
  transaction_id: string        // 交易ID
  wallet_id: string             // 钱包ID
  type: 'Deposit' | 'Withdraw'  // 交易类型
  status: 'Confirming' | 'Completed' | 'Failed' | 'Pending'
  chain_id: string              // 链ID (ETH, SOL, TRON)
  token_id: string              // 代币ID (ETH_USDT, SOL_USDC)
  destination: {
    address: string             // 充值地址
    amount: string              // 充值金额
  }
  confirmed_num: number         // 当前确认数
  confirming_threshold: number  // 需要的确认数
  transaction_hash?: string     // 交易哈希
  created_timestamp: number     // 创建时间戳
  updated_timestamp: number     // 更新时间戳
}
```

---

## 使用场景

### 场景 1: 充值页面显示进度

```tsx
import { Progress } from 'antd'
import { useCoboDepositMonitor } from '@/hooks/useCoboDepositMonitor'

function DepositPage({ depositAddress }) {
  const { 
    confirmingDeposit, 
    latestDeposit,
    getConfirmationProgress,
    getConfirmationPercentage
  } = useCoboDepositMonitor({
    depositAddress,
    onDepositConfirming: (tx) => {
      // 可以在这里更新 UI 或发送通知
      console.log('确认进度更新')
    }
  })
  
  return (
    <div>
      {confirmingDeposit && (
        <Card>
          <h3>正在确认充值</h3>
          <p>{confirmingDeposit.destination.amount} {confirmingDeposit.token_id}</p>
          <Progress 
            percent={getConfirmationPercentage(confirmingDeposit)}
            status="active"
            format={() => getConfirmationProgress(confirmingDeposit)}
          />
        </Card>
      )}
      
      {latestDeposit && (
        <Alert 
          message="充值成功!" 
          description={`${latestDeposit.destination.amount} ${latestDeposit.token_id}`}
          type="success"
        />
      )}
    </div>
  )
}
```

### 场景 2: 对话框自动关闭

```tsx
function TransferDialog({ open, onClose, depositAddress }) {
  const { latestDeposit } = useCoboDepositMonitor({
    depositAddress,
    enabled: open,
    onDepositDetected: (tx) => {
      message.success('充值成功!')
      setTimeout(() => {
        onClose() // 3秒后自动关闭
      }, 3000)
    }
  })
  
  return (
    <Modal open={open} onClose={onClose}>
      {/* ... */}
    </Modal>
  )
}
```

### 场景 3: 多地址监听

```tsx
function WalletDashboard({ walletIds }) {
  const { transactions } = useCoboDepositMonitor({
    walletIds,
    pollInterval: 15000 // 15秒轮询
  })
  
  return (
    <List
      dataSource={transactions}
      renderItem={(tx) => (
        <List.Item>
          <div>
            {tx.destination.amount} {tx.token_id}
            {tx.status === 'Confirming' && (
              <Tag color="processing">确认中 ({tx.confirmed_num}/{tx.confirming_threshold})</Tag>
            )}
            {tx.status === 'Completed' && (
              <Tag color="success">已完成</Tag>
            )}
          </div>
        </List.Item>
      )}
    />
  )
}
```

---

## 最佳实践

### 1. 轮询间隔设置

```tsx
// ✅ 推荐：充值监听 10-15秒
pollInterval: 10000

// ❌ 不推荐：太频繁会增加服务器负载
pollInterval: 1000

// ⚠️ 注意：太慢会影响用户体验
pollInterval: 60000
```

### 2. 自动启动/停止

```tsx
useEffect(() => {
  if (open && depositAddress) {
    startMonitoring()
  } else {
    stopMonitoring()
  }
}, [open, depositAddress])
```

### 3. 错误处理

```tsx
const { error, refetch } = useCoboDepositMonitor({
  depositAddress,
  onDepositDetected: (tx) => {
    // 刷新余额
    refetchBalance()
  }
})

useEffect(() => {
  if (error) {
    message.error('监听失败，请刷新页面')
    // 重试
    setTimeout(() => refetch(), 5000)
  }
}, [error])
```

---

## 对比：旧版 vs 新版

### 旧版（已弃用）
```tsx
// ❌ 需要 userId，只能查询用户历史记录
useCoboDepositMonitor({
  userId: user.id,
  enabled: true
})
```

### 新版（推荐）
```tsx
// ✅ 按地址过滤，实时查询交易状态
useCoboDepositMonitor({
  depositAddress: '5i5g14ncp2tVDk98ZB89oKrbhsEWjE7mcgLp18J5TeA9',
  onDepositConfirming: (tx) => {
    // 显示确认进度
  }
})
```

---

## 常见问题

### Q1: 为什么没有检测到充值？

**A**: 检查以下几点：
1. `depositAddress` 是否正确
2. `enabled` 是否为 `true`
3. 是否调用了 `startMonitoring()`
4. 检查浏览器控制台是否有错误

### Q2: 如何显示多笔充值？

**A**: 使用 `transactions` 列表：
```tsx
const { transactions } = useCoboDepositMonitor({ depositAddress })

transactions.map(tx => (
  <div key={tx.transaction_id}>
    {tx.destination.amount} {tx.token_id} - {tx.status}
  </div>
))
```

### Q3: 如何在充值完成后执行操作？

**A**: 使用 `onDepositDetected` 回调：
```tsx
useCoboDepositMonitor({
  depositAddress,
  onDepositDetected: async (tx) => {
    // 1. 刷新余额
    await refetchBalance()
    
    // 2. 显示通知
    message.success('充值成功!')
    
    // 3. 跳转页面
    navigate('/wallet')
  }
})
```

---

## 相关文档

- [后端 API 文档](../../backend/docs/TRANSACTION_STATUS_TRACKING.md)
- [Cobo Transaction API](https://www.cobo.com/developers/v2/api-references/wallets/list-all-transactions)
