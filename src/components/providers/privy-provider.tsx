import { PRIVY_APP_ID, PRIVY_CLIENT_ID } from '@/constants/config'
import { PrivyProvider as PrivyProviderComp } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { createContext, useContext } from 'react'
import { useCoboAddressPreload } from '@/hooks/useCoboAddressPreload'

interface IProps {
  children: JSX.Element
}

type ProviderType = {}

const Context = createContext<ProviderType>({} as ProviderType)

/**
 * Cobo 地址预加载包装组件
 * 在用户登录后自动预加载所有链的充值地址
 */
const CoboPreloadWrapper = ({ children }: IProps) => {
  // 自动预加载 Cobo 充值地址
  useCoboAddressPreload()
  
  return <>{children}</>
}

// https://demo.privy.io
export const PrivyProvider = ({ children }: IProps) => {
  const exposed = {}

  return (
    <Context.Provider value={exposed}>
      <PrivyProviderComp
        appId={PRIVY_APP_ID}
        clientId={PRIVY_CLIENT_ID}
        config={{
          appearance: {
            logo: '/platform/mullet-logo.png',
            showWalletLoginFirst: false,
            walletChainType: 'solana-only',
            landingHeader: '',
            walletList: [
              // 浏览器自动检测
              'detected_solana_wallets',
              // 按顺序展示 将会覆盖浏览器自动检测的
              'phantom',
              'backpack',
              'okx_wallet',
              'solflare'
            ]
          },
          // solanaClusters: [{ name: 'mainnet-beta', rpcUrl: PRIVY_SOLANA_RPC }],
          // loginMethods: ["wallet", "email"],
          externalWallets: {
            solana: {
              connectors: toSolanaWalletConnectors({ shouldAutoConnect: true })
            }
          },
          embeddedWallets: {
            solana: {
              createOnLogin: 'users-without-wallets'
            },
            ethereum: {
              createOnLogin: 'users-without-wallets'  // 🔥 改为自动创建
            }
          }
        }}
      >
        <CoboPreloadWrapper>
          {children}
        </CoboPreloadWrapper>
      </PrivyProviderComp>
    </Context.Provider>
  )
}

export const usePrivy = () => useContext(Context)
