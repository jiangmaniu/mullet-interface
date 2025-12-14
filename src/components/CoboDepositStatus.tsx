import React, { useEffect } from 'react'
import { Card, Progress, Tag, Typography, Space, Spin, Alert } from 'antd'
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useCoboDepositMonitor } from '@/hooks/useCoboDepositMonitor'

const { Text, Title } = Typography

interface CoboDepositStatusProps {
  depositAddress: string
  walletIds?: string[]
  autoStart?: boolean
  onDepositComplete?: (amount: string, token: string) => void
}

/**
 * Cobo 充值状态监听组件
 * 显示充值确认进度和完成状态
 * 
 * @example
 * ```tsx
 * <CoboDepositStatus 
 *   depositAddress="5i5g14ncp2tVDk98ZB89oKrbhsEWjE7mcgLp18J5TeA9"
 *   autoStart={true}
 *   onDepositComplete={(amount, token) => {
 *     console.log('充值完成:', amount, token)
 *   }}
 * />
 * ```
 */
const CoboDepositStatus: React.FC<CoboDepositStatusProps> = ({
  depositAddress,
  walletIds,
  autoStart = true,
  onDepositComplete
}) => {
  const {
    transactions,
    latestDeposit,
    confirmingDeposit,
    isMonitoring,
    error,
    startMonitoring,
    stopMonitoring,
    getConfirmationProgress,
    getConfirmationPercentage
  } = useCoboDepositMonitor({
    depositAddress,
    walletIds,
    enabled: true,
    pollInterval: 10000, // 10秒轮询一次
    onDepositConfirming: (tx) => {
      console.log('[充值监听] 确认进度:', getConfirmationProgress(tx))
    },
    onDepositDetected: (tx) => {
      console.log('[充值监听] 充值成功:', tx.destination.amount, tx.token_id)
      if (onDepositComplete) {
        onDepositComplete(tx.destination.amount, tx.token_id)
      }
      // 充值完成后停止监听
      stopMonitoring()
    }
  })

  useEffect(() => {
    if (autoStart && depositAddress) {
      startMonitoring()
    }
    
    return () => {
      stopMonitoring()
    }
  }, [autoStart, depositAddress, startMonitoring, stopMonitoring])

  // 获取最新的确认中交易
  const currentConfirmingTx = transactions.find(tx => tx.status === 'Confirming')

  return (
    <Card 
      title="充值状态监听" 
      style={{ width: '100%', maxWidth: 500 }}
      extra={
        isMonitoring ? (
          <Tag icon={<SyncOutlined spin />} color="processing">监听中...</Tag>
        ) : (
          <Tag color="default">已停止</Tag>
        )
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 错误提示 */}
        {error && (
          <Alert 
            message="监听错误" 
            description={error} 
            type="error" 
            closable 
          />
        )}

        {/* 确认中的充值 */}
        {currentConfirmingTx && (
          <div>
            <Text type="secondary">正在确认中...</Text>
            <div style={{ marginTop: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>
                    {currentConfirmingTx.destination.amount} {currentConfirmingTx.token_id}
                  </Text>
                  <Text type="secondary">
                    {getConfirmationProgress(currentConfirmingTx)}
                  </Text>
                </div>
                <Progress 
                  percent={getConfirmationPercentage(currentConfirmingTx)} 
                  status="active"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                {currentConfirmingTx.transaction_hash && (
                  <Text 
                    type="secondary" 
                    style={{ fontSize: 12 }}
                    ellipsis={{ tooltip: currentConfirmingTx.transaction_hash }}
                  >
                    TxHash: {currentConfirmingTx.transaction_hash.slice(0, 10)}...
                  </Text>
                )}
              </Space>
            </div>
          </div>
        )}

        {/* 最新完成的充值 */}
        {latestDeposit && (
          <div>
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
              <div>
                <Title level={5} style={{ margin: 0 }}>充值成功！</Title>
                <Text type="secondary">
                  {latestDeposit.destination.amount} {latestDeposit.token_id}
                </Text>
              </div>
            </Space>
          </div>
        )}

        {/* 历史充值列表 */}
        {transactions.length > 0 && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              最近充值 ({transactions.length})
            </Text>
            <div style={{ marginTop: 8 }}>
              {transactions.slice(0, 3).map((tx) => (
                <div 
                  key={tx.transaction_id} 
                  style={{ 
                    padding: '8px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Space>
                    <Text>{tx.destination.amount} {tx.token_id}</Text>
                  </Space>
                  {tx.status === 'Completed' ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>
                  ) : tx.status === 'Confirming' ? (
                    <Tag icon={<SyncOutlined spin />} color="processing">
                      {getConfirmationProgress(tx)}
                    </Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">失败</Tag>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 无数据提示 */}
        {!isMonitoring && transactions.length === 0 && !error && (
          <Text type="secondary">暂无充值记录</Text>
        )}

        {/* 加载中 */}
        {isMonitoring && transactions.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Spin tip="等待充值中..." />
          </div>
        )}
      </Space>
    </Card>
  )
}

export default CoboDepositStatus
