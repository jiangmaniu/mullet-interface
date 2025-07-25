import Button from '@/components/Base/Button'
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  AddressLookupTableProgram,
  ComputeBudgetProgram,
  Connection,
  GetVersionedBlockConfig,
  Keypair,
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
  sendAndConfirmTransaction
} from '@solana/web3.js'
import bs58 from 'bs58'

const HelloComponent = () => {
  const onTest = async () => {
    // `confirmed` 是默认的确认级别
    // `processed` 是较低的确认级别，意味着查询的数据是经过验证但尚未完全确认的。`confirmed` 表示节点已经将交易写入区块链，但也不一定被最终确认。如果需要更高的确认级别，可以使用 `finalized`。
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    // `PublicKey` 类可创建Solana公钥对象
    const publicKey = new PublicKey('mpa4abUkjQoAvPzREkh5Mo75hZhPFQ2FSH6w7dWKuQ5')
    console.log('publicKey', publicKey)
    // 查询余额
    const balance = await connection.getBalance(publicKey)
    // 输出API URL
    console.log(`API URL: ${clusterApiUrl('devnet')}`)
    // 输出LAMPORTS_PER_SOL
    // `LAMPORTS_PER_SOL` 是Solana的Lamport单位（类似于以太坊中的gwei），1 SOL = 10^9 Lamport。
    console.log(`LAMPORTS PER SOL: ${LAMPORTS_PER_SOL}`)
    // 输出SOL余额
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`)
  }
  return (
    <div>
      <Button onClick={onTest}>Hello Solana</Button>
    </div>
  )
}

// 钱包
const Wallet = () => {
  // 在 Solana 中，每一个钱包都是一个 `Keypair`，由私钥（secretKey）和公钥（publicKey）组成。`@solana/web3.js` 中的 `Keypair` 类提供了创建、导出、导入钱包的能力。

  const onCreateWallet = async () => {
    // 创建一个新的钱包
    const wallet = Keypair.generate()

    console.log('新钱包创建成功！')
    console.log('Public Key:', wallet.publicKey.toBase58())
    console.log('Private Key (base58):', bs58.encode(wallet.secretKey))

    // 新钱包创建成功！
    // Public Key: 9Ujz...WYXh
    // Private Key (base58): 3rcA...Ttzh
  }

  return (
    <div>
      <Button onClick={onCreateWallet}>创建新钱包</Button>
    </div>
  )
}

// 发送交易: SOL转账
const Transfer = () => {
  const onTransfer = async () => {
    // 连接到Solana网络
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 本地私钥签名 不需要连接钱包授权

    // 发送者：创建一个新的钱包
    const sender = Keypair.generate()
    // 接收者
    const receiver = Keypair.generate()

    // 监听余额变化
    // const subscriptionId = connection.onAccountChange(sender.publicKey, (updatedAccountInfo, context) => {
    //   console.log("账户发生变化！");
    //   console.log("最新SOL余额:", updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    //   console.log("上下文信息:", context);
    // });
    // const subscriptionId2 = connection.onAccountChange(receiver.publicKey, (updatedAccountInfo, context) => {
    //   console.log("账户发生变化！1");
    //   console.log("最新SOL余额:1", updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    //   console.log("上下文信息:1", context);
    // });

    // 额外操作：先给发送者的地址空投一点钱，然后转入接受者的地址
    const airdropSignature = await connection.requestAirdrop(
      sender.publicKey,
      10 * LAMPORTS_PER_SOL // 10 SOL
    )
    await connection.confirmTransaction(airdropSignature, 'confirmed')

    // 1. 打印当前发送者余额
    const balance = await connection.getBalance(sender.publicKey)
    console.log(`当前余额: ${balance / LAMPORTS_PER_SOL} SOL`)

    // 2. 构建转账指令（2 SOL）
    const instruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver.publicKey,
      // toPubkey: new PublicKey("9Ujz...WYXh"), // 钱包地址
      lamports: 2 * LAMPORTS_PER_SOL
    })

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    // 1. 基本费：每笔交易都会收取固定的 5000 lamports 作为交易的基本费用（base fee），类似evm的base fee。
    // 2. 优先费：Solana 支持优先费机制（priority fee）：在网络拥堵时，愿意付更高优先费的交易会被更快打包进区块。与evm的priority fee类似。
    // Solana 上的每笔交易都需要一定的计算资源（Compute Units，简称 CU）。为了激励验证者优先处理你的交易，可以使用 `ComputeBudgetProgram` 设置 **CU 单价**，从而增加交易费用，计算公式：
    // 优先费用 = `computeUnitLimit × computeUnitPrice`
    // - `Compute Unit Price`：每计算单元支付的价格，类似于 EVM 的 gas price。以micro lamports计价，1,000,000 micro lamport = 1 lamport。
    // - `Compute Unit Limit`：最大可使用的计算单元，类似于 EVM 的 gas limit。默认 200,000，最大值 1,400,000。

    // 额外操作：设置优先费，加速上链
    // 构造优先费指令
    const cuLimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }) // 默认上限，单位：CU
    const cuPriceIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 10_000 }) // 每 CU 10,000，也就是 0.00001 SOL

    // 3. 创建交易
    const transaction = new Transaction({
      // 可以不传，内部会处理
      blockhash,
      lastValidBlockHeight
    })
      .add(cuLimitIx)
      .add(cuPriceIx)
      .add(instruction)

    // 4. 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [sender])
    console.log('模拟交易结果: ', simulateResult)

    // 5. 发送交易
    console.log('正在发送交易...')
    const signature = await sendAndConfirmTransaction(connection, transaction, [sender])

    console.log('交易成功！交易哈希:', signature)
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=custom`)
  }

  // 代码复杂了很多，但这样可以更好的控制和优化签名和交易的过程
  const onTransfer2 = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 本地私钥签名 不需要连接钱包授权

    // 发送者：创建一个新的钱包
    const sender = Keypair.generate()
    // 接收者
    const receiver = Keypair.generate()

    // 额外操作：先给发送者的地址空投一点钱，然后转入接受者的地址
    const airdropSignature = await connection.requestAirdrop(
      sender.publicKey,
      10 * LAMPORTS_PER_SOL // 10 SOL
    )
    await connection.confirmTransaction(airdropSignature, 'confirmed')

    const instruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver.publicKey,
      // toPubkey: new PublicKey("9Ujz...WYXh"), // 钱包地址
      lamports: 2 * LAMPORTS_PER_SOL
    })

    // 获取 blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    // 创建交易并传入 blockhash
    const transaction = new Transaction({
      // 如果使用 sendAndConfirmTransaction(transaction, signers)，第一个签名者（signers[0]） 会自动被设为 feePayer。
      // 如果手动构造交易（如 new Transaction({ ... })），则必须显式指定feePayer
      // feePayer: sender.publicKey,
      // blockhash,
      // lastValidBlockHeight,
    }).add(instruction)
    transaction.recentBlockhash = blockhash
    // 设置交易手续费扣除签名者
    transaction.feePayer = sender.publicKey

    // =====================
    // 以下两种写法完全等价：
    // new Transaction({ blockhash }); // 构造函数简化写法
    // new Transaction().recentBlockhash = blockhash; // 直接操作属性

    // // 除非需要动态修改交易参数，否则用构造函数更清晰可靠。
    // const tx = new Transaction({
    //   feePayer: sender.publicKey,
    //   blockhash,
    //   lastValidBlockHeight, // 明确设置过期区块高度
    // }).add(instruction);

    // // 仅在需要时用动态：例如从缓存恢复交易或批量修改属性时：
    // const tx = new Transaction().add(instruction);
    // if (useCustomFeePayer) {
    //   tx.feePayer = customPayer; // 动态调整
    // }
    // tx.recentBlockhash = blockhash;
    // =====================

    // 写法1（隐式 feePayer，依赖 sendAndConfirmTransaction）
    // const tx = new Transaction().add(instruction);
    // await sendAndConfirmTransaction(connection, tx, [sender]); // sender 是 signers[0]，自动成为 feePayer

    // // 写法2（显式 feePayer，手动构造交易）
    // const tx = new Transaction({
    //   feePayer: sender.publicKey, // 必须显式指定
    //   blockhash,
    //   lastValidBlockHeight
    // }).add(instruction);

    // sendAndConfirmTransaction 内部会自动调用 transaction.sign(...signers)。
    // 如果使用 sendRawTransaction，则需要手动签名
    // 写法1（自动签名）
    // await sendAndConfirmTransaction(connection, tx, [sender]); // 内部调用 tx.sign(sender)
    // 写法2（手动签名）
    // tx.sign(sender); // 必须显式签名
    // await connection.sendRawTransaction(tx.serialize());

    console.log('正在发送交易...')
    // 发送交易
    transaction.sign(sender) // 签名交易

    // 序列化交易，转换为Buffer类型
    const serializedTransaction = transaction.serialize()

    const signature = await connection.sendRawTransaction(serializedTransaction, {
      skipPreflight: true, // 是否跳过预检查，用于加速
      preflightCommitment: 'confirmed', // 预检查的确认级别
      maxRetries: 0 // 最大重试次数
    }) // 发送交易

    console.log('交易成功！交易哈希:', signature)

    // 等待交易确认
    console.log('等待交易确认...')
    const confirmation = await connection.confirmTransaction(signature, 'confirmed')

    if (confirmation.value.err) {
      console.error('交易失败:', confirmation.value.err)
    } else {
      console.log('交易成功确认！交易签名:', signature)
    }

    // 也可以用这个`onSignature` 来监听交易上链，这个方法速度更快

    console.log('开始监听交易确认...')
    const subscriptionId = connection.onSignature(
      signature,
      (signatureResult, context) => {
        console.log('\n=== 交易确认回调 ===')
        console.log('交易签名:', signature)
        console.log('Slot:', context.slot)

        if (signatureResult.err) {
          console.error('onSignature: 交易失败:', signatureResult.err)
        } else {
          console.log('onSignature: 交易成功确认！')
          console.log('onSignature: 确认结果:', signatureResult)
        }

        // 取消订阅
        connection.removeSignatureListener(subscriptionId)
        console.log('onSignature: 已取消交易确认监听')
      },
      'confirmed' // 确认级别
    )

    console.log('监听器已注册，订阅ID:', subscriptionId)
  }
  return (
    <div>
      <Button onClick={onTransfer}>发送交易方式1</Button>
      <Button onClick={onTransfer2}>发送交易方式2</Button>
    </div>
  )
}

