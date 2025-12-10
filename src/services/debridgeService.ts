/**
 * deBridge API 集成服务
 * 支持 TRON ↔ Ethereum ↔ Solana 跨链桥接
 *
 * 优势：
 * 1. 费用比其他桥低很多（通常 < 5%）
 * 2. 支持 TRON → Ethereum → Solana 路由
 * 3. 速度快，确认时间短
 *
 * API 文档：https://docs.debridge.finance/
 */

import { request } from '@/utils/request'
import { API_BASE_URL, DEBRIDGE_API_BASE_URL, TRON_API_ENDPOINTS } from '@/constants/api'

// 支持的链 ID（deBridge 格式）
export const DEBRIDGE_CHAIN_IDS = {
  TRON: 100000026, // TRON Mainnet
  ETHEREUM: 1, // Ethereum Mainnet
  SOLANA: 7565164, // Solana Mainnet
  BSC: 56,
  POLYGON: 137,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  BASE: 8453
} as const

// Token 地址映射
export const DEBRIDGE_TOKENS = {
  TRON: {
    USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    USDC: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'
  },
  ETHEREUM: {
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  },
  SOLANA: {
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT SPL
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC SPL
  }
} as const

/**
 * 桥接参数
 */
export interface DeBridgeParams {
  srcChainId: number
  dstChainId: number
  srcChainTokenIn: string
  srcChainTokenInAmount: string // 最小单位格式（如 USDT 6 decimals: "26000000"）
  dstChainTokenOut: string
  dstChainTokenOutRecipient: string
  srcChainOrderAuthorityAddress?: string
  dstChainOrderAuthorityAddress?: string
  affiliateFeePercent?: number // 0-5, 默认 0
  affiliateFeeRecipient?: string
  senderAddress?: string
  prependOperatingExpenses?: boolean
}

/**
 * 桥接报价结果
 */
export interface DeBridgeQuote {
  estimation: {
    srcChainTokenIn: {
      address: string
      symbol: string
      decimals: number
      amount: string
      approximateOperatingExpense: string
    }
    srcChainTokenOut: {
      address: string
      symbol: string
      decimals: number
      amount: string
      maxRefundAmount: string
    }
    dstChainTokenOut: {
      address: string
      symbol: string
      decimals: number
      amount: string
      recommendedAmount: string
      maxTheoreticalAmount: string
    }
  }
  tx: {
    to?: string
    data: string
    value: string
    allowanceTarget: string
    allowanceValue: string
  }
  order: {
    approximateFulfillmentDelay: number // 秒
  }
  fixFee: string
  orderId?: string
}

/**
 * 订单状态
 */
export interface DeBridgeOrderStatus {
  orderId: string
  status: 'Created' | 'Fulfilled' | 'SentUnlock' | 'OrderCancelled' | 'ClaimedUnlock'
  give: {
    chainId: number
    tokenAddress: string
    amount: string
  }
  take: {
    chainId: number
    tokenAddress: string
    amount: string
  }
  createdAt: string
  fulfilledAt?: string
}

/**
 * 获取跨链桥接报价
 */
