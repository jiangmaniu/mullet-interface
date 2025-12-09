import { useState, useEffect } from 'react'
import { Modal, Card, Typography, Divider, Button, Space } from 'antd'
import { CloseOutlined, ArrowLeftOutlined, ThunderboltOutlined, CreditCardOutlined } from '@ant-design/icons'
import { useFundWallet as useEvmFundWallet } from '@privy-io/react-auth'
import { useFundWallet as useSolanaFundWallet } from '@privy-io/react-auth/solana'

const { Title, Text } = Typography

// Token icons (需要配置实际的图标路径)
const TOKEN_ICONS = {
  TRX: '/img/coins/tron.png',
  ETH: '/img/coins/ethereum.png',
  SOL: '/img/coins/solana.png',
  USDT: '/img/coins/usdt.png',
  USDC: '/img/coins/usdc.png'
}

export interface AssetBalance {
  symbol: string
  balance: number
  usdValue: number
  icon: string
  network: string
}

interface WalletTopUpProps {
  open: boolean
  onClose: () => void
  usdcBalance: number
  totalBalance: number
  walletAddress: string
  network?: string
  assets?: AssetBalance[]
  walletSource?: string
  onSwapClick?: (asset?: AssetBalance) => void
  onTransferClick?: () => void
}

type ViewState = 'method' | 'swap_select'

const WalletTopUp: React.FC<WalletTopUpProps> = ({
  open,
  onClose,
  usdcBalance,
  totalBalance,
  walletAddress,
  network = 'Ethereum',
  assets = [],
  walletSource,
  onSwapClick,
  onTransferClick
}) => {
  const { fundWallet: fundEvmWallet } = useEvmFundWallet()
  const { fundWallet: fundSolanaWallet } = useSolanaFundWallet()

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [view, setView] = useState<ViewState>('method')
  const [selectedAsset, setSelectedAsset] = useState<AssetBalance | null>(null)

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedMethod(null)
      setView('method')
      setSelectedAsset(null)
    }
  }, [open])

  const handleMethodClick = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleContinue = () => {
    if (selectedMethod === 'swap') {
      setView('swap_select')
    } else if (selectedMethod === 'transfer') {
      onClose()
      onTransferClick?.()
    } else if (selectedMethod === 'card') {
      onClose()
      // Detect wallet type and call appropriate fundWallet
      const isSolanaAddress = walletAddress.length === 44 && !walletAddress.startsWith('0x')

      if (isSolanaAddress) {
        fundSolanaWallet(walletAddress)
      } else {
        fundEvmWallet(walletAddress)
      }
    }
  }

  const handleAssetSelect = (asset: AssetBalance) => {
    setSelectedAsset(asset)
  }

  const handleSwapContinue = () => {
    if (selectedAsset) {
      onSwapClick?.(selectedAsset)
      onClose()
    }
  }

  const handleBack = () => {
    if (view === 'swap_select') {
      setView('method')
      setSelectedAsset(null)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={480}
      footer={null}
      closeIcon={<CloseOutlined />}
      styles={{
        body: { padding: '24px' }
      }}
      title={
        <div className="flex items-center gap-2">
          {view === 'swap_select' && <ArrowLeftOutlined onClick={handleBack} className="cursor-pointer text-gray-400 hover:text-white" />}
          <div>
            <Title level={5} style={{ margin: 0 }}>
              充值钱包
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              余额: ${usdcBalance.toFixed(2)}
            </Text>
          </div>
        </div>
      }
    >
      {view === 'method' ? (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Swap Option */}
          <Card
            hoverable
            onClick={() => handleMethodClick('swap')}
            style={{
              border: selectedMethod === 'swap' ? '2px solid #FF6B35' : '2px solid transparent',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#FF6B35',
                  overflow: 'hidden'
                }}
              >
                <img src="/mullet-logo.png" alt="Mullet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <Text strong style={{ color: 'white' }}>
                  兑换成 USDC
                </Text>
                <br />
                <Text type="secondary">${totalBalance.toFixed(2)} • 即时到账</Text>
              </div>
            </div>
          </Card>

          <Divider>
            <Text type="secondary">更多选项</Text>
          </Divider>

          {/* Transfer Option */}
          <Card
            hoverable
            onClick={() => handleMethodClick('transfer')}
            style={{
              border: selectedMethod === 'transfer' ? '2px solid #FF6B35' : '2px solid transparent',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ThunderboltOutlined style={{ fontSize: 32, color: 'white' }} />
                <div>
                  <Text strong style={{ color: 'white' }}>
                    跨链转账
                  </Text>
                  <br />
                  <Text type="secondary">无限制 • 即时到账</Text>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <img src={TOKEN_ICONS.TRX} alt="TRON" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                <img src={TOKEN_ICONS.ETH} alt="Ethereum" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                <img src={TOKEN_ICONS.SOL} alt="Solana" style={{ width: 20, height: 20, borderRadius: '50%' }} />
              </div>
            </div>
          </Card>

          {/* Card Payment Option */}
          <Card
            hoverable
            onClick={() => handleMethodClick('card')}
            style={{
              border: selectedMethod === 'card' ? '2px solid #FF6B35' : '2px solid transparent',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}
          >
            <div className="flex items-center gap-4">
              <CreditCardOutlined style={{ fontSize: 32, color: 'white' }} />
              <div>
                <Text strong style={{ color: 'white' }}>
                  信用卡/借记卡
                </Text>
                <br />
                <Text type="secondary">最低 $10 • 1-3 分钟</Text>
              </div>
            </div>
          </Card>

          <Button
            type="primary"
            size="large"
            block
            disabled={!selectedMethod}
            onClick={handleContinue}
            style={{ marginTop: '16px', height: '48px' }}
          >
            继续
          </Button>
        </Space>
      ) : (
        // Swap asset selection view
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>选择要兑换的资产：</Text>
          {assets.map((asset) => (
            <Card
              key={asset.symbol}
              hoverable
              onClick={() => handleAssetSelect(asset)}
              style={{
                border: selectedAsset?.symbol === asset.symbol ? '2px solid #FF6B35' : '2px solid transparent',
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={asset.icon} alt={asset.symbol} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <div>
                    <Text strong style={{ color: 'white' }}>
                      {asset.symbol}
                    </Text>
                    <br />
                    <Text type="secondary">{asset.network}</Text>
                  </div>
                </div>
                <div className="text-right">
                  <Text strong style={{ color: 'white' }}>
                    {asset.balance.toFixed(2)}
                  </Text>
                  <br />
                  <Text type="secondary">${asset.usdValue.toFixed(2)}</Text>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="primary"
            size="large"
            block
            disabled={!selectedAsset}
            onClick={handleSwapContinue}
            style={{ marginTop: '16px', height: '48px' }}
          >
            兑换成 USDC
          </Button>
        </Space>
      )}
    </Modal>
  )
}

export default WalletTopUp
