import React from 'react'
import { Modal, Button, Space, Typography } from 'antd'
import { SwapOutlined, SendOutlined, CreditCardOutlined } from '@ant-design/icons'
import './AddFundsMenu.less'

const { Title, Text } = Typography

interface AddFundsMenuProps {
  open: boolean
  onClose: () => void
  onTransferClick: () => void
  onSwapClick: () => void
  onCardClick: () => void
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
  onCardClick
}) => {
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
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              跨链转账
            </div>
            <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>
              支持从 TRON / Ethereum 跨链充值
            </div>
          </div>
          <SendOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
        </Button>

        {/* 资产兑换选项 */}
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
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <SwapOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              资产兑换
            </div>
            <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>
              将持有的资产兑换成 USDC
            </div>
          </div>
          <SwapOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
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
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              信用卡购买
            </div>
            <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>
              使用信用卡快速购买加密货币
            </div>
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