// 账户
const Account = () => {
  // 在 Solana 中，一切（钱包、状态、程序）都是账户。您可以将 Solana 上的数据视为一个公共数据库，其中包含一个“帐户”表，该表中的每个条目都是一个“帐户”
  // 每个账户都拥有以下字段：

  // 1. `lamports`: 当前账户余额，以lamports为单位（1 SOL = 10⁹ lamports）。
  // 2. `owner`: 帐户所有者的程序ID（Programs ID）。在 Solana 中，智能合约被称为程序（Program），而程序ID就是程序账户的公钥。只有所有者程序可以更改帐户的数据或扣除其 Lamport 余额。
  // 3. `data` 账户的数据区，可以存储账户相关的字节数组。对于不可执行的账户，这通常存储需要读取的状态。对于程序账户，这包含可执行的程序代码。数据字段通常称为“账户数据”。这里与以太坊的账户结构不同，Solana 账户内部没有 `storage`，如果需要存储状态，则需要创建新的账户进行存储。
  // 4. `executable` 是否为可执行程序。
  // 5. `rentEpoch` 租金相关字段，已废弃。

  // 我们可以利用 `connection.getAccountInfo` 方法来读取账户信息。

  const getAccountInfo = async () => {
    // 连接主网
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 获取账户信息
    const pubkey = new PublicKey('GNuoc9aXTakx6e9dbTNy65fxiojAnXgsF6Wc7H6wEuXr')
    const accountInfo = await connection.getAccountInfo(pubkey)
    console.log('获取账户信息', JSON.stringify(accountInfo, null, 2))
    // 由于这是一个钱包账户，因此 `executable = false`，`data` 为空，`owner` 为系统程序
    // {
    //   "data": {
    //     "type": "Buffer",
    //     "data": []
    //   },
    //   "executable": false,
    //   "lamports": 7999995000,
    //   "owner": "11111111111111111111111111111111",
    //   "rentEpoch": 18446744073709552000,
    //   "space": 0
    // }
  }

  const createAccount = async () => {
    // 连接
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 读取已有私钥作为付款账户
    // const secretKeyBase58 = fs.readFileSync("wallet.txt", "utf-8");
    // const payer = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
    const payer = Keypair.generate()

    // 给payer充点钱
    // 额外操作：先给发送者的地址空投一点钱，然后转入接受者的地址
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      100 * LAMPORTS_PER_SOL // 100 SOL
    )
    await connection.confirmTransaction(airdropSignature, 'confirmed')

    // 创建新账户地址
    const newAccount = Keypair.generate()

    // 你可以先用 SystemProgram 作为 owner（表示这个账户没有合约逻辑）
    const programId = SystemProgram.programId

    // 分配 64 字节空间（可自定义）
    const space = 64

    // 获取租金豁免所需 lamports
    const lamports = await connection.getMinimumBalanceForRentExemption(space)
    console.log('需要的租金:', lamports / LAMPORTS_PER_SOL, 'SOL')

    // 创建指令
    const instruction = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports,
      space,
      programId
    })

    const tx = new Transaction().add(instruction)

    // 发送交易
    console.log('🚀 正在创建账户...')
    // newAccount需要签名授权
    const signature = await sendAndConfirmTransaction(connection, tx, [payer, newAccount]) // 传入newAccount Solana 要求新账户必须签名授权初始化,如果只传 payer，系统无法验证 newAccount 是否是被合法控制的，因此需要双重签名

    // 创建账户	[payer, newAccount]	新账户必须签名授权自身被创建，payer 支付费用
    // 普通转账	[payer]	只有资金转出方需要签名
    // 调用智能合约	[payer, 其他签名账户...]	合约可能要求多个账户签名（如多签、授权操作）

    const accountAddress = newAccount.publicKey
    console.log('新账户地址:', accountAddress.toBase58())
    console.log('交易哈希:', signature)
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=custom`)

    const accountInfo = await connection.getAccountInfo(accountAddress)

    if (!accountInfo) {
      console.log('❌ 账户不存在或尚未初始化')
      return
    } else {
      console.log('✅ 账户创建成功')
      console.log(JSON.stringify(accountInfo, null, 2))
    }
  }

  return (
    <div>
      <Button onClick={getAccountInfo}>获取账户信息</Button>
      <Button onClick={createAccount}>创建账户</Button>
    </div>
  )
}

// Slot 与 Block
const Block = () => {
  // 在 Solana 中：
  // - `Slot` 是 Solana 的时间单元，每个验证者大约每 **400 ms** 尝试生成一个区块，因此每个 slot 也以此为间隔周期；
  // - `Block` 是实际产出的区块数据。**每个 slot 最多产生一个 block**，但并非所有 slot 都会产出 block。实际运行中，约有 **6% 的 slot 是空的**（即未产出 block）。
  // 以太坊和Solana的区块机制有很大不同：
  // 以太坊每12秒一个块，并且区块总是被产出。而Solana每400ms一个Slot，每个 Slot 有 0 或 1 个区块 。

  const getLatestBlockhash = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')
    // 1. 获取当前 slot
    const slot = await connection.getSlot()
    console.log('当前 slot:', slot)

    // 2. 获取最新的blockhash和区块高度信息
    const latestBlockhash = await connection.getLatestBlockhash()
    console.log('最新区块hash:', latestBlockhash.blockhash)
    console.log('失效区块高度（当前高度+150）:', latestBlockhash.lastValidBlockHeight)

    // 3. 获取该 Slot 的 Block
    const config: GetVersionedBlockConfig = {
      maxSupportedTransactionVersion: 0,
      rewards: false,
      transactionDetails: 'full'
    }
    const block = await connection.getBlock(slot, config)
    console.log('Block内容:', block)

    // 4. 获取该 slot 的 block 时间（Unix 时间戳）
    const timestamp = await connection.getBlockTime(slot)
    if (timestamp !== null) {
      console.log('区块时间:', new Date(timestamp * 1000).toLocaleString())
    } else {
      console.log('无法获取时间戳（可能是跳过 slot）')
    }
  }

  const getBlockContent = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')
    // 获取该 Slot 的 Block
    const config: GetVersionedBlockConfig = {
      maxSupportedTransactionVersion: 0,
      rewards: false,
      transactionDetails: 'full'
    }
    // 当前 Slot
    const slot = await connection.getSlot()
    console.log('当前 Slot:', slot)
    const block = await connection.getBlock(slot, config)
    console.log('Block内容:', block)
  }

  return (
    <div>
      <Button onClick={getLatestBlockhash}>getLatestBlockhash</Button>
      <Button onClick={getBlockContent}>Block内容</Button>
    </div>
  )
}

// 读取交易
const ReadTx = () => {
  // Solana 的每一笔交易都由签名（tx signature）标识，可以使用 Web3.js 的 `getTransaction()` 方法获取交易详情：

  const onReadTx = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 替换为你想查询的交易哈希
    const txSig = '2AqLz9rbKnxB9j4mKucMtA3mj2deqshV8E4FYUtvUqSfbDyg1aGHJ3REfYmwMUZKdt4kErf8vakk5RTSq2KvS6ev'

    // 读取单笔交易
    const tx = await connection.getTransaction(txSig, {
      maxSupportedTransactionVersion: 0
    })
    console.log(JSON.stringify(tx, null, 2))
    // 其实只包含5个部分：

    // 1. 区块时间 `"blockTime": 1747920090`
    // 2. 插槽编号 `"slot": 341716180,`
    // 3. 版本 `"version": "legacy"`，我们会在之后的教程中介绍交易版本。
    // 4. 元数据 `meta` 包含交易状态、SOL 余额变化、计算单元消耗等元数据。
    // 5. 详情 `transaction` 包括签名、公钥、区块哈希、指令等。
    // {
    //   "blockTime": 1752906358,
    //   "meta": {
    //     "computeUnitsConsumed": 150,
    //     "err": null,
    //     "fee": 5000,
    //     "innerInstructions": [],
    //     "loadedAddresses": {
    //       "readonly": [],
    //       "writable": []
    //     },
    //     "logMessages": [
    //       "Program 11111111111111111111111111111111 invoke [1]",
    //       "Program 11111111111111111111111111111111 success"
    //     ],
    //     "postBalances": [
    //       7999995000,
    //       2000000000,
    //       1
    //     ],
    //     "postTokenBalances": [],
    //     "preBalances": [
    //       10000000000,
    //       0,
    //       1
    //     ],
    //     "preTokenBalances": [],
    //     "rewards": [],
    //     "status": {
    //       "Ok": null
    //     }
    //   },
    //   "slot": 183605,
    //   "transaction": {
    //     "message": {
    //       "header": {
    //         "numReadonlySignedAccounts": 0,
    //         "numReadonlyUnsignedAccounts": 1,
    //         "numRequiredSignatures": 1
    //       },
    //       "accountKeys": [
    //         "ESuxUPc2JXkBghdiLapwrPdP3fGQufDWj7GQckT5M7oX",
    //         "9S4Hh7K5pPxveaJAUjUjSWn1xSAWRcUKn29pn482yMtm",
    //         "11111111111111111111111111111111"
    //       ],
    //       "recentBlockhash": "35gXdyYP3s8cKsPPqfEu6ijT896KsWk3QJ9okXUyU4VS",
    //       "instructions": [
    //         {
    //           "accounts": [
    //             0,
    //             1
    //           ],
    //           "data": "3Bxs3zxH1DZVrsVy",
    //           "programIdIndex": 2,
    //           "stackHeight": null
    //         }
    //       ],
    //       "indexToProgramIds": {}
    //     },
    //     "signatures": [
    //       "2AqLz9rbKnxB9j4mKucMtA3mj2deqshV8E4FYUtvUqSfbDyg1aGHJ3REfYmwMUZKdt4kErf8vakk5RTSq2KvS6ev"
    //     ]
    //   },
    //   "version": "legacy"
    // }

    // 读取单笔交易详情（交易指令解析）
    const parsedTx = await connection.getParsedTransaction(txSig, {
      maxSupportedTransactionVersion: 0
    })
    console.log(JSON.stringify(parsedTx?.transaction?.message?.instructions, null, 2))
    // 它包含消息 `message` 和签名 `signatures` 两个部分
    // [
    //   {
    //     "parsed": {
    //       "info": {
    //         "destination": "9S4Hh7K5pPxveaJAUjUjSWn1xSAWRcUKn29pn482yMtm",
    //         "lamports": 2000000000,
    //         "source": "ESuxUPc2JXkBghdiLapwrPdP3fGQufDWj7GQckT5M7oX"
    //       },
    //       "type": "transfer"
    //     },
    //     "program": "system",
    //     "programId": "11111111111111111111111111111111",
    //     "stackHeight": null
    //   }
    // ]
  }

  return (
    <div>
      <Button onClick={onReadTx}>读取单笔交易详情</Button>
    </div>
  )
}

// 读取区块
const ReadBlock = () => {
  // 读取区块
  const onReadBlock = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 获取最新 slot
    const slot = await connection.getSlot()

    // 获取对应区块
    const block = await connection.getBlock(slot, {
      maxSupportedTransactionVersion: 0
    })

    if (!block || block.transactions.length === 0) {
      console.log('该区块为空')
    } else {
      console.log(`区块 Slot: ${slot}`)
      console.log('交易数:', block?.transactions.length)
      console.log(`区块信息`)
      console.log(JSON.stringify(block, null, 2))
    }

    // 读取并解析交易指令
    const txSig = '5ZvCFaZtLP8N6ZkRE1Lsh5uwFjibXwcknccJywJwvirXNfu9ZFcgxwzTBoQDZSR58BiYFG52RVP25dZ7RdHgzAG8'
    const parsedTx = await connection.getParsedTransaction(txSig, {
      maxSupportedTransactionVersion: 0
    })
    console.log(JSON.stringify(parsedTx?.transaction?.message?.instructions, null, 2))
  }
  return (
    <div>
      <Button onClick={onReadBlock}>读取区块</Button>
    </div>
  )
}

// 订阅
const Subscribe = () => {
  // 1. 监听账户 例如余额变化
  const onSubscribeAccountBlance = () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')
    // 要监听的账户地址（例如 pumpfun 费用地址）
    const pubkey = new PublicKey('62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV')

    // 注册订阅，感受一下什么叫躺着赚钱
    const subscriptionId = connection.onAccountChange(pubkey, (updatedAccountInfo, context) => {
      console.log('账户发生变化！')
      console.log('最新SOL余额:', updatedAccountInfo.lamports / LAMPORTS_PER_SOL)
      console.log('上下文信息:', context)
    })

    console.log('开始监听pumpfun账户变化...')
    console.log('订阅ID:', subscriptionId)
  }

  const onSubscribeTokenAccount = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')
    // 2. 监听代币账户变化
    // 2.1 监听所有代币账户变化
    // const subscriptionId1 = connection.onProgramAccountChange(
    //   TOKEN_PROGRAM_ID,
    //   (keyedAccountInfo) => {
    //     const accountPubkey = keyedAccountInfo.accountId.toBase58();
    //     console.log(`代币账户 ${accountPubkey} 更新！`);
    //     const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data);
    //     console.log(`mint ${accountInfo.mint.toBase58()}`);
    //     console.log(`owner ${accountInfo.owner.toBase58()}`);
    //     console.log(`amount ${accountInfo.amount}`);
    //   },
    //   "confirmed"
    // );

    // console.log("开始监听所有token账户变化...");
    // console.log("订阅ID:", subscriptionId1);

    // // 2.2 监听 PNUT 代币账户变化
    const PNUT_MINT = new PublicKey('2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump') // PNUT token地址

    const subscriptionId2 = connection.onProgramAccountChange(
      TOKEN_PROGRAM_ID,
      (keyedAccountInfo) => {
        const accountPubkey = keyedAccountInfo.accountId.toBase58()
        console.log(`PNUT token账户 ${accountPubkey} 更新！`)
        //console.log(keyedAccountInfo);
        const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data)
        console.log(`owner ${accountInfo.owner.toBase58()}`)
        console.log(`amount ${accountInfo.amount}`)
      },
      'confirmed',
      [
        {
          memcmp: {
            offset: 0, // token account 中的 mint 地址在 offset 0
            bytes: PNUT_MINT.toBase58() // 只匹配 PNUT 代币地址
          }
        }
      ]
    )

    console.log('开始监听 PNUT token 账户变化...')
    console.log('订阅ID:', subscriptionId2)
  }

  const onSubscribeLog = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 3. 监听日志
    // 3.1 监听所有日志
    const subscriptionId4 = connection.onLogs(
      // 可选：传入 pubKey 监听特定地址的日志，或传入 'all' 监听所有日志
      'all',
      (logInfo, context) => {
        console.log('日志事件触发！')
        console.log('slot:', context.slot)
        console.log('签名:', logInfo.signature)
        console.log('日志输出:', logInfo.logs)
      },
      'confirmed'
    )

    // 3.2 监听 PumpFun 代币创建日志，筛选包含 "Instruction: Create"
    // const PUMPFUN_PROGRAM_ID = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
    // const subscriptionId5 = connection.onLogs(
    //   PUMPFUN_PROGRAM_ID,
    //   (logInfo, context) => {
    //     const logs = logInfo.logs || [];
    //     const hasCreateLog = logs.some(log => log.includes("Instruction: Create"));

    //     if (hasCreateLog) {
    //       console.log("检测到 PumpFun 创建代币操作！");
    //       console.log("Slot:", context.slot);
    //       console.log("Tx Signature:", logInfo.signature);
    //       console.log("日志输出:", logs);
    //     }
    //   },
    //   "confirmed"
    // );
  }

  const onSubscribeTradeConfirm = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 4. 监听交易确认
    const sig = '3vr9oZwTcdbLGJfMEX5auy82FFScMBfb5fzfj5SELMqzGuCCNqPV44QsE8rQVTTTmbqTenM1Eogh7aaeN1jnup8g' // 替换成你的交易签名

    const subscriptionId6 = connection.onSignature(
      sig,
      (signatureResult, context) => {
        console.log('交易确认！')
        console.log('slot:', context.slot)
        console.log('结果:', signatureResult) // { err: null } 表示成功
      },
      'confirmed'
    )
  }

  const onSubscribeSlot = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    const subscriptionId7 = connection.onSlotChange((slotInfo) => {
      console.log('新 slot 到来！')
      console.log('slot:', slotInfo.slot)
      console.log('上一个slot:', slotInfo.parent) // 上一个slot
      console.log('root:', slotInfo.root) // 网络已经最终确认的 slot
    })
  }

  return (
    <div>
      <Button onClick={onSubscribeAccountBlance}>监听账户余额变化</Button>
      <Button onClick={onSubscribeTokenAccount}>监听代币账户变化</Button>
      <Button onClick={onSubscribeLog}>监听日志变化</Button>
      <Button onClick={onSubscribeTradeConfirm}>监听交易确认</Button>
      <Button onClick={onSubscribeSlot}>监听 Slot</Button>
    </div>
  )
}

// Nonce账户
const Nonce = () => {
  const onCreateNonceAccount = async () => {
    // Solana默认交易使用最近 blockhash，有效期为 150 个 slot（~1分钟）。也就是说一笔交易签名到发出的保质期只有1分钟。这个机制的限制很大：多签交易时，一方签署交易，其他方稍后才能确认，但要是超过1分钟，前面交易就失效了。
    // 为了解决这一问题，Solana 引入了 Durable Nonce 机制，允许用户构造可延迟广播的交易，类似以太坊钱包的nonce。由于账户没有内置的nonce，因此想用nonce的话就需要开个账户来存，也就有了 Nonce Account（Nonce账户）的概念了。Nonce Account 是一种特殊的账户，它存储了一个可以用于交易的”稳定blockhash“：你可以反复使用它，直到你显式的更新这个 blockhash。它常被用于交易机器人、多签钱包、预定交易。

    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 发送者：创建一个新的钱包
    const payer = Keypair.generate()
    // 接收者
    const receiver = Keypair.generate()

    // 额外操作：先给发送者的地址空投一点钱，然后转入接受者的地址
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      10 * LAMPORTS_PER_SOL // 10 SOL
    )
    await connection.confirmTransaction(airdropSignature, 'confirmed')

    // 创建 nonce account
    const nonceAccount = Keypair.generate()
    const noncePubkey = nonceAccount.publicKey

    // 获取租金豁免所需 lamports
    const lamports = await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH)

    // 创建交易（用 SystemProgram 初始化）
    const tx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: noncePubkey,
        lamports,
        space: NONCE_ACCOUNT_LENGTH,
        programId: SystemProgram.programId
      }),
      // 初始化nonce账户
      SystemProgram.nonceInitialize({
        noncePubkey: noncePubkey,
        authorizedPubkey: payer.publicKey
      })
    )

    const sig = await sendAndConfirmTransaction(connection, tx, [payer, nonceAccount])
    console.log('交易成功！交易哈希:', sig)
    console.log(`https://explorer.solana.com/tx/${sig}?cluster=custom`)
    console.log('Nonce Account:', noncePubkey.toBase58())

    // 初始化 Nonce Account 之后，它里面会存一个特殊的 `blockhash`，计算方式为 `hash("DURABLE_NONCE" + Blockhash)`。而这里使用的 `Blockhash` 由 `SysvarRecentB1ockHashes`给出，没法提前确定，因此使用前我们要读取它：
    const info = await connection.getNonce(noncePubkey)
    console.log('当前 nonce (blockhash):', info?.nonce)

    // 构造交易：nonce advance + transfer
    const advanceIx = SystemProgram.nonceAdvance({
      noncePubkey: noncePubkey,
      authorizedPubkey: payer.publicKey
    })

    const transferIx = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: receiver.publicKey,
      lamports: 5 * LAMPORTS_PER_SOL
    })

    const tx2 = new Transaction().add(advanceIx).add(transferIx)

    // 使用 durable nonce 而非最新 blockhash
    tx2.recentBlockhash = info?.nonce
    tx2.feePayer = payer.publicKey

    tx2.sign(payer) // 必须由 nonce authority 签名

    const serialized = tx2.serialize()

    // 可离线保存后广播
    const sig2 = await connection.sendRawTransaction(serialized)
    console.log('广播成功，交易哈希:', sig2)

    const info2 = await connection.getNonce(noncePubkey)
    console.log('更新后的 nonce (blockhash):', info2?.nonce)
  }
  return (
    <div>
      <Button onClick={onCreateNonceAccount}>创建Nonce账户，使得交易不再受1分钟过期的限制</Button>
    </div>
  )
}

