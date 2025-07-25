import Button from '@/components/Base/Button'
import { useCluster } from '@/context/clusterProvider'
import useAccountBalance from '@/hooks/web3/useAccountBalance'
import usePrivyConnection from '@/hooks/web3/usePrivyConnection'
import {
  useLinkAccount,
  useLogin,
  useLoginWithEmail,
  useLoginWithOAuth,
  useMfaEnrollment,
  usePrivy,
  useSolanaWallets,
  useUser
} from '@privy-io/react-auth'
import {
  SolanaStandardWallet,
  useFundWallet,
  useSendTransaction,
  useSignMessage,
  useSignTransaction,
  useSolanaStandardWallets
} from '@privy-io/react-auth/solana'
import { UserPill } from '@privy-io/react-auth/ui'
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import bs58 from 'bs58' // 在 Web3 开发中，bs58 常用于解析或生成钱包地址、交易签名等
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

// createTransaction 函数保持不变
async function createTransaction({
  publicKey,
  destination,
  amount,
  connection
}: {
  publicKey: PublicKey
  destination: PublicKey
  amount: number
  connection: Connection
}): Promise<{
  transaction: VersionedTransaction
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number }
}> {
  const latestBlockhash = await connection.getLatestBlockhash()

  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: destination,
      lamports: amount * LAMPORTS_PER_SOL
    })
  ]

  // 新版构建方式
  // 新版交易格式（Versioned Transaction）
  // Solana 引入的升级版交易，支持更复杂的特性（如地址查找表、交易版本控制）
  // 通过 TransactionMessage 统一管理参数（支付者、区块哈希、指令），再编译为 VersionedTransaction
  const messageLegacy = new TransactionMessage({
    payerKey: publicKey, // 支付者
    recentBlockhash: latestBlockhash.blockhash, // 区块哈希
    instructions // 指令数组
  }).compileToLegacyMessage() // 编译为旧版消息（兼容模式）

  const transaction = new VersionedTransaction(messageLegacy)

  return {
    transaction,
    latestBlockhash
  }
}

const EmailLogin = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const { createWallet, wallets } = useSolanaWallets()
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete(params) {
      console.log('params', params)
    },
    onError(error) {
      console.log('error', error)
    }
  })

  // 这个钱包是连接上的钱包列表集合，没有点击连接过不会出现在这里 包含外部钱包 + 嵌入钱包，退出登录后只有外部外包会出现
  console.log('wallets', wallets)

  return (
    <div className="mb-4">
      <div>使用户能够通过电子邮件登录</div>
      <div className="flex gap-2 mb-3">
        <input placeholder="请输入" className="border" onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
        <button type="button" onClick={() => sendCode({ email })}>
          Send Code
        </button>
      </div>
      <div className="flex gap-2">
        <input placeholder="请输入" className="border" onChange={(e) => setCode(e.currentTarget.value)} value={code} />
        <button
          type="button"
          onClick={() => {
            loginWithCode({ code })
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            // 登录后创建钱包-手动调用方式
            createWallet()
          }}
        >
          创建钱包
        </button>
      </div>
    </div>
  )
}

const LoginWithOAuth = () => {
  const { state, loading, initOAuth } = useLoginWithOAuth({
    onComplete(params) {
      console.log('params', params)
    },
    onError(error) {
      console.log('error', error)
    }
  })

  const handleLogin = async () => {
    try {
      // The user will be redirected to OAuth provider's login page
      await initOAuth({ provider: 'google' })
    } catch (err) {
      // Handle errors (network issues, validation errors, etc.)
      console.error(err)
    }
  }

  return (
    <div>
      <button type="button" onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Log in with Google'}
      </button>
    </div>
  )
}

