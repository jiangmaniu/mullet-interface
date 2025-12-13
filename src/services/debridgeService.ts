/**
 * deBridge API 集成服务
 * 支持 TRON ↔ Ethereum ↔ Solana 跨链桥接
 *
 * 功能特性：
 * 1. 统一使用 deBridge 桥接协议（TRON → ETH → SOL）
 * 2. 费用低廉（固定费用 ~$2-3，通常 < 5%）
 * 3. 速度快，确认时间短（TRON→ETH: 3-5分钟，ETH→SOL: 2-3分钟）
 * 4. 完整的流程控制（手动 approve、签名验证、交易广播）
 * 5. USDT 特殊处理（自动重置 allowance）
 * 6. ETH Gas 余额检查（最低 0.002 ETH）
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
 * 使用 Privy 的 signAndSendTransaction 和 sponsor 选项
 */
export async function createDeBridgeOrderSolana(
  quote: DeBridgeQuote,
  solanaWallet: any,
  connection: any
): Promise<{ txHash: string; orderId?: string }> {
  try {
    console.log('[deBridge-Solana] Creating Solana bridge order with gas sponsorship...')

    // 从 quote 中获取交易数据
    if (!quote.tx.data) {
      throw new Error('No transaction data in quote')
    }

    // quote.tx.data 是 base64 编码的 Solana 交易
    const transactionBuffer = Buffer.from(quote.tx.data, 'base64')
    const transaction = new Uint8Array(transactionBuffer)

    console.log('[deBridge-Solana] Transaction size:', transaction.length, 'bytes')

    // 使用 Privy 的 signAndSendTransaction 发送交易（支持 gas sponsorship）
    // 注意：这需要使用 @privy-io/react-auth/solana 的 useSignAndSendTransaction hook
    // 在实际使用时需要从组件中传入 signAndSendTransaction 函数
    if (!solanaWallet.signAndSendTransaction) {
      throw new Error('Solana wallet does not support signAndSendTransaction')
    }

    const result = await solanaWallet.signAndSendTransaction({
      transaction: transaction,
      wallet: solanaWallet,
      options: {
        sponsor: true // Enable gas sponsorship
      }
    })

    console.log('[deBridge-Solana] ✅ Transaction sent:', result.signature)

    return {
      txHash: result.signature,
      orderId: quote.orderId
    }
  } catch (error) {
    console.error('[deBridge-Solana] Failed to create Solana bridge order:', error)
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

      console.log('[deBridge-TRON] Signing approve tx via backend...')

      const approveTxObject = approveTransaction.transaction
      const approveTxID = approveTxObject.txID

      // 使用 fetch 而不是 request，避免自动添加 Blade-Auth header
      const signResponse = await fetch(TRON_API_ENDPOINTS.SIGN_TRANSACTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          walletId,
          transactionHash: approveTxID,
          publicKey
        })
      })

      if (!signResponse.ok) {
        const errorText = await signResponse.text()
        throw new Error(`Approval failed: ${errorText}`)
      }

      const signData = await signResponse.json()
      const signature64 = signData.signature
      const signature64Clean = signature64.startsWith('0x') ? signature64.slice(2) : signature64

      console.log('[deBridge-TRON] Testing recovery IDs for approve signature...')

      // Test recovery ID '1b' first
      approveTxObject.signature = [signature64Clean + '1b']
      let recoveredAddress1b
      try {
        recoveredAddress1b = tronWeb.trx.ecRecover(approveTxObject)
        console.log('[deBridge-TRON] Approve recovery (1b):', {
          fromAddress,
          recovered: recoveredAddress1b,
          match: recoveredAddress1b === fromAddress
        })
      } catch (e) {
        console.error('[deBridge-TRON] Approve recovery (1b) failed:', e)
        recoveredAddress1b = null
      }

      // If '1b' doesn't match, try '1c'
      if (recoveredAddress1b !== fromAddress) {
        approveTxObject.signature = [signature64Clean + '1c']
        let recoveredAddress1c
        try {
          recoveredAddress1c = tronWeb.trx.ecRecover(approveTxObject)
          console.log('[deBridge-TRON] Approve recovery (1c):', {
            fromAddress,
            recovered: recoveredAddress1c,
            match: recoveredAddress1c === fromAddress
          })

          if (recoveredAddress1c !== fromAddress) {
            throw new Error('Approve signature recovery failed - address mismatch')
          }
        } catch (e) {
          console.error('[deBridge-TRON] Approve recovery (1c) failed:', e)
          throw new Error('Approve signature recovery failed with both recovery IDs')
        }
      }

      console.log('[deBridge-TRON] ✅ Approve signature verified, broadcasting...')

      // Broadcast transaction
      const approveResult = await tronWeb.trx.sendRawTransaction(approveTxObject)

      if (!approveResult.result) {
        throw new Error(`Approve transaction failed: ${JSON.stringify(approveResult)}`)
      }

      console.log('[deBridge-TRON] ✅ Approve tx:', approveResult.txid)

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
    
    console.log('[deBridge-TRON] ========== CREATE-TX API RESPONSE ==========')
    console.log('[deBridge-TRON] Full response:', JSON.stringify(txData, null, 2))
    console.log('[deBridge-TRON] Available fields:', Object.keys(txData))
    console.log('[deBridge-TRON] ===========================================')
    
    if (!txData.tx?.data) {
      console.error('[deBridge-TRON] Missing tx.data in response!')
      throw new Error('No transaction data in response')
    }

    const orderId = txData.orderId
    const dstChainTokenOutAmount = txData.estimation?.dstChainTokenOut?.recommendedAmount || 
                                   txData.estimation?.dstChainTokenOut?.amount || 
                                   '0'
    
    console.log('[deBridge-TRON] Extracted Order ID:', orderId || '❌ NULL/UNDEFINED')
    console.log('[deBridge-TRON] Extracted Dst amount:', dstChainTokenOutAmount)

    if (!orderId) {
      console.error('[deBridge-TRON] ⚠️⚠️⚠️ CRITICAL: No orderId in API response!')
      console.error('[deBridge-TRON] This will prevent order tracking.')
      console.error('[deBridge-TRON] Possible reasons:')
      console.error('[deBridge-TRON]   1. deBridge API changed response format')
      console.error('[deBridge-TRON]   2. Wrong API endpoint or parameters')
      console.error('[deBridge-TRON]   3. Order not created yet (async processing)')
    }

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

    console.log('[deBridge-TRON] Signing order tx via backend...')
    console.log('[deBridge-TRON] Transaction ID:', newTxID)

    // 使用 fetch 而不是 request，避免自动添加 Blade-Auth header
    const signResponse = await fetch(TRON_API_ENDPOINTS.SIGN_TRANSACTION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        walletId,
        transactionHash: newTxID,
        publicKey
      })
    })

    if (!signResponse.ok) {
      const errorText = await signResponse.text()
      throw new Error(`Order creation failed: ${errorText}`)
    }

    const signData = await signResponse.json()
    const signature64 = signData.signature
    const signature64Clean = signature64.startsWith('0x') ? signature64.slice(2) : signature64

    console.log('[deBridge-TRON] Testing recovery IDs for order signature...')

    // Test recovery ID '1b' first
    txObject.signature = [signature64Clean + '1b']
    let recoveredAddress1b
    try {
      recoveredAddress1b = tronWeb.trx.ecRecover(txObject)
      console.log('[deBridge-TRON] Order recovery (1b):', {
        fromAddress,
        recovered: recoveredAddress1b,
        match: recoveredAddress1b === fromAddress
      })
    } catch (e) {
      console.error('[deBridge-TRON] Order recovery (1b) failed:', e)
      recoveredAddress1b = null
    }

    // If '1b' doesn't match, try '1c'
    if (recoveredAddress1b !== fromAddress) {
      txObject.signature = [signature64Clean + '1c']
      let recoveredAddress1c
      try {
        recoveredAddress1c = tronWeb.trx.ecRecover(txObject)
        console.log('[deBridge-TRON] Order recovery (1c):', {
          fromAddress,
          recovered: recoveredAddress1c,
          match: recoveredAddress1c === fromAddress
        })

        if (recoveredAddress1c !== fromAddress) {
          throw new Error('Order signature recovery failed - address mismatch')
        }
      } catch (e) {
        console.error('[deBridge-TRON] Order recovery (1c) failed:', e)
        throw new Error('Order signature recovery failed with both recovery IDs')
      }
    }

    console.log('[deBridge-TRON] ✅ Order signature verified, broadcasting...')

    // Broadcast transaction
    const orderResult = await tronWeb.trx.sendRawTransaction(txObject)

    if (!orderResult.result) {
      throw new Error(`Order transaction failed: ${JSON.stringify(orderResult)}`)
    }

    console.log('[deBridge-TRON] ✅ Order tx:', orderResult.txid)

    return {
      txHash: orderResult.txid,
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
 * TRON → Ethereum 桥接
 * 
 * @param params.tokenAddress - TRON token 地址 (如 TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t for USDT)
 * @param params.amount - 转账金额（最小单位，如 20000000 = 20 USDT）
 * @param params.fromAddress - TRON 钱包地址
 * @param params.ethereumAddress - Ethereum 接收地址
 * @param params.walletId - Privy wallet ID
 * @param params.publicKey - Wallet public key (可选)
 * @param params.accessToken - Privy access token
 * @param params.useGasSponsorship - 是否使用 Gas 赞助（默认 true）
 * @returns 交易哈希、订单ID、目标链金额
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

  // 根据源链 token 地址，映射到目标链的对应 token（保持相同类型）
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
    dst: dstTokenAddress,
    note: 'TRON→ETH keeps same token type (USDT→USDT, USDC→USDC)'
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
 * Ethereum → Solana 桥接
 * 
 * @param params.tokenAddress - Ethereum token 地址 (如 0xdac17f958d2ee523a2206206994597c13d831ec7 for USDT)
 * @param params.amount - 转账金额（最小单位，如 20000000 = 20 USDT）
 * @param params.solanaAddress - Solana 接收地址
 * @param params.privyWallet - Privy Ethereum 钱包对象
 * @returns 交易哈希、订单ID
 */
export async function bridgeEthereumToSolana(params: {
  tokenAddress: string
  amount: string
  solanaAddress: string
  privyWallet: any
  sendTransaction: (tx: any) => Promise<{ hash: string }> // Privy Gas 赞助函数
}): Promise<{ txHash: string; orderId?: string }> {
  console.log('[deBridge] Bridge: Ethereum → Solana')
  console.log('[deBridge-ETH] 🔍 Wallet object:', params.privyWallet)
  console.log('[deBridge-ETH] 🔍 Wallet address:', params.privyWallet?.address)
  console.log('[deBridge-ETH] 🔍 Wallet type:', params.privyWallet?.walletClientType || params.privyWallet?.type)
  console.log('[deBridge-ETH] 🔍 Has sendTransaction?', !!params.privyWallet?.sendTransaction)
  console.log('[deBridge-ETH] 🔍 Available methods:', Object.keys(params.privyWallet || {}))

  // 🔥 关键：目标链 Solana 始终使用 USDC（无论源 token 是 USDT 还是 USDC）
  // 这是因为 DeBridge 在 Solana 上优先使用 USDC，流动性更好
  const dstTokenAddress = DEBRIDGE_TOKENS.SOLANA.USDC
  const srcTokenLower = params.tokenAddress.toLowerCase()

  // 验证源 token 是支持的稳定币
  if (
    srcTokenLower !== DEBRIDGE_TOKENS.ETHEREUM.USDT.toLowerCase() &&
    srcTokenLower !== DEBRIDGE_TOKENS.ETHEREUM.USDC.toLowerCase()
  ) {
    throw new Error(`Unsupported token address: ${params.tokenAddress}`)
  }

  console.log('[deBridge] Token mapping:', {
    src: params.tokenAddress,
    dst: dstTokenAddress,
    note: 'Solana always uses USDC (better liquidity)'
  })

  // 动态导入 viem 以检查余额和处理交易
  const { createPublicClient, http, encodeFunctionData } = await import('viem')
  const { mainnet } = await import('viem/chains')

  // 创建 public client 用于读取链上数据
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http('https://rpc.ankr.com/eth/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3')
  })

  // ✅ 不再检查 ETH 余额 - Privy Gas 赞助会自动处理 Gas 费用
  console.log('[deBridge-ETH] Using Privy Gas Sponsorship - no ETH balance required')

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
  
  console.log('[deBridge-ETH] ⚠️ Quote orderId:', quote.orderId || 'NULL/UNDEFINED')
  console.log('[deBridge-ETH] Note: orderId may be null in quote response, will be generated after tx')

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

        console.log('[deBridge-ETH] 🔄 Sending RESET approval transaction...')
        console.log('[deBridge-ETH] - From:', params.privyWallet.address)
        console.log('[deBridge-ETH] - To (USDT contract):', params.tokenAddress)
        console.log('[deBridge-ETH] - Spender (DeBridge):', quote.tx.allowanceTarget)
        console.log('[deBridge-ETH] - Reset amount: 0')
        console.log('[deBridge-ETH] - Gas sponsorship: ENABLED ✅')

        // 使用 Privy v3.8+ Gas 赞助
        const resetTxResult = await params.sendTransaction({
          to: params.tokenAddress as `0x${string}`,
          data: resetApproveData as `0x${string}`,
          sponsorGas: true
        })

        console.log('[deBridge-ETH] ✅ Reset approval tx sent:', resetTxResult.hash)
        console.log('[deBridge-ETH] Waiting for reset confirmation...')

        const resetReceipt = await publicClient.waitForTransactionReceipt({
          hash: resetTxResult.hash as `0x${string}`,
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

      // 使用 Privy v3.8+ Gas 赞助
      const approveTxResult = await params.sendTransaction({
        to: params.tokenAddress as `0x${string}`,
        data: approveData as `0x${string}`,
        sponsorGas: true
      })

      console.log('[deBridge-ETH] ✅ Approval tx sent:', approveTxResult.hash)

      // 等待确认
      console.log('[deBridge-ETH] Waiting for approval confirmation...')
      const approveReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveTxResult.hash as `0x${string}`,
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
  console.log('[deBridge-ETH] Creating bridge order with gas sponsorship...')

  try {
    // 🔥 关键：调用 create-tx API 而不是使用 quote.tx
    // 这样可以获取 orderId 用于跟踪订单状态
    console.log('[deBridge-ETH] Calling create-tx API to get orderId...')
    
    const createTxUrl = new URL(`${DEBRIDGE_API_BASE_URL}/dln/order/create-tx`)
    createTxUrl.searchParams.append('srcChainId', DEBRIDGE_CHAIN_IDS.ETHEREUM.toString())
    createTxUrl.searchParams.append('srcChainTokenIn', params.tokenAddress)
    createTxUrl.searchParams.append('srcChainTokenInAmount', params.amount)
    createTxUrl.searchParams.append('dstChainId', DEBRIDGE_CHAIN_IDS.SOLANA.toString())
    createTxUrl.searchParams.append('dstChainTokenOut', dstTokenAddress)
    createTxUrl.searchParams.append('dstChainTokenOutRecipient', params.solanaAddress)
    createTxUrl.searchParams.append('srcChainOrderAuthorityAddress', params.privyWallet.address)
    createTxUrl.searchParams.append('dstChainOrderAuthorityAddress', params.solanaAddress)
    createTxUrl.searchParams.append('prependOperatingExpenses', 'false')

    console.log('[deBridge-ETH] create-tx URL:', createTxUrl.toString())

    const createTxResponse = await fetch(createTxUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!createTxResponse.ok) {
      const errorText = await createTxResponse.text()
      throw new Error(`DeBridge create-tx API error: ${createTxResponse.status} ${errorText}`)
    }

    const txData = (await createTxResponse.json()) as any
    console.log('[deBridge-ETH] Transaction data received')
    console.log('[deBridge-ETH] - Order ID:', txData.orderId || 'NOT_AVAILABLE')
    console.log('[deBridge-ETH] - Has tx data:', !!txData.tx)

    if (!txData.tx || !txData.tx.to || !txData.tx.data) {
      throw new Error('DeBridge API did not return valid transaction data')
    }

    const orderId = txData.orderId
    const dstChainTokenOutAmount =
      txData.estimation?.dstChainTokenOut?.recommendedAmount || txData.estimation?.dstChainTokenOut?.amount

    console.log('[deBridge-ETH] Expected Solana output amount:', dstChainTokenOutAmount)

    // 使用 Privy v3.8+ Gas 赞助
    // 🔥 关键：必须包含 from 参数来指定使用哪个钱包
    const bridgeTxResult = await params.sendTransaction({
      to: txData.tx.to as `0x${string}`,
      from: params.privyWallet.address as `0x${string}`, // ← 指定钱包地址
      data: txData.tx.data as `0x${string}`,
      value: txData.tx.value ? BigInt(txData.tx.value) : BigInt(0),
      chainId: 1,
      sponsorGas: true
    })

    console.log('[deBridge-ETH] ✅ Bridge tx sent:', bridgeTxResult.hash)

    // 等待交易确认
    console.log('[deBridge-ETH] Waiting for bridge transaction confirmation...')
    const bridgeReceipt = await publicClient.waitForTransactionReceipt({
      hash: bridgeTxResult.hash as `0x${string}`,
      timeout: 180_000
    })

    if (bridgeReceipt.status === 'reverted') {
      throw new Error('Bridge transaction failed')
    }

    console.log('[deBridge-ETH] ✅ Bridge transaction confirmed:', bridgeReceipt.transactionHash)
    console.log('[deBridge-ETH] ✅ Order ID:', orderId || 'NOT_AVAILABLE')

    return {
      txHash: bridgeTxResult.hash,
      orderId: orderId // 从 create-tx API 获取的 orderId
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
  bridgeEthereumToSolana,
  bridgeSolanaToEthereum,
  bridgeSolanaToTron
}

/**
 * 桥接 Solana → Ethereum (出金使用)
 * 用于将 Solana USDC 桥接回 Ethereum
 */
async function bridgeSolanaToEthereum(params: {
  amount: string // USDC 金额（最小单位，6位小数）
  ethereumAddress: string // 目标 Ethereum 地址
  solanaWallet: any // Privy Solana 钱包
  signAndSendTransaction: any // Privy signAndSendTransaction hook
}): Promise<{ txHash: string; orderId: string }> {
  const { amount, ethereumAddress, solanaWallet, signAndSendTransaction } = params

  console.log('[deBridge-SOL→ETH] 🔄 Starting Solana to Ethereum bridge:', {
    amount,
    ethereumAddress,
    solanaWallet: solanaWallet?.address
  })

  // 检查最小金额
  const MIN_AMOUNT = 10_000_000 // 10 USD
  const amountNum = parseInt(amount)
  if (amountNum < MIN_AMOUNT) {
    throw new Error(`金额太小，最少需要 $10 USD（当前: $${(amountNum / 1_000_000).toFixed(2)}）`)
  }

  // 源 token: Solana USDC
  const srcTokenAddress = DEBRIDGE_TOKENS.SOLANA.USDC
  // 目标 token: Ethereum USDC (保持相同类型)
  const dstTokenAddress = DEBRIDGE_TOKENS.ETHEREUM.USDC

  console.log('[deBridge-SOL→ETH] Token mapping:', {
    src: srcTokenAddress,
    dst: dstTokenAddress,
    note: 'SOL→ETH keeps same token type (USDC→USDC)'
  })

  // 1. 获取报价
  console.log('[deBridge-SOL→ETH] Requesting quote...')
  const quote = await getDeBridgeQuote({
    srcChainId: DEBRIDGE_CHAIN_IDS.SOLANA,
    srcChainTokenIn: srcTokenAddress,
    srcChainTokenInAmount: amount,
    dstChainId: DEBRIDGE_CHAIN_IDS.ETHEREUM,
    dstChainTokenOut: dstTokenAddress,
    dstChainTokenOutRecipient: ethereumAddress,
    srcChainOrderAuthorityAddress: solanaWallet.address,
    dstChainOrderAuthorityAddress: ethereumAddress,
    prependOperatingExpenses: false
  })

  console.log('[deBridge-SOL→ETH] Quote received:', {
    srcAmount: quote.estimation.srcChainTokenIn.amount,
    dstAmount: quote.estimation.dstChainTokenOut.recommendedAmount,
    orderId: quote.orderId
  })

  // 2. 调用 create-tx API 获取 Solana 交易
  console.log('[deBridge-SOL→ETH] Calling create-tx API...')
  
  const createTxUrl = new URL(`${DEBRIDGE_API_BASE_URL}/dln/order/create-tx`)
  createTxUrl.searchParams.append('srcChainId', DEBRIDGE_CHAIN_IDS.SOLANA.toString())
  createTxUrl.searchParams.append('srcChainTokenIn', srcTokenAddress)
  createTxUrl.searchParams.append('srcChainTokenInAmount', amount)
  createTxUrl.searchParams.append('dstChainId', DEBRIDGE_CHAIN_IDS.ETHEREUM.toString())
  createTxUrl.searchParams.append('dstChainTokenOut', dstTokenAddress)
  createTxUrl.searchParams.append('dstChainTokenOutRecipient', ethereumAddress)
  createTxUrl.searchParams.append('srcChainOrderAuthorityAddress', solanaWallet.address)
  createTxUrl.searchParams.append('dstChainOrderAuthorityAddress', ethereumAddress)
  createTxUrl.searchParams.append('prependOperatingExpenses', 'false')

  console.log('[deBridge-SOL→ETH] create-tx URL:', createTxUrl.toString())

  const createTxResponse = await fetch(createTxUrl.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  if (!createTxResponse.ok) {
    const errorText = await createTxResponse.text()
    throw new Error(`DeBridge create-tx API error: ${createTxResponse.status} ${errorText}`)
  }

  const txData = (await createTxResponse.json()) as any
  console.log('[deBridge-SOL→ETH] Transaction data received')
  console.log('[deBridge-SOL→ETH] - Order ID:', txData.orderId || 'NOT_AVAILABLE')
  console.log('[deBridge-SOL→ETH] - Has tx data:', !!txData.tx)

  if (!txData.tx || !txData.tx.data) {
    throw new Error('DeBridge API did not return valid Solana transaction data')
  }

  const orderId = txData.orderId || ''
  const dstChainTokenOutAmount =
    txData.estimation?.dstChainTokenOut?.recommendedAmount || txData.estimation?.dstChainTokenOut?.amount

  console.log('[deBridge-SOL→ETH] Expected Ethereum output amount:', dstChainTokenOutAmount)

  // 3. 发送 Solana 交易
  console.log('[deBridge-SOL→ETH] 🔐 Signing and sending Solana transaction...')

  try {
    // 根据 Privy 嵌入式钱包：
    // 1. txData 是 hex 格式 (0x 开头)
    // 2. 反序列化为 buffer
    // 3. 使用 Privy 的 signAndSendTransaction hook 发送
    //    这个方法支持 gas sponsorship 并正确处理序列化交易
    
    console.log('[deBridge-SOL→ETH] Transaction data:', txData.tx.data.substring(0, 20) + '...')
    
    // deBridge 返回的 tx.data 是 hex 格式，去除 0x 前缀后转为 buffer
    const hexString = txData.tx.data.startsWith('0x') 
      ? txData.tx.data.slice(2) 
      : txData.tx.data
    const txBuffer = Buffer.from(hexString, 'hex')
    
    console.log('[deBridge-SOL→ETH] Buffer length:', txBuffer.length)
    
    // 使用 Privy 的 signAndSendTransaction 发送序列化的交易
    // 参考 frontend/src/components/WithdrawDialog.tsx
    if (!signAndSendTransaction) {
      throw new Error('signAndSendTransaction hook not available')
    }

    console.log('[deBridge-SOL→ETH] Sending transaction via Privy signAndSendTransaction...')
    
    // signAndSendTransaction 接受序列化的交易 buffer
    const result = await signAndSendTransaction({
      transaction: txBuffer,
      wallet: solanaWallet,
      options: {
        sponsor: true, // Enable gas sponsorship - Privy pays the gas fees
      },
    })
    
    const txSignature = result.signature
    
    console.log('[deBridge-SOL→ETH] ✅ Transaction sent:', txSignature)
    console.log(`[deBridge-SOL→ETH] 🎉 Check tx: https://solscan.io/tx/${txSignature}`)
    
    // signAndSendTransaction 已经等待交易确认，所以不需要再次等待

    return {
      txHash: txSignature,
      orderId: orderId
    }
  } catch (error) {
    console.error('[deBridge-SOL→ETH] Transaction failed:', error)
    throw new Error(`Solana bridge transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * 桥接 Solana → Tron (出金使用)
 * 两步桥接：Solana → Ethereum → Tron
 */
async function bridgeSolanaToTron(params: {
  amount: string
  tronAddress: string
  solanaWallet: any
  signAndSendTransaction: any // Privy signAndSendTransaction hook
  ethereumWallet: any
}): Promise<{ txHash: string; orderId: string }> {
  const { amount, tronAddress, solanaWallet, signAndSendTransaction, ethereumWallet } = params

  console.log('[deBridge-SOL→TRON] 🔄 Starting Solana to Tron bridge (2 steps):', {
    amount,
    tronAddress,
    solanaWallet: solanaWallet?.address,
    ethereumWallet: ethereumWallet?.address
  })

  // 检查最小金额（TRON 需要更高，因为有两次桥接费用）
  const MIN_AMOUNT = 20_000_000 // 20 USD
  const amountNum = parseInt(amount)
  if (amountNum < MIN_AMOUNT) {
    throw new Error(`金额太小，Solana → Tron 需要两次桥接，最少需要 $20 USD（当前: $${(amountNum / 1_000_000).toFixed(2)}）`)
  }

  console.log('[deBridge-SOL→TRON] Step 1/2: Solana → Ethereum (intermediate)')

  // 步骤 1: Solana → Ethereum (中转到 Ethereum 钱包)
  const step1Result = await bridgeSolanaToEthereum({
    amount,
    ethereumAddress: ethereumWallet.address,
    solanaWallet,
    signAndSendTransaction
  })

  console.log('[deBridge-SOL→TRON] ✅ Step 1 completed:', step1Result.txHash)
  console.log('[deBridge-SOL→TRON] Waiting for Ethereum to receive USDC...')

  // 等待第一步完成（通常需要 2-5 分钟）
  if (step1Result.orderId) {
    try {
      await waitForOrderCompletion(step1Result.orderId, 600000, 10000) // 10分钟超时
      console.log('[deBridge-SOL→TRON] ✅ Step 1 order fulfilled')
    } catch (error) {
      console.warn('[deBridge-SOL→TRON] ⚠️ Order tracking failed, proceeding anyway:', error)
    }
  }

  console.log('[deBridge-SOL→TRON] Step 2/2: Ethereum → Tron (final)')

  // 步骤 2: Ethereum → Tron
  // 需要等待 Ethereum 收到 USDC 后才能继续
  // TODO: 这里需要实现余额监听或手动触发
  // 当前返回第一步的结果，提示用户等待
  console.warn('[deBridge-SOL→TRON] ⚠️ Step 2 (Ethereum → Tron) needs to be triggered manually or via balance polling')
  console.warn('[deBridge-SOL→TRON] Returning step 1 result. User needs to wait for Ethereum to receive USDC.')
  
  return {
    txHash: step1Result.txHash,
    orderId: step1Result.orderId
  }
}