// ALT和V0交易
const ALT_AND_V0 = () => {
  const onCreateV0Message = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 发送者：创建一个新的钱包
    const payer = Keypair.generate()
    // 接收者
    const receiver = Keypair.generate()

    // 额外操作：先给发送者的地址空投一点钱，然后转入接受者的地址
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      20 * LAMPORTS_PER_SOL // 20 SOL
    )
    await connection.confirmTransaction(airdropSignature, 'confirmed')

    const slot = await connection.getSlot()

    // 使用 createLookupTable 创建 ALT，得到createInst指令和ALT地址
    const [createIx, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: slot
    })

    console.log('ALT地址:', lookupTableAddress.toBase58())

    // 使用 extendLookupTable 在ALT中添加地址，得到extendIx指令
    const extendIx = AddressLookupTableProgram.extendLookupTable({
      lookupTable: lookupTableAddress,
      authority: payer.publicKey,
      payer: payer.publicKey,
      addresses: [
        receiver.publicKey
        // 可添加多个，一次最多32个，每个ALT最多包含256个地址
      ]
    })

    console.log('extendIx', extendIx)

    const tx = new Transaction().add(createIx, extendIx)
    const sig = await sendAndConfirmTransaction(connection, tx, [payer])
    console.log('交易成功！交易哈希:', sig)
    console.log(`查看交易：https://explorer.solana.com/tx/${sig}?cluster=custom`)

    // const lookupTableAddress = new PublicKey("AWBzStFte72MdyqEi4EMBrb8QkwPsyjtkuxiMCt3AZtE");

    const lookupTableAccount = (await connection.getAddressLookupTable(lookupTableAddress)).value
    console.log('ALT账户:', lookupTableAccount)

    // 获取最新的 blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    // 转账指令
    const TransferIx = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: receiver.publicKey,
      lamports: 2 * LAMPORTS_PER_SOL
    })

    // 创建 v0 message
    const messageV0 = new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: blockhash,
      instructions: [TransferIx]
    }).compileToV0Message(lookupTableAccount ? [lookupTableAccount] : [])

    // 创建并发送交易
    const txV0 = new VersionedTransaction(messageV0)
    txV0.sign([payer])
    const signature = await connection.sendTransaction(txV0)
    console.log('交易已发送，签名:', signature)

    // 等待交易确认
    console.log('等待交易确认...')
    const confirmation = await connection.confirmTransaction(signature, 'confirmed')

    if (confirmation.value.err) {
      console.error('交易失败:', confirmation.value.err)
    } else {
      console.log('交易成功确认！')
      console.log('交易签名:', signature)
    }
  }
  return (
    <div>
      <Button onClick={onCreateV0Message}>ALT和V0交易</Button>
    </div>
  )
}

