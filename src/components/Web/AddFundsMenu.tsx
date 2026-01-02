import React from 'react'
import { Modal, Button, Space, Typography } from 'antd'
import { SwapOutlined, SendOutlined, CreditCardOutlined } from '@ant-design/icons'
import './AddFundsMenu.less'

const { Title, Text } = Typography

// 钱包 Logo - 使用本地图片
const WALLET_LOGOS: Record<string, string> = {
  // 主流钱包
  okx: '/img/wallets/okx.png',
  phantom: '/img/wallets/phantom.png',
  metamask: '/img/wallets/metamask.png',
  solflare: '/img/wallets/solflare.png',
  coinbase: '/img/wallets/coinbase.png',
  trust: '/img/wallets/trust.png',
  binance: '/img/wallets/binance.png',
  // 大陆用户常用
  bitget: '/img/wallets/bitget.png',
  coin98: '/img/wallets/coin98.png',
  tokenpocket: '/img/wallets/tokenpocket.png',
  bybit: '/img/wallets/bybit.png',
  gate: '/img/wallets/gate.png',
  safepal: '/img/wallets/safepal.png',
  backpack: '/img/wallets/backpack.png'
}

// 钱包显示名称映射
const WALLET_NAMES: Record<string, string> = {
  okx: 'OKX Wallet',
  phantom: 'Phantom',
  metamask: 'MetaMask',
  solflare: 'Solflare',
  coinbase: 'Coinbase Wallet',
  trust: 'Trust Wallet',
  binance: 'Binance Wallet',
  bitget: 'Bitget Wallet',
  coin98: 'Coin98 Wallet',
  tokenpocket: 'TokenPocket',
  bybit: 'Bybit Wallet',
  gate: 'Gate Wallet',
  safepal: 'SafePal',
  backpack: 'Backpack'
}

// 标准化钱包类型 - 通过关键字匹配
const normalizeWalletType = (walletType?: string): string => {
  if (!walletType) return ''
  const lower = walletType.toLowerCase()

  // 关键字匹配优先级
  if (lower.includes('okx')) return 'okx'
  if (lower.includes('phantom')) return 'phantom'
  if (lower.includes('metamask')) return 'metamask'
  if (lower.includes('solflare')) return 'solflare'
  if (lower.includes('coinbase')) return 'coinbase'
  if (lower.includes('trust')) return 'trust'
  if (lower.includes('binance')) return 'binance'
  if (lower.includes('imtoken')) return 'imtoken'
  if (lower.includes('math')) return 'math'
  if (lower.includes('bitget')) return 'bitget'
  if (lower.includes('coin98')) return 'coin98'
  if (lower.includes('tokenpocket') || lower.includes('token_pocket')) return 'tokenpocket'
  if (lower.includes('bybit')) return 'bybit'
  if (lower.includes('gate')) return 'gate'
  if (lower.includes('safepal')) return 'safepal'
  if (lower.includes('backpack')) return 'backpack'

  return lower
}

// 获取钱包显示名称
const getWalletDisplayName = (walletType?: string): string => {
  if (!walletType) return ''
  const normalized = normalizeWalletType(walletType)
  return WALLET_NAMES[normalized] || walletType
}

interface AddFundsMenuProps {
  open: boolean
  onClose: () => void
  onTransferClick: () => void
  onSwapClick: () => void
  onCardClick: () => void
  showSwapOption?: boolean // 是否显示资产兑换选项（仅外部钱包显示）
  walletType?: string // 钱包类型 (phantom, okx_wallet, etc.)
}

/**
 * Add Funds 菜单选择对话框
 * 提供两个选项：跨链转账 和 资产兑换
 */
const AddFundsMenu: React.FC<AddFundsMenuProps> = ({
  open,
  onClose,
  onTransferClick,
  onSwapClick,
  onCardClick,
  showSwapOption = false, // 默认不显示
  walletType
}) => {
  const normalizedType = normalizeWalletType(walletType)
  const walletLogo = WALLET_LOGOS[normalizedType]

  // Debug: 打印钱包类型
  console.log('[AddFundsMenu] walletType:', walletType, 'normalized:', normalizedType, 'logo:', walletLogo)

  const handleTransferClick = () => {
    onClose()
    onTransferClick()
  }

  const handleSwapClick = () => {
    onClose()
    onSwapClick()
  }

  const handleCardClick = () => {
    onClose()
    onCardClick()
  }

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Add Funds
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Choose how you want to add funds
          </Text>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={460}
      centered
      className="add-funds-menu"
    >
      <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 16 }}>
        {/* 资产兑换选项 - 仅外部钱包显示，放在最上面 */}
        {showSwapOption && (
          <Button
            size="large"
            onClick={handleSwapClick}
            style={{
              width: '100%',
              height: 'auto',
              padding: '20px 24px',
              textAlign: 'left',
              borderRadius: 12,
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: walletLogo ? '#1a1a2e' : 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
              {walletLogo ? (
                <img src={walletLogo} alt={walletType} style={{ width: 32, height: 32, borderRadius: 6 }} />
              ) : (
                <SwapOutlined style={{ fontSize: 24, color: '#fff' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>资产兑换</div>
              <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>
                {walletType ? `使用 ${getWalletDisplayName(walletType)} 兑换成 USDC` : '将持有的资产兑换成 USDC'}
              </div>
            </div>
            <SwapOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
          </Button>
        )}

        {/* more 分割线 */}
        {showSwapOption && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '8px 0'
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#333' }} />
            <span style={{ color: '#666', fontSize: 13 }}>more</span>
            <div style={{ flex: 1, height: 1, background: '#333' }} />
          </div>
        )}

        {/* 跨链转账选项 */}
        <Button
          size="large"
          onClick={handleTransferClick}
          style={{
            width: '100%',
            height: 'auto',
            padding: '20px 24px',
            textAlign: 'left',
            borderRadius: 12,
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <SendOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>跨链转账</div>
            <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>支持从 TRON / Ethereum 跨链充值</div>
          </div>
          <SendOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
        </Button>

        {/* 信用卡购买选项 */}
        <Button
          size="large"
          onClick={handleCardClick}
          style={{
            width: '100%',
            height: 'auto',
            padding: '20px 24px',
            textAlign: 'left',
            borderRadius: 12,
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CreditCardOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>信用卡购买</div>
            <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>使用信用卡快速购买加密货币</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Mastercard Logo */}
            <div
              style={{
                width: 32,
                height: 20,
                borderRadius: 4,
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#EB001B',
                  position: 'absolute',
                  left: 6
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#F79E1B',
                  position: 'absolute',
                  right: 6,
                  opacity: 0.9
                }}
              />
            </div>
            {/* Visa Logo */}
            <div
              style={{
                padding: '2px 8px',
                borderRadius: 4,
                background: '#1A1F71',
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                minWidth: 32,
                textAlign: 'center'
              }}
            >
              VISA
            </div>
          </div>
        </Button>
      </Space>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          ⓘ 所有跨链操作均由 DeBridge 提供支持
        </Text>
      </div>
    </Modal>
  )
}

export default AddFundsMenu
