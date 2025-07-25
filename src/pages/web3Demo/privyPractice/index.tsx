import { useSolanaWallets } from '@privy-io/react-auth/solana'

const PrivyPractice = () => {
  const { wallets } = useSolanaWallets()

  return <div className="flex flex-col mx-10 gap-2 items-center justify-center h-screen">test</div>
}

export default PrivyPractice