// 调用合约
const CallContract = () => {
  const onCallContract = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed')

    // 发送者：创建一个新的钱包
    const sender = Keypair.generate()
    // 接收者
    const receiver = Keypair.generate()

    // 额外操作：先给发送者的地址空投一点钱，然后转入接受者的地址
    const airdropSignature = await connection.requestAirdrop(
      sender.publicKey,
      20 * LAMPORTS_PER_SOL // 20 SOL
    )
    await connection.confirmTransaction(airdropSignature, 'confirmed')

    // 1. 打印当前发送者余额
    const balance = await connection.getBalance(sender.publicKey)
    console.log(`当前余额: ${balance / LAMPORTS_PER_SOL} SOL`)

    // 2. 构建转账指令的Buffer
    const data = Buffer.alloc(12) // u32 + u64 = 4 + 8 = 12 字节
    data.writeUInt32LE(2, 0) // instruction index: 2 (Transfer)
    data.writeBigUInt64LE(BigInt(0.001 * LAMPORTS_PER_SOL), 4) // lamports 写入 offset=4 开始的位置
    console.log('data', data)

    // 3. 使用 TransactionInstruction 构建转账指令（0.001 SOL）
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: sender.publicKey, isSigner: true, isWritable: true },
        { pubkey: receiver.publicKey, isSigner: false, isWritable: true }
      ],
      programId: SystemProgram.programId,
      data: data
    })

    // 4. 创建交易
    const transaction = new Transaction().add(instruction)

    // 5. 发送交易
    console.log('正在发送交易...')
    const signature = await sendAndConfirmTransaction(connection, transaction, [sender])

    console.log('交易成功！交易哈希:', signature)
    console.log(`查看交易：https://solscan.io/tx/${signature}?cluster=custom`)
  }
  return (
    <div>
      <Button onClick={onCallContract}>调用合约</Button>
    </div>
  )
}

export default function solLearn() {
  return (
    <div className="flex items-center justify-center flex-col gap-y-3 h-screen">
      <HelloComponent />
      <Wallet />
      <Transfer />
      <Account />
      <Block />
      <ReadTx />
      <ReadBlock />
      <Subscribe />
      <Nonce />
      <ALT_AND_V0 />
      <CallContract />
    </div>
  )
}
