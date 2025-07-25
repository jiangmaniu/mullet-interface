import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { WalletName } from '@solana/wallet-adapter-base'
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui'
import { Wallet, useWallet } from '@solana/wallet-adapter-react'
import { WalletIcon } from '@solana/wallet-adapter-react-ui'
import { useState } from 'react'

// 自定义钱包按钮
export function CustomConnectButton() {
  const [open, setOpen] = useState(false)
  const { wallets, select, wallet } = useWallet()
  const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
    onSelectWallet(walletName: WalletName): void
    wallets: Wallet[]
  }> | null>(null)
  const { buttonState, onConnect, onDisconnect, onSelectWallet, walletIcon, walletName, publicKey } = useWalletMultiButton({
    onSelectWallet: setWalletModalConfig
  })
  let label
  switch (buttonState) {
    case 'connected':
      label = 'Disconnect'
      break
    case 'connecting':
      label = 'Connecting'
      break
    case 'disconnecting':
      label = 'Disconnecting'
      break
    case 'has-wallet':
      label = 'Connect'
      break
    case 'no-wallet':
      label = 'Select Wallet'
      break
  }

  const getAddr = () => {
    if (publicKey) {
      const base58 = publicKey.toBase58()
      return base58.slice(0, 4) + '..' + base58.slice(-4)
    }
  }

  console.log('wallets', wallets)

  return (
    <>
      <Button
        disabled={buttonState === 'connecting' || buttonState === 'disconnecting'}
        onClick={() => {
          switch (buttonState) {
            case 'connected':
              onDisconnect?.()
              break
            case 'connecting':
            case 'disconnecting':
              break
            case 'has-wallet':
              onConnect?.()
              break
            case 'no-wallet':
              setOpen(true)
              onSelectWallet?.()
              break
          }
        }}
      >
        <WalletIcon wallet={wallet} className="size-4" /> {label} {getAddr()}
      </Button>
      <Button
        onClick={() => {
          onDisconnect?.()
        }}
      >
        disconnecting
      </Button>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        change-wallet
      </Button>
      {/* @ts-ignore */}
      <Modal open={open} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
        {wallets.map((wallet: any) => (
          <Button
            key={wallet.adapter.name}
            onClick={() => {
              select(wallet.adapter.name)
              setOpen(false)
            }}
          >
            {wallet.adapter.name}
          </Button>
        ))}
      </Modal>
    </>
  )
}
