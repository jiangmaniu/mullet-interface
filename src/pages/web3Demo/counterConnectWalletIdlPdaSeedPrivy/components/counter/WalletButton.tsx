'use client'

import { useLogin, usePrivy } from '@privy-io/react-auth'

import Button from '@/components/Base/Button'
import useConnection from '@/hooks/web3/useConnection'

export function WalletButton() {
  const { login } = useLogin()
  const { connected } = useConnection()
  const { logout } = usePrivy()

  return (
    <div className="inline-block text-white">
      devnet:{' '}
      {connected ? (
        <Button type="primary" danger onClick={logout}>
          DisConnect
        </Button>
      ) : (
        <Button type="primary" onClick={login}>
          Connect
        </Button>
      )}
    </div>
  )
}
