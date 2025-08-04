import Button from '@/components/Base/Button'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import bs58 from 'bs58'
import { ClusterProvider } from '../context/clusterProvider'
import AccountDetailFeature from './components/account/account-detail-feature'
import { AppLayout } from './components/app/app-layout'
import CounterFeature from './components/counter/counter-feature'
import { SolanaProvider } from './solana/solana-provider'
const links: { label: string; path: string }[] = []

// 不是pda种子形式 的counter 使用钱包去控制counter的计数器状态
export default function CounterConnectWalletIdlNotPdaSeed() {
  return (
    <ClusterProvider>
      <SolanaProvider>
        <AppLayout links={links}>
          <AccountDetailFeature />
          <CounterFeature />
          <div className="mt-10 gap-x-4 flex">
            <SignMessageExample />
            <SignTransactionExample />
            <SendTransactionExample />
          </div>
        </AppLayout>
      </SolanaProvider>
    </ClusterProvider>
  )
}

// 钱包的signMessage方法示例
function SignMessageExample() {
  const { publicKey, signMessage } = useWallet()

  const handleSign = async () => {
    if (!publicKey || !signMessage) return

    // 1. 准备消息（必须是 Uint8Array）
    const message = new TextEncoder().encode('Hello, Solana!')

    // 2. 让钱包签名
    const signatureUint8Array = await signMessage(message)
    const signature = bs58.encode(signatureUint8Array)
    console.log('签名结果:', signature)
  }

  return <Button onClick={handleSign}>钱包的signMessage方法示例</Button>
}

// 钱包的signTransaction方法示例
function SignTransactionExample() {
  const { connection } = useConnection()
  const { publicKey, signTransaction, sendTransaction } = useWallet()

  const handleSign = async () => {
    if (!publicKey || !signTransaction) return

    // 1. 构建交易
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('GiBonFS5x2t8WrwsguHiSUUpQZ9EdJvzPD2i1VfUbuMR'),
        lamports: 0.2 * LAMPORTS_PER_SOL // 1 SOL = 10^9 lamports
      })
    )

    // 2. 设置区块哈希（可选）
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = publicKey

    // 3. 让钱包签名
    const signedTx = await signTransaction(transaction)
    console.log('签名后的交易:', signedTx)

    // 4. 发送交易（可选） 调用底层方法sendRawTransaction
    const signature = await connection.sendRawTransaction(signedTx.serialize())
    console.log('交易哈希:', signature)
  }

  return <Button onClick={handleSign}>钱包的signTransaction签名交易并发送</Button>
}

// 钱包的sendTransaction方法示例
function SendTransactionExample() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleSend = async () => {
    if (!publicKey || !sendTransaction) return

    // 1. 构建交易
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('GiBonFS5x2t8WrwsguHiSUUpQZ9EdJvzPD2i1VfUbuMR'),
        lamports: 0.2 * LAMPORTS_PER_SOL // 1 SOL = 10^9 lamports
      })
    )

    // 2. 设置区块哈希（可选）
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = publicKey

    // 3. 让钱包签名
    const signature = await sendTransaction(transaction, connection)
    await connection.confirmTransaction(signature, 'confirmed')
    console.log('交易成功！交易哈希:', signature)
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=custom`)
  }

  return <Button onClick={handleSend}>钱包的sendTransaction方法示例</Button>
}
