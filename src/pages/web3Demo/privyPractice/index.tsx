import Button from '@/components/Base/Button'
import { type SolanaTransactionReceipt, type SupportedSolanaTransaction, useLogin, usePrivy, useSolanaWallets } from '@privy-io/react-auth'
import { useSendTransaction, useSignMessage, useSignTransaction } from '@privy-io/react-auth/solana'
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { FileSignature, MessageSquare, Send, Wallet } from 'lucide-react'
import { useState } from 'react'
import { ActionButton } from './components/actionButton'
import { SendTransactionModal } from './components/modals/sendTransactionModal'
import { SignMessageModal } from './components/modals/signMessageModal'
import { SignTransactionModal } from './components/modals/signTransactionModal'
import { Badge } from './components/ui/badge'
import { WalletCard } from './components/walletCard'

interface WalletAccount {
  address: string
  chainType: string
  walletClientType: string
  connectorType: string
  walletIndex?: number
}

const PrivyPractice = () => {
  const [selectedWallet, setSelectedWallet] = useState<WalletAccount | null>(null)
  const [signMessageModalOpen, setSignMessageModalOpen] = useState(false)
  const [signTransactionModalOpen, setSignTransactionModalOpen] = useState(false)
  const [sendTransactionModalOpen, setSendTransactionModalOpen] = useState(false)
  const { user: userData, logout, ready, authenticated } = usePrivy()
  const { login } = useLogin()
  const { createWallet, wallets } = useSolanaWallets()
  const { signMessage } = useSignMessage()
  const { signTransaction } = useSignTransaction()
  const { sendTransaction } = useSendTransaction()

  const handleSignMessage = async (wallet: WalletAccount, message: string) => {
    console.log(`Signing message "${message}" with wallet:`, wallet.address)
    const encodedMessage = new TextEncoder().encode(message)

    let result: Uint8Array
    // 找到钱包的实例
    const foundWallet = wallets.find((v) => v.address === wallet.address)

    // 如果钱包是是外部钱包，则使用内置的签名方法
    if (foundWallet && foundWallet.connectorType !== 'embedded') {
      result = await foundWallet.signMessage(encodedMessage)
      return console.log('Message signed:', result)
    }

    // 如果钱包是内置钱包
    result = await signMessage({
      message: encodedMessage,
      options: { address: wallet.address }
    })
    console.log('Message signed:', result)
  }

  const handleSignTransaction = async (wallet: WalletAccount, to: string) => {
    console.log(`Signing transaction to "${to}" with wallet:`, wallet.address)
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string)
    const LAMPORTS_PER_SOL = 1_000_000_000 // 1 SOL = 1 billion lamports

    // Implement actual signing logic here
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(wallet.address),
      toPubkey: new PublicKey(to),
      lamports: 0.1 * LAMPORTS_PER_SOL // Send 0.1 SOL for example
    })

    // Create transaction
    const transaction = new Transaction().add(transferInstruction)

    // Get recent blockhash and set fee payer
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = new PublicKey(wallet.address)

    let signedTransaction: Transaction | SupportedSolanaTransaction
    const foundWallet = wallets.find((v) => v.address === wallet.address)

    // 如果钱包是是外部钱包，则使用内置的签名方法
    if (foundWallet && foundWallet.connectorType !== 'embedded') {
      signedTransaction = await foundWallet.signTransaction(transaction)
      return console.log('Transaction signed:', signedTransaction)
    }

    // Sign the transaction 如果钱包是内置钱包
    signedTransaction = await signTransaction({
      transaction,
      address: wallet.address,
      connection: connection
    })
    console.log('Transaction signed:', signedTransaction)
  }

  const handleSendTransaction = async (wallet: WalletAccount, toAddress: string, amount: string) => {
    console.log(`Sending ${amount} SOL to ${toAddress} from wallet:`, wallet.address)
    // Implement actual transaction logic here
    const connection = new Connection('https://api.devnet.solana.com')
    const payer = new PublicKey(wallet?.address)

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(toAddress),
      lamports: parseFloat(amount) * LAMPORTS_PER_SOL
    })

    const transaction = new Transaction().add(transferInstruction)
    // 设置区块哈希（可选）
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer

    let result: string | SolanaTransactionReceipt
    // 获取钱包的实例
    const foundWallet = wallets.find((v) => v.address === wallet.address)

    // 如果钱包是是外部钱包，则使用内置的签名方法
    if (foundWallet && foundWallet.connectorType !== 'embedded') {
      result = await foundWallet.sendTransaction(transaction, connection)
      console.log('外部钱包交易成功！交易哈希:', result)
      console.log(`https://explorer.solana.com/tx/${result}?cluster=devnet`)
      return
    }

    console.log('wallet', wallet)

    // 如果钱包是内置钱包，则使用自定义的签名方法
    result = await sendTransaction({
      transaction,
      connection,
      address: wallet.address
    })
    console.log('嵌入钱包交易成功1！交易哈希:', result.signature)
    console.log(`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`)
  }

  const handleCreateEmbeddedWallet = async () => {
    console.log('Creating new embedded wallet...')
    await createWallet({ createAdditional: true })
  }

  const getWalletDisplayName = (account: any) => {
    if (account?.walletClientType === 'privy') {
      return `Privy ${account.chainType === 'ethereum' ? 'ETH' : 'SOL'} ${
        account.walletIndex !== undefined ? `#${account.walletIndex + 1}` : ''
      }`
    }
    return account?.walletClientType
  }

  const handleWalletSelect = (wallet: WalletAccount, modalType: string) => {
    setSelectedWallet(wallet)
    switch (modalType) {
      case 'signMessage':
        setSignMessageModalOpen(true)
        break
      case 'signTransaction':
        setSignTransactionModalOpen(true)
        break
      case 'sendTransaction':
        setSendTransactionModalOpen(true)
        break
    }
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg font-[family-name:var(--font-geist-mono)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white font-[family-name:var(--font-geist-mono)]">
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-2 flex justify-between">
          <div className="">
            <h1 className="text-3xl font-bold text-white">Wallet Dashboard</h1>
            <p className="text-gray-400">Manage your wallets and transactions</p>
          </div>
          {authenticated ? <Button onClick={logout}>退出登录</Button> : <Button onClick={login}>登录</Button>}
        </div>

        {/* Active Wallet Card */}
        <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Wallet className="h-6 w-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold text-white">Active Wallet</h2>
                <p className="text-gray-400">Currently selected wallet for transactions</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{getWalletDisplayName(userData?.wallet)}</p>
                <p className="text-sm text-gray-400">{userData?.wallet?.address}</p>
              </div>
              <Badge>{userData?.wallet?.chainType.toUpperCase()}</Badge>
            </div>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Linked Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData?.linkedAccounts.map((account, index) => (
              <WalletCard
                key={`${account.type}-${index}`}
                account={account as WalletAccount}
                isActive={
                  // @ts-expect-error - address isn't in all accounts
                  account.address
                    ? // @ts-expect-error - address isn't in all accounts
                      account.address === userData?.wallet?.address
                    : false
                }
              />
            ))}
            <WalletCard account={{} as WalletAccount} isCreateNew={true} onCreateNew={handleCreateEmbeddedWallet} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <ActionButton
              icon={<MessageSquare className="h-4 w-4" />}
              label="Sign Message"
              wallets={userData?.linkedAccounts as WalletAccount[]}
              onWalletSelect={(wallet) => handleWalletSelect(wallet, 'signMessage')}
            />
            <ActionButton
              icon={<FileSignature className="h-4 w-4" />}
              label="Sign Transaction"
              wallets={userData?.linkedAccounts as WalletAccount[]}
              onWalletSelect={(wallet) => handleWalletSelect(wallet, 'signTransaction')}
            />
            <ActionButton
              icon={<Send className="h-4 w-4" />}
              label="Send Transaction"
              wallets={userData?.linkedAccounts as WalletAccount[]}
              onWalletSelect={(wallet) => handleWalletSelect(wallet, 'sendTransaction')}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SignMessageModal
        isOpen={signMessageModalOpen}
        onClose={() => setSignMessageModalOpen(false)}
        selectedWallet={selectedWallet}
        onSign={handleSignMessage}
      />
      <SignTransactionModal
        isOpen={signTransactionModalOpen}
        onClose={() => setSignTransactionModalOpen(false)}
        selectedWallet={selectedWallet}
        onSign={handleSignTransaction}
      />
      <SendTransactionModal
        isOpen={sendTransactionModalOpen}
        onClose={() => setSendTransactionModalOpen(false)}
        selectedWallet={selectedWallet}
        onSend={handleSendTransaction}
      />
    </div>
  )
}

export default PrivyPractice
