import { CounterCard } from './components/counter/CounterCard'
import { SolanaProvider } from './components/counter/provider/Solana'
import { Toaster } from './components/ui/sonner'

// pda + 种子形式 连接钱包 使用程序 + 种子 生成地址 不是通过用户钱包控制程序的计数器状态
export default function CounterConnectWalletIdlPdaSeed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          Solana Counter App
        </h1>
        <p className="text-gray-400">A minimal dApp built with Anchor & Next.js</p>
      </div>

      <div className="relative z-10">
        <SolanaProvider>
          <CounterCard />
          <Toaster
            position="bottom-right"
            theme="dark"
            closeButton
            richColors={false}
            toastOptions={{
              style: {
                background: '#171717',
                color: 'white',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              },
              className: 'toast-container'
            }}
          />
        </SolanaProvider>
      </div>

      <footer className="mt-20 text-center text-sm text-gray-500 relative z-10">
        <p>Powered by Anchor, Web3.js, and Shadcn UI</p>
        <p className="mt-2">Created as a minimal Solana dApp example</p>
      </footer>
    </div>
  )
}
