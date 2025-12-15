import { PRIVY_APP_ID, PRIVY_CLIENT_ID } from '@/constants/config'
import { PrivyProvider as PrivyProviderComp } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { createContext, useContext } from 'react'
import { useCoboAddressPreload } from '@/hooks/useCoboAddressPreload'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'

// Solana RPC 配置
const SOLANA_MAINNET_RPC_URL = 'https://rpc.ankr.com/solana/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
const SOLANA_MAINNET_WS_URL = 'wss://rpc.ankr.com/solana/ws/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
const SOLANA_DEVNET_RPC_URL = 'https://api.devnet.solana.com'
const SOLANA_DEVNET_WS_URL = 'wss://api.devnet.solana.com'

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
              // 主流钱包 - 按顺序展示
              'solflare',
              'okx_wallet',
              'binance_wallet',
              'phantom',
              'metamask',
              // 大陆用户常用
              'imtoken',
              'math_wallet',
              'trust_wallet',
              'bitget_wallet',
              'coin98_wallet',
              'coinbase_wallet',
              'tokenpocket',
              'bybit_wallet',
              'gate_wallet',
              'safepal'
            ]
          },
          // 新版 Solana RPC 配置
          solana: {
            rpcs: {
              'solana:mainnet': {
                rpc: createSolanaRpc(SOLANA_MAINNET_RPC_URL),
                rpcSubscriptions: createSolanaRpcSubscriptions(SOLANA_MAINNET_WS_URL),
                blockExplorerUrl: 'https://explorer.solana.com',
              },
              'solana:devnet': {
                rpc: createSolanaRpc(SOLANA_DEVNET_RPC_URL),
                rpcSubscriptions: createSolanaRpcSubscriptions(SOLANA_DEVNET_WS_URL),
                blockExplorerUrl: 'https://explorer.solana.com/?cluster=devnet',
              },
            },
          },
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