// 登录后，用户可以注册多因素认证（MFA）。 二次验证
// 用户注册 MFA 后，每次尝试使用钱包私钥（每次签名或交易）都需要用户使用其自身方法完成 MFA。此逻辑是自动的；用户注册钱包 MFA 后，您无需执行任何其他操作
// 当您的应用请求从嵌入式钱包进行签名或交易时，Privy 会向用户显示一个模态框，提示他们输入发送到其 MFA 方法的 6 位数 MFA 代码。如果用户已注册多种 MFA 方法，他们可以选择要用于此请求的方法。
// https://docs.privy.io/authentication/user-authentication/mfa/default-ui
// 如果您的应用已启用短信作为登录方式，则可能无法同时启用短信作为 MFA 方式。启用短信登录后，短信已可作为用户访问钱包时的主要身份验证因素；无法同时启用短信作为附加身份验证因素。
// 要使用密钥作为 MFA 方法，您还必须启用密钥作为登录方法
const MfaEnrollmentButton = () => {
  const { showMfaEnrollmentModal } = useMfaEnrollment()
  return (
    <button type="button" onClick={showMfaEnrollmentModal}>
      Enroll in MFA
    </button>
  )
}

// 交易相关
// https://docs.privy.io/wallets/connectors/solana/sign-a-transaction
const TradeDemo = observer(() => {
  const { ready, authenticated, logout, user, getAccessToken } = usePrivy()

  const { wallets } = useSolanaWallets()
  const { signMessage } = useSignMessage()
  const { connectWallet, connectOrCreateWallet } = usePrivy()
  const wallet = user?.wallet
  const address = wallet?.address ? new PublicKey(wallet?.address) : ''
  // ===== 发送交易配置 =====
  // Inside your component
  const { sendTransaction } = useSendTransaction()
  // 配置连接到正确的 Solana 网络
  // const connection = new Connection("https://api.mainnet-beta.solana.com");
  // const connection = new Connection(clusterApiUrl('devnet'));
  const { connection, cluster } = usePrivyConnection()
  const { clusters, setCluster } = useCluster()
  // ===== 发送交易配置 =====

  // ===== 交易签名配置 =====
  const { signTransaction } = useSignTransaction()
  // ===== 交易签名配置 =====

  const { fundWallet } = useFundWallet()

  // Sign a message 消息签名
  const onSignMessage = async () => {
    if (ready && authenticated) {
      console.log('消息签名')
      const message = 'Hello world'
      const signatureUint8Array = await signMessage({
        message: new TextEncoder().encode(message),
        // Optional: Specify the wallet to use for signing. If not provided, the first wallet will be used.
        options: {
          address: wallets[0].address
        }
      })
      const signature = bs58.encode(signatureUint8Array)
      console.log('signature', signature)
    }
  }

  // Send a transaction 发送交易方式1
  const onSendTransaction1 = async () => {
    const wallet = wallets[0]
    // @ts-ignore
    const payer = new PublicKey(wallet?.address)
    // 1. 构建交易
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: new PublicKey('3b2b7EdUnoq9i5DDK2Gt8FtrnZEMUJ7XAYVDAioY5bdQ'),
        lamports: 0.2 * LAMPORTS_PER_SOL // 1 SOL = 10^9 lamports
      })
    )

    // 2. 设置区块哈希（可选）
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer

    // 获取钱包的实例
    const foundWallet = wallets.find((v) => v.address === wallet.address)

    // 如果钱包是是外部钱包，则使用内置的签名方法
    if (foundWallet && foundWallet.connectorType !== 'embedded') {
      const signature = await foundWallet.sendTransaction(transaction, connection)
      console.log('外部钱包交易成功！交易哈希:', signature)
      console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
      return
    }

    // 3. 让钱包签名 (如果钱包是内置钱包，则使用自定义的签名方法)
    const { signature } = await sendTransaction({ transaction, connection, address: wallet.address })
    console.log('交易成功！交易哈希:', signature)
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  }

  // Send a transaction 发送交易方式2
  const onSendTransaction2 = async () => {
    const wallet = wallets[0]
    // 1. 构建交易
    const { transaction, latestBlockhash } = await createTransaction({
      publicKey: new PublicKey(wallet?.address),
      destination: new PublicKey('3b2b7EdUnoq9i5DDK2Gt8FtrnZEMUJ7XAYVDAioY5bdQ'),
      amount: 0.2, // 1 SOL = 10^9 lamports
      connection
    })

    // 获取钱包的实例
    const foundWallet = wallets.find((v) => v.address === wallet.address)

    // 如果钱包是是外部钱包，则使用内置的签名方法
    if (foundWallet && foundWallet.connectorType !== 'embedded') {
      const signature = await foundWallet.sendTransaction(transaction, connection)
      console.log('外部钱包交易成功！交易哈希:', signature)
      console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
      return
    }

    // 2. 让钱包签名(如果钱包是内置钱包，则使用自定义的签名方法)
    const { signature } = await sendTransaction({ transaction, connection, address: wallet.address })
    console.log('交易成功！交易哈希:', signature)
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  }

  // Sign a transaction 交易签名
  const onSignTransaction = async () => {
    const wallet = wallets[0]
    const payer = new PublicKey(wallet?.address)
    // Configure your connection to point to the correct Solana network
    // let connection = new Connection(clusterApiUrl('devnet'));

    // Build out the transaction object for your desired program
    // https://solana-foundation.github.io/solana-web3.js/classes/Transaction.html
    let transaction = new Transaction()

    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer

    // Sign transaction
    const signedTransaction = await signTransaction({ transaction, connection, address: wallet.address })
    console.log('Signed transaction:交易签名', signedTransaction)
  }

  const onConnectWallet = async () => {
    // 该方法的功能与 Privy 的方法完全相同login，只是当用户连接他们的外部钱包时，不会自动提示他们通过签署消息来验证该钱包
    // Privy 的connectOrCreate界面目前仅支持 EVM 网络上的外部和嵌入式钱包。
    // await connectOrCreateWallet();
    // https://docs.privy.io/recipes/react/configuring-external-connectors#solana
    // 可以传入特定的钱包列表
    await connectWallet({ walletList: ['phantom', 'metamask'] })
  }

  const { refreshUser } = useUser()

  // 刷新用户
  // https://docs.privy.io/user-management/users/the-user-object
  const updateMetadata = async (value: string) => {
    // Make API request to update custom metadata for a user from the backend
    // const response = await updateUserMetadata({ value });
    // await refreshUser();
    // // `user` object should be updated
    // console.log(user);
  }

  // 获取钱包余额
  const { balance, getBalance } = useAccountBalance({ address })

  const { exportWallet } = useSolanaWallets()

  return (
    <div>
      <Button onClick={onSignMessage}>消息签名</Button>
      <Button onClick={onSendTransaction1}>发送交易-方式1</Button>
      <Button onClick={onSendTransaction2}>发送交易-方式2</Button>
      <Button onClick={onSignTransaction}>交易签名</Button>
      <Button onClick={onConnectWallet}>连接钱包</Button>
      <Button onClick={async () => exportWallet()}>导出钱包</Button>
      <Button
        disabled={!wallets[0]}
        onClick={() => {
          wallets[0].loginOrLink()
          // 验证已连接的钱包
          // 一旦用户将他们的钱包连接到您的应用程序，并且钱包在useWallets或useSolanaWallets数组中可用，您还可以提示他们使用该钱包登录或将该钱包链接到他们现有的帐户，而不是提示整个login或linkWallet流程。
          // 为此，从 Privy 中找到ConnectedWallet或ConnectedSolanaWallet对象，并调用该对象的loginOrLink方法：
          // 当被调用时，将直接从用户连接的钱包loginOrLink请求SIWE或SIWS签名来验证钱包。
        }}
      >
        Login with wallet
      </Button>
      <Button onClick={getBalance}>获取钱包余额 {balance}</Button>
      <div>当前节点：{JSON.stringify(cluster)}</div>
      <div>
        切换节点：
        {clusters.map((item, idx) => (
          <Button type={item.name === cluster.name ? 'primary' : 'default'} onClick={() => setCluster(item)} key={idx}>
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  )
})

// 将账户与用户关联 https://docs.privy.io/user-management/users/linking-accounts
const LinkOptions = () => {
  const { linkEmail, linkGoogle, linkWallet } = useLinkAccount()

  return (
    <div className="link-options">
      <Button onClick={linkEmail}>Link Email to user</Button>
      <Button onClick={linkGoogle}>Link Google account to user</Button>
      <Button onClick={linkWallet}>Link Wallet to user</Button>
    </div>
  )
}

// 取消帐户与用户的链接
// 当用户创建了新的外部账户（例如新的 Twitter 账户或电子邮件地址）并希望移除旧关联账户时，此功能可能非常有用
// 用户只有在拥有至少一个已链接帐户的情况下才可以取消链接帐户
const UnlinkOptions = () => {
  const { unlinkEmail, unlinkGoogle, unlinkWallet } = usePrivy()

  return (
    <div className="unlink-options">
      {/* @ts-ignore */}
      <Button onClick={unlinkEmail}>Unlink Email to user</Button>
      {/* @ts-ignore */}
      <Button onClick={unlinkGoogle}>Unlink Google account to user</Button>
      {/* @ts-ignore */}
      <Button onClick={unlinkWallet}>Unlink Wallet to user</Button>
    </div>
  )
}

// 更新用户帐户 https://docs.privy.io/user-management/users/updating-accounts
const UpdateUserAccount = () => {
  const { ready, authenticated, user, updateEmail } = usePrivy()

  return (
    <Button onClick={updateEmail} disabled={!ready || !authenticated || !user?.email}>
      Update your email
    </Button>
  )
}

// 设置主题参考 https://docs.privy.io/recipes/system-theme

// 以下是如何使用任何 Solana 标准钱包的核心功能：https://docs.privy.io/recipes/solana/standard-wallets
const WalletComponent = () => {
  const { ready, wallets } = useSolanaStandardWallets()

  // Connect/Disconnect
  const connect = (wallet: SolanaStandardWallet) => wallet.features['standard:connect']!.connect()
  const disconnect = (wallet: SolanaStandardWallet) => wallet.features['standard:disconnect']!.disconnect()

  // Sign Message
  const signMessage = async (wallet: SolanaStandardWallet, address: string, message: Uint8Array) => {
    const account = wallet.accounts.find((a) => a.address === address)!
    const [result] = await wallet.features['solana:signMessage']!.signMessage({
      account,
      message
    })
    return result
  }

  // Sign Transaction
  const signTransaction = async (wallet: SolanaStandardWallet, address: string, transaction: Uint8Array) => {
    const account = wallet.accounts.find((a) => a.address === address)!
    const [result] = await wallet.features['solana:signTransaction']!.signTransaction({
      transaction,
      chain: 'solana:devnet',
      account
    })
    return result
  }

  // Sign and Send Transaction
  const signAndSendTransaction = async (wallet: SolanaStandardWallet, address: string, transaction: Uint8Array) => {
    const account = wallet.accounts.find((a) => a.address === address)!
    return wallet.features['solana:signAndSendTransaction']!.signAndSendTransaction({
      transaction,
      chain: 'solana:devnet',
      account
    })
  }
}

export default function Test() {
  const { ready, authenticated, logout, user, getAccessToken } = usePrivy()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const { sendCode, loginWithCode } = useLoginWithEmail()
  // 在从 Privy 确定用户的授权状态之前，您应该验证 Privy 是否已完全初始化并且ready
  const disableLogin = !ready || (ready && authenticated)
  const { login } = useLogin({
    onComplete: (user) => {
      console.log('登录成功', user)
    }
  })
  // 如果您需要在 Privy 的 React 上下文之外获取用户的 Privy 令牌，您可以直接导入该getAccessToken方法：
  // 使用直接导入时，必须确保PrivyProvider在调用该方法之前已渲染。尽可能getAccessToken从usePrivy钩子中检索。
  // import { getAccessToken } from '@privy-io/react-auth';
  // const authToken = await getAccessToken();

  useEffect(() => {
    // 如果用户的访问令牌即将过期或已过期，此方法还将自动刷新用户的访问令牌
    getAccessToken().then((token) => {
      console.log('getAccessToken', token)
    })
  }, [])

  return (
    <div className="flex flex-col mx-10 gap-2 items-center justify-center h-screen">
      <EmailLogin />
      <div className="mb-4">
        <div>发送嵌入式钱包的交易</div>
      </div>
      {/*  */}
      <button type="button" disabled={disableLogin} onClick={login}>
        {' '}
        {authenticated ? '已登录' : '登录'}
      </button>
      {authenticated && (
        <div>
          <div>钱包地址: {user?.wallet?.address}</div>
          <div>用户信息: {JSON.stringify(user, null, 2)}</div>
        </div>
      )}
      {authenticated && (
        <button type="button" onClick={() => logout()}>
          退出登录
        </button>
      )}
      <LoginWithOAuth />
      <MfaEnrollmentButton />
      <TradeDemo />
      <LinkOptions />
      <UnlinkOptions />
      <UpdateUserAccount />
      {/* https://docs.privy.io/user-management/users/ui-components */}
      <UserPill />
    </div>
  )
}
