import Button from '@/components/Base/Button'
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
  sendAndConfirmTransaction
} from '@solana/web3.js'

// 生成新密钥对 用于测试 可以代替连接钱包
const keypair = Keypair.generate()
console.log('New wallet public key:', keypair.publicKey.toString())

export default function SolDemo() {
  // Create a connection to cluster
  const connection = new Connection('http://localhost:8899', 'confirmed')

  // 空投
  const onAirdrop = async () => {
    try {
      // 连接到 devnet
      console.log('Connected to devnet')

      // 请求空投
      console.log('Requesting airdrop...')
      const signature = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL)

      // 等待交易确认
      console.log('Airdrop signature:', signature)
      await connection.confirmTransaction(signature, 'confirmed')
      console.log('Airdrop confirmed!')

      // 查询账户信息
      const accountInfo = await connection.getAccountInfo(keypair.publicKey)
      console.log('Account info:', accountInfo)

      if (accountInfo) {
        console.log('Balance:', accountInfo.lamports / LAMPORTS_PER_SOL, 'SOL')
      } else {
        console.log('Account not found')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // 转账
  const onTransfer = async () => {
    // Generate sender and recipient keypairs
    const sender = Keypair.generate()
    const recipient = new Keypair()

    // Fund sender with airdrop
    const airdropSignature = await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL)
    await connection.confirmTransaction(airdropSignature, 'confirmed')

    // Check balance before transfer
    const preBalance1 = await connection.getBalance(sender.publicKey)
    const preBalance2 = await connection.getBalance(recipient.publicKey)

    // Define the amount to transfer
    const transferAmount = 0.01 // 0.01 SOL

    // Create a transfer instruction for transferring SOL from sender to recipient
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient.publicKey,
      lamports: transferAmount * LAMPORTS_PER_SOL // Convert transferAmount to lamports
    })

    // Add the transfer instruction to a new transaction
    const transaction = new Transaction().add(transferInstruction)

    // Send the transaction to the network
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [sender] // signer
    )

    // Check balance after transfer
    const postBalance1 = await connection.getBalance(sender.publicKey)
    const postBalance2 = await connection.getBalance(recipient.publicKey)

    console.log('Sender prebalance:', preBalance1 / LAMPORTS_PER_SOL)
    console.log('Recipient prebalance:', preBalance2 / LAMPORTS_PER_SOL)
    console.log('Sender postbalance:', postBalance1 / LAMPORTS_PER_SOL)
    console.log('Recipient postbalance:', postBalance2 / LAMPORTS_PER_SOL)
    console.log('Transaction Signature:', transactionSignature)
    console.log('transferInstruction:', transferInstruction)
  }

  // 获取账户信息
  const onGetAccountInfo = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const publicKey = new PublicKey('vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg')
    const accountInfo = await connection.getAccountInfo(publicKey)

    console.log('Account Info:', JSON.stringify(accountInfo, null, 2))
  }

  // 获取余额 https://solana.com/zh/docs/rpc/http/getbalance
  const onGetBalance = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const publicKey = new PublicKey('83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri')
    const balance = await connection.getBalance(publicKey)

    // balance / LAMPORTS_PER_SOL
    console.log('Account Balance:', JSON.stringify(balance, null, 2))
  }

  // 获取区块高度 https://solana.com/zh/docs/rpc/http/getblockheight
  const onGetBlockHeight = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    let blockHeight = await connection.getBlockHeight()
    console.log('block height:', blockHeight)
  }

  // 获取测试SOL
  const onGetTestSOL = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    const wallet = Keypair.generate()

    const signature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL)

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    })
    const balance = await connection.getBalance(wallet.publicKey)
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`)
  }

  // ws Subscribing to Events
  // 监听账户余额变化
  // Websockets 提供了一个可以监听特定事件的接口。您可以在事件发生时才接收这些更新，而不是每隔一段时间就 ping 一次 HTTP 端点，以获得频繁的更新。
  const onWsSubscribingToEvents = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    const wallet = Keypair.generate()

    const subscriptionId = connection.onAccountChange(
      wallet.publicKey,
      (accountInfo, context) => {
        console.log('Context:', context)
        console.log('AccountInfo:', accountInfo)
      },
      { commitment: 'confirmed' }
    )

    const signature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL)

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    })

    // await connection.removeAccountChangeListener(subscriptionId);
  }

  // 计算交易成本
  // 每次交易都会消耗计算单位，并且需要在摩门滑艇中支付交易费用才能执行。交易中包含的签名数量决定了基本交易费（每个签名5000个LAMPORTS）
  const onCalculateTransactionCost = async () => {
    // Connect to Solana network
    const connection = new Connection('http://localhost:8899', 'confirmed')

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    // Create keypairs for transaction
    const sender = Keypair.generate()
    const recipient = Keypair.generate()
    console.log(`Created sender account: ${sender.publicKey.toString()}`)
    console.log(`Created recipient account: ${recipient.publicKey.toString()}`)

    // Request and confirm airdrop
    const airdropSignature = await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL)

    await connection.confirmTransaction({
      signature: airdropSignature,
      blockhash,
      lastValidBlockHeight
    })

    // Create a transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient.publicKey,
      lamports: 1000000 // 0.001 SOL
    })

    // Create simulation instructions with placeholder compute unit limit
    const simulationInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_400_000 // High value for simulation
      }),
      ComputeBudgetProgram.setComputeUnitPrice({
        // @ts-ignore
        microLamports: 1n
      }),
      transferInstruction
    ]

    // Create transaction for simulation
    const simulationTransaction = new VersionedTransaction(
      new TransactionMessage({
        instructions: simulationInstructions,
        payerKey: sender.publicKey,
        recentBlockhash: blockhash
      }).compileToV0Message()
    )

    // Simulate transaction to get compute unit estimate
    const simulationResponse = await connection.simulateTransaction(simulationTransaction)

    const estimatedUnits = simulationResponse.value.unitsConsumed
    console.log(`Estimated compute units: ${estimatedUnits}`)

    // Create final transaction with compute budget instructions
    const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
      units: estimatedUnits!
    })

    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
      // @ts-ignore
      microLamports: 1n
    })

    // Build transaction with all instructions
    const messageV0 = new TransactionMessage({
      payerKey: sender.publicKey,
      recentBlockhash: blockhash,
      instructions: [computeUnitPriceInstruction, computeUnitLimitInstruction, transferInstruction]
    }).compileToV0Message()

    // Calculate fee
    const fees = await connection.getFeeForMessage(messageV0)
    console.log(`Transaction fee: ${fees.value} lamports`)

    const transaction = new VersionedTransaction(messageV0)
    transaction.sign([sender])

    // Send and confirm transaction
    const signature = await connection.sendTransaction(transaction)
    console.log(`Transaction Signature: ${signature}`)
  }

  return (
    <div className="flex flex-col mx-10 gap-2 items-center justify-center h-screen">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-2xl font-bold">Solana Demo</h1>
      </div>
      <Button onClick={onAirdrop}>空投</Button>
      <Button onClick={onTransfer}>转账</Button>
      <Button onClick={onGetAccountInfo}>getAccountInfo</Button>
      <Button onClick={onGetBalance}>getBalance</Button>
      <Button onClick={onGetBlockHeight}>getBlockHeight</Button>
      <Button onClick={onGetTestSOL}>空投-获取测试SOL</Button>
      <Button onClick={onWsSubscribingToEvents}>ws Subscribing to Events</Button>
      <Button onClick={onCalculateTransactionCost}>计算交易成本</Button>
    </div>
  )
}
