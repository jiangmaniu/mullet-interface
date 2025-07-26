'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={'cmca93bzn02d1jr0nik736ppe'}
      config={{
        appearance: {
          showWalletLoginFirst: true,
          walletChainType: 'solana-only'
        },
        loginMethods: ['wallet', 'email'],
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors()
          }
        },
        embeddedWallets: {
          createOnLogin: 'all-users'
        }
      }}
    >
      {children}
    </PrivyProvider>
  )
}