export async function getDeBridgeQuote(params: DeBridgeParams): Promise<DeBridgeQuote> {
  const {
    srcChainId,
    dstChainId,
    srcChainTokenIn,
    srcChainTokenInAmount,
    dstChainTokenOut,
    dstChainTokenOutRecipient,
    srcChainOrderAuthorityAddress,
    dstChainOrderAuthorityAddress,
    affiliateFeePercent = 0,
    affiliateFeeRecipient
  } = params

  try {
    // Check minimum amount (deBridge has high fixed fees for small amounts)
    const MIN_AMOUNT_6_DECIMALS = 10_000_000 // 10 USD
    const amountNum = parseInt(srcChainTokenInAmount)

    if (amountNum < MIN_AMOUNT_6_DECIMALS) {
      const amountUSD = amountNum / 1_000_000
      throw new Error(
        `Amount too small for cross-chain bridge. Minimum: $10 USD, Your amount: $${amountUSD.toFixed(2)} USD. ` +
          `deBridge has fixed fees of ~$2-3, making small amounts uneconomical (fees can be 50%+).`
      )
    }

    console.log('[deBridge] Getting bridge quote:', {
      srcChainId,
      dstChainId,
      srcChainTokenIn,
      srcChainTokenInAmount,
      dstChainTokenOut
    })

    const url = new URL(`${DEBRIDGE_API_BASE_URL}/dln/order/quote`)
    url.searchParams.append('srcChainId', srcChainId.toString())
    url.searchParams.append('srcChainTokenIn', srcChainTokenIn)
    url.searchParams.append('srcChainTokenInAmount', srcChainTokenInAmount)
    url.searchParams.append('dstChainId', dstChainId.toString())
    url.searchParams.append('dstChainTokenOut', dstChainTokenOut)
    url.searchParams.append('dstChainTokenOutRecipient', dstChainTokenOutRecipient)

    if (srcChainOrderAuthorityAddress) {
      url.searchParams.append('srcChainOrderAuthorityAddress', srcChainOrderAuthorityAddress)
    }

    if (dstChainOrderAuthorityAddress) {
      url.searchParams.append('dstChainOrderAuthorityAddress', dstChainOrderAuthorityAddress)
    }

    if (affiliateFeePercent > 0 && affiliateFeeRecipient) {
      url.searchParams.append('affiliateFeePercent', affiliateFeePercent.toString())
      url.searchParams.append('affiliateFeeRecipient', affiliateFeeRecipient)
    }

    console.log('[deBridge] Request URL:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`deBridge API error: ${response.status} ${errorText}`)
    }

    const result: DeBridgeQuote = await response.json()

    console.log('[deBridge] Quote received:', {
      srcAmount: result.estimation.srcChainTokenIn.amount,
      dstAmount: result.estimation.dstChainTokenOut.recommendedAmount,
      delay: result.order.approximateFulfillmentDelay
    })

    return result
  } catch (error) {
    console.error('[deBridge] Failed to get bridge quote:', error)
    throw new Error(`Failed to get deBridge quote: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * 查询订单状态
 */
export async function getDeBridgeOrderStatus(orderId: string): Promise<DeBridgeOrderStatus> {
  try {
    console.log('[deBridge] Getting order status:', orderId)

    const response = await fetch(`${DEBRIDGE_API_BASE_URL}/dln/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`deBridge API error: ${response.status} ${errorText}`)
    }

    const result: DeBridgeOrderStatus = await response.json()

    console.log('[deBridge] Order status:', {
      orderId: result.orderId,
      status: result.status,
      fulfilledAt: result.fulfilledAt
    })

    return result
  } catch (error) {
    console.error('[deBridge] Failed to get order status:', error)
    throw new Error(`Failed to get deBridge order status: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * 创建带 Gas 赞助的桥接订单（Ethereum）
 * 使用用户钱包签名，Gas 由 Privy/后端赞助
 */
export async function createDeBridgeOrderEthereum(
  quote: DeBridgeQuote,
  sendTransaction: (params: any) => Promise<{ transactionHash: string }>,
  fromAddress: string
): Promise<{ txHash: string; orderId?: string }> {
  try {
    console.log('[deBridge] Creating Ethereum bridge order with gas sponsorship...')

    // 使用 Privy sendTransaction (自动处理 gas sponsorship)
    const result = await sendTransaction({
      to: quote.tx.to || quote.tx.allowanceTarget,
      data: quote.tx.data as `0x${string}`,
      value: BigInt(quote.tx.value || '0')
    })

    console.log('[deBridge] Bridge transaction sent:', result.transactionHash)

    return {
      txHash: result.transactionHash,
      orderId: quote.orderId
    }
  } catch (error) {
    console.error('[deBridge] Failed to create Ethereum bridge order:', error)
    throw new Error(`Failed to create bridge order: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * 创建带 Gas 赞助的桥接订单（Solana）
 * 使用 Solana 钱包签名
 */
export async function createDeBridgeOrderSolana(
  quote: DeBridgeQuote,
  solanaWallet: any,
  connection: any
): Promise<{ txHash: string; orderId?: string }> {
  try {
    console.log('[deBridge] Creating Solana bridge order...')

    // Solana 实现待完成 - 需要使用 @solana/web3.js
    // 这里先返回占位符
    throw new Error('Solana bridge not implemented yet')
  } catch (error) {
    console.error('[deBridge] Failed to create Solana bridge order:', error)
    throw new Error(`Failed to create bridge order: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * 创建 TRON 桥接订单（使用 Privy 嵌入式钱包）
 * 支持 Gas 赞助功能
 */
export async function createDeBridgeOrderTron(
  quote: DeBridgeQuote,
  tokenAddress: string,
  amount: string,
  fromAddress: string,
  ethereumAddress: string,
  walletId: string,
  publicKey: string,
  accessToken: string,
  useGasSponsorship: boolean = true
): Promise<{ txHash: string; orderId: string; dstChainTokenOutAmount: string }> {
  try {
    console.log('[deBridge-TRON] Creating bridge order...')
    console.log('[deBridge-TRON] Token:', tokenAddress)
    console.log('[deBridge-TRON] From:', fromAddress)
    console.log('[deBridge-TRON] Gas sponsorship:', useGasSponsorship ? 'Enabled ✅' : 'Disabled')

    // 动态导入 TronWeb
    const { TronWeb } = await import('tronweb')
    const tronWeb = new TronWeb({
      fullHost: 'https://rpc.ankr.com/premium-http/tron/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
    })

    const DLN_SOURCE_ADDRESS = tronWeb.address.fromHex(quote.tx.allowanceTarget)

    // Step 1: Check and approve token
    console.log('[deBridge-TRON] Step 1: Checking token allowance...')

    const tokenContract = await tronWeb.contract().at(tokenAddress)
    const allowance = await tokenContract.allowance(fromAddress, DLN_SOURCE_ADDRESS).call({ from: fromAddress })

    console.log('[deBridge-TRON] Current allowance:', allowance.toString())
    console.log('[deBridge-TRON] Required allowance:', amount)

    if (BigInt(allowance.toString()) < BigInt(amount)) {
      console.log('[deBridge-TRON] Insufficient allowance, creating approve transaction...')

      const parameter = [
        { type: 'address', value: DLN_SOURCE_ADDRESS },
        { type: 'uint256', value: amount }
      ]

      const approveTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        tokenAddress,
        'approve(address,uint256)',
        { feeLimit: 50_000_000, callValue: 0 },
        parameter,
        fromAddress
      )

      if (!approveTransaction.result?.result) {
        throw new Error('Failed to build approve transaction')
      }

      console.log('[deBridge-TRON] Sending approve tx to backend...')

      const endpoint = useGasSponsorship
        ? TRON_API_ENDPOINTS.SPONSOR_AND_SIGN
        : TRON_API_ENDPOINTS.SIGN_TRANSACTION

      // 使用 fetch 而不是 request，避免自动添加 Blade-Auth header
      const sponsorResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          walletId,
          transaction: approveTransaction.transaction,
          publicKey,
          transactionHash: approveTransaction.transaction.txID
        })
      })

      if (!sponsorResponse.ok) {
        const errorText = await sponsorResponse.text()
        throw new Error(`Approval failed: ${errorText}`)
      }

      const sponsorData = await sponsorResponse.json()

      if (!sponsorData?.success) {
        throw new Error(`Approval failed: ${sponsorData?.message || 'Unknown error'}`)
      }

      const sponsorResult = sponsorResponse.data || sponsorResponse
      console.log('[deBridge-TRON] ✅ Approve tx:', sponsorResult.txid || sponsorResult.transactionHash)

      // Wait for confirmation
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }

    // Step 2: Create order transaction
    console.log('[deBridge-TRON] Step 2: Creating order transaction...')

    const createTxUrl = new URL(`${DEBRIDGE_API_BASE_URL}/dln/order/create-tx`)
    createTxUrl.searchParams.append('srcChainId', DEBRIDGE_CHAIN_IDS.TRON.toString())
    createTxUrl.searchParams.append('srcChainTokenIn', tokenAddress)
    createTxUrl.searchParams.append('srcChainTokenInAmount', amount)
    createTxUrl.searchParams.append('dstChainId', '1')
    createTxUrl.searchParams.append('dstChainTokenOut', quote.estimation.dstChainTokenOut.address)
    createTxUrl.searchParams.append('dstChainTokenOutRecipient', ethereumAddress)
    createTxUrl.searchParams.append('srcChainOrderAuthorityAddress', fromAddress)
    createTxUrl.searchParams.append('dstChainOrderAuthorityAddress', ethereumAddress)
    createTxUrl.searchParams.append('prependOperatingExpenses', 'false')

    const createTxResponse = await fetch(createTxUrl.toString())
    if (!createTxResponse.ok) {
      throw new Error(`Failed to get transaction data: ${createTxResponse.status}`)
    }

    const txData = (await createTxResponse.json()) as any
    if (!txData.tx?.data) {
      throw new Error('No transaction data in response')
    }

    const orderId = txData.orderId
    const dstChainTokenOutAmount = txData.estimation?.dstChainTokenOut?.recommendedAmount || '0'

    // Build transaction
    const fullCallData = txData.tx.data.startsWith('0x') ? txData.tx.data.slice(2) : txData.tx.data
    const callValue = parseInt(txData.tx.value || '0')

    const baseTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      DLN_SOURCE_ADDRESS,
      'fallback()',
      { feeLimit: 50_000_000, callValue },
      [],
      fromAddress
    )

    if (!baseTransaction.result?.result) {
      throw new Error('Failed to create base transaction')
    }

    const txObject = baseTransaction.transaction

    // Inject calldata
    if (txObject.raw_data?.contract?.[0]?.parameter?.value) {
      txObject.raw_data.contract[0].parameter.value.data = fullCallData
    }

    // Recalculate txID
    const txPb = tronWeb.utils.transaction.txJsonToPb(txObject)
    const rawDataBytes = txPb.getRawData().serializeBinary()
    const newRawDataHex = tronWeb.utils.code.byteArray2hexStr(rawDataBytes)
    txObject.raw_data_hex = newRawDataHex

    const txHash = tronWeb.utils.crypto.SHA256(rawDataBytes)
    const newTxID = tronWeb.utils.code.byteArray2hexStr(txHash)
    txObject.txID = newTxID

    console.log('[deBridge-TRON] Sending order tx to backend...')
    console.log('[deBridge-TRON] Transaction ID:', newTxID)

    const endpoint = useGasSponsorship
      ? TRON_API_ENDPOINTS.SPONSOR_AND_SIGN
      : TRON_API_ENDPOINTS.SIGN_TRANSACTION

    // 使用 fetch 而不是 request，避免自动添加 Blade-Auth header
    const orderSponsorResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        walletId,
        transaction: txObject,
        publicKey,
        transactionHash: newTxID
      })
    })

    if (!orderSponsorResponse.ok) {
      const errorText = await orderSponsorResponse.text()
      throw new Error(`Order creation failed: ${errorText}`)
    }

    const orderData = await orderSponsorResponse.json()

    if (!orderData?.success) {
      throw new Error(`Order creation failed: ${orderData?.message || 'Unknown error'}`)
    }

    const orderResult = orderData.data || orderData
    console.log('[deBridge-TRON] ✅ Order tx:', orderResult.txid || orderResult.transactionHash)

    return {
      txHash: orderResult.txid || orderResult.transactionHash,
      orderId: orderId || '',
      dstChainTokenOutAmount
    }
  } catch (error) {
    console.error('[deBridge-TRON] Failed:', error)
    throw new Error(`TRON bridge failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * 等待订单完成
 */
export async function waitForOrderCompletion(
  orderId: string,
  maxWaitTime: number = 600000, // 默认 10 分钟
  pollInterval: number = 10000 // 每 10 秒检查一次
): Promise<DeBridgeOrderStatus> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const status = await getDeBridgeOrderStatus(orderId)
      console.log(`[deBridge] Order ${orderId} status: ${status.status}`)

      if (status.status === 'Fulfilled' || status.status === 'SentUnlock') {
        console.log('[deBridge] ✅ Order completed successfully!')
        return status
      }

      if (status.status === 'OrderCancelled') {
        throw new Error('Order was cancelled')
      }
    } catch (error) {
      console.warn('[deBridge] Status check failed:', error)
    }

    // 等待后重试
    await new Promise((resolve) => setTimeout(resolve, pollInterval))
  }

  throw new Error('Order completion timeout')
}

/**
 * TRON → Ethereum 桥接（简化接口）
 */
export async function bridgeTronToEthereum(params: {
  tokenAddress: string
  amount: string
  fromAddress: string
  ethereumAddress: string
  walletId: string
  publicKey: string
  accessToken: string
  useGasSponsorship?: boolean
}): Promise<{ txHash: string; orderId: string; dstChainTokenOutAmount: string }> {
  console.log('[deBridge] Bridge: TRON → Ethereum')

  // 根据源链 token 地址，映射到目标链的对应 token
  let dstTokenAddress: string
  const srcTokenUpper = params.tokenAddress.toUpperCase()

  if (srcTokenUpper === DEBRIDGE_TOKENS.TRON.USDT.toUpperCase()) {
    dstTokenAddress = DEBRIDGE_TOKENS.ETHEREUM.USDT
  } else if (srcTokenUpper === DEBRIDGE_TOKENS.TRON.USDC.toUpperCase()) {
    dstTokenAddress = DEBRIDGE_TOKENS.ETHEREUM.USDC
  } else {
    throw new Error(`Unsupported token address: ${params.tokenAddress}`)
  }

  console.log('[deBridge] Token mapping:', {
    src: params.tokenAddress,
    dst: dstTokenAddress
  })

  // 1. 获取报价
  const quote = await getDeBridgeQuote({
    srcChainId: DEBRIDGE_CHAIN_IDS.TRON,
    srcChainTokenIn: params.tokenAddress,
    srcChainTokenInAmount: params.amount,
    dstChainId: DEBRIDGE_CHAIN_IDS.ETHEREUM,
    dstChainTokenOut: dstTokenAddress,
    dstChainTokenOutRecipient: params.ethereumAddress,
    srcChainOrderAuthorityAddress: params.fromAddress,
    dstChainOrderAuthorityAddress: params.ethereumAddress,
    prependOperatingExpenses: false
  })

  // 2. 创建订单
  return await createDeBridgeOrderTron(
    quote,
    params.tokenAddress,
    params.amount,
    params.fromAddress,
    params.ethereumAddress,
    params.walletId,
    params.publicKey,
    params.accessToken,
    params.useGasSponsorship ?? true
  )
}

/**
 * Ethereum → Solana 桥接（简化接口）
 */
export async function bridgeEthereumToSolana(params: {
  tokenAddress: string
  amount: string
  solanaAddress: string
  privyWallet: any
}): Promise<{ txHash: string; orderId?: string }> {
  console.log('[deBridge] Bridge: Ethereum → Solana')

  // 根据源链 token 地址，映射到目标链的对应 token
  let dstTokenAddress: string
  const srcTokenLower = params.tokenAddress.toLowerCase()

  if (srcTokenLower === DEBRIDGE_TOKENS.ETHEREUM.USDT.toLowerCase()) {
    dstTokenAddress = DEBRIDGE_TOKENS.SOLANA.USDT
  } else if (srcTokenLower === DEBRIDGE_TOKENS.ETHEREUM.USDC.toLowerCase()) {
    dstTokenAddress = DEBRIDGE_TOKENS.SOLANA.USDC
  } else {
    throw new Error(`Unsupported token address: ${params.tokenAddress}`)
  }

  console.log('[deBridge] Token mapping:', {
    src: params.tokenAddress,
    dst: dstTokenAddress
  })

  // 动态导入 viem 以检查余额和处理交易
  const { createPublicClient, http, encodeFunctionData } = await import('viem')
  const { mainnet } = await import('viem/chains')

  // 创建 public client 用于读取链上数据
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http('https://rpc.ankr.com/eth/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3')
  })

  // 检查 ETH 余额
  console.log('[deBridge-ETH] Checking ETH balance for gas...')
  const ethBalance = await publicClient.getBalance({
    address: params.privyWallet.address as `0x${string}`
  })

  console.log('[deBridge-ETH] ETH balance:', {
    wei: ethBalance.toString(),
    eth: (Number(ethBalance) / 1e18).toFixed(6),
    hasBalance: ethBalance > BigInt(0)
  })

  if (ethBalance === BigInt(0)) {
    throw new Error(`⚠️ ETH 余额不足以支付 Gas 费用！请向钱包 ${params.privyWallet.address} 充值至少 0.01 ETH`)
  }

  // 1. 获取报价
  const quote = await getDeBridgeQuote({
    srcChainId: DEBRIDGE_CHAIN_IDS.ETHEREUM,
    srcChainTokenIn: params.tokenAddress,
    srcChainTokenInAmount: params.amount,
    dstChainId: DEBRIDGE_CHAIN_IDS.SOLANA,
    dstChainTokenOut: dstTokenAddress,
    dstChainTokenOutRecipient: params.solanaAddress,
    srcChainOrderAuthorityAddress: params.privyWallet.address,
    dstChainOrderAuthorityAddress: params.solanaAddress,
    prependOperatingExpenses: false
  })

  console.log('[deBridge] Quote received:', {
    srcAmount: quote.estimation.srcChainTokenIn.amount,
    dstAmount: quote.estimation.dstChainTokenOut.recommendedAmount,
    orderId: quote.orderId,
    allowanceValue: quote.tx.allowanceValue
  })

  // ERC20 ABI
  const ERC20_ABI = [
    {
      name: 'approve',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }]
    },
    {
      name: 'allowance',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' }
      ],
      outputs: [{ name: '', type: 'uint256' }]
    }
  ] as const

  // 2. 检查当前 allowance
  console.log('[deBridge-ETH] Checking current allowance...')
  const currentAllowance = (await publicClient.readContract({
    address: params.tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [params.privyWallet.address as `0x${string}`, quote.tx.allowanceTarget as `0x${string}`]
  })) as bigint

  console.log('[deBridge-ETH] Current allowance:', currentAllowance.toString())
  console.log('[deBridge-ETH] Required amount:', params.amount)

  // 3. 如果需要，进行 approve
  if (currentAllowance < BigInt(params.amount)) {
    console.log('[deBridge-ETH] Insufficient allowance, requesting approval...')

    try {
      // 🔥 USDT 特殊处理：如果当前 allowance > 0，必须先重置为 0
      const isUSDT = srcTokenLower === '0xdac17f958d2ee523a2206206994597c13d831ec7'

      if (isUSDT && currentAllowance > BigInt(0)) {
        console.log('[deBridge-ETH] ⚠️ USDT detected with existing allowance, resetting to 0 first...')

        const resetApproveData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [quote.tx.allowanceTarget as `0x${string}`, BigInt(0)]
        })

        const resetTx = await params.privyWallet.sendTransaction({
          to: params.tokenAddress as `0x${string}`,
          data: resetApproveData as `0x${string}`,
          value: BigInt(0)
        })

        console.log('[deBridge-ETH] ✅ Reset approval tx sent:', resetTx.transactionHash)
        console.log('[deBridge-ETH] Waiting for reset confirmation...')

        const resetReceipt = await publicClient.waitForTransactionReceipt({
          hash: resetTx.transactionHash as `0x${string}`,
          timeout: 180_000
        })

        if (resetReceipt.status === 'reverted') {
          throw new Error('Reset approval transaction failed')
        }

        console.log('[deBridge-ETH] ✅ Reset approval confirmed')
      }

      // 正式 approve
      console.log('[deBridge-ETH] Sending approval transaction...')
      const approveData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [quote.tx.allowanceTarget as `0x${string}`, BigInt(quote.tx.allowanceValue)]
      })

      const approveTx = await params.privyWallet.sendTransaction({
        to: params.tokenAddress as `0x${string}`,
        data: approveData as `0x${string}`,
        value: BigInt(0)
      })

      console.log('[deBridge-ETH] ✅ Approval tx sent:', approveTx.transactionHash)

      // 等待确认
      console.log('[deBridge-ETH] Waiting for approval confirmation...')
      const approveReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveTx.transactionHash as `0x${string}`,
        timeout: 180_000
      })

      if (approveReceipt.status === 'reverted') {
        throw new Error('Token approval transaction failed')
      }

      console.log('[deBridge-ETH] ✅ Approval confirmed:', approveReceipt.transactionHash)
    } catch (error) {
      console.error('[deBridge-ETH] Approval failed:', error)
      throw new Error(`Token approval failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  } else {
    console.log('[deBridge-ETH] ✅ Sufficient allowance, skipping approval')
  }

  // 4. 创建桥接订单
  console.log('[deBridge-ETH] Creating bridge order...')

  try {
    const bridgeTx = await params.privyWallet.sendTransaction({
      to: (quote.tx.to || quote.tx.allowanceTarget) as `0x${string}`,
      data: quote.tx.data as `0x${string}`,
      value: BigInt(quote.tx.value || '0')
    })

    console.log('[deBridge-ETH] ✅ Bridge tx sent:', bridgeTx.transactionHash)

    // 等待交易确认
    console.log('[deBridge-ETH] Waiting for bridge transaction confirmation...')
    const bridgeReceipt = await publicClient.waitForTransactionReceipt({
      hash: bridgeTx.transactionHash as `0x${string}`,
      timeout: 180_000
    })

    if (bridgeReceipt.status === 'reverted') {
      throw new Error('Bridge transaction failed')
    }

    console.log('[deBridge-ETH] ✅ Bridge transaction confirmed:', bridgeReceipt.transactionHash)

    return {
      txHash: bridgeTx.transactionHash,
      orderId: quote.orderId
    }
  } catch (error) {
    console.error('[deBridge-ETH] Bridge transaction failed:', error)
    throw new Error(`Bridge transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * deBridge Service Wrapper
 */
export const debridgeService = {
  getDeBridgeQuote,
  getDeBridgeOrderStatus,
  createDeBridgeOrderEthereum,
  createDeBridgeOrderSolana,
  createDeBridgeOrderTron,
  waitForOrderCompletion,
  bridgeTronToEthereum,
  bridgeEthereumToSolana
}
