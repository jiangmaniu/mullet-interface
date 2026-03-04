/**
 * Deposit Service
 * 统一封装 /api/deposit/* 接口
 *
 * 接口列表：
 *   GET /api/deposit/supportedChains  - 支持的链列表（含 iconUrl、minDeposit）
 *   GET /api/deposit/supportedTokens  - 支持的币种列表（含 iconUrl、displayDecimals）
 *   GET /api/deposit/address          - 获取/自动创建充值地址（需要 Bearer token）
 */

import { getAccessToken } from '@privy-io/react-auth'

const API_BASE = process.env.BACKEND_API_URL || 'https://api.mulletfinance.xyz'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DepositChainId = 'SOL' | 'ETH' | 'TRON'

export interface DepositTokenConfig {
  symbol: string
  contractAddress: string
  decimals: number
  displayDecimals: number
  displayName: string
  iconUrl: string
  minDeposit?: string // 按链查询时才有
}

export interface DepositChainConfig {
  chainId: DepositChainId
  displayName: string
  shortName: string
  icon: string
  iconUrl: string
  nativeToken: string
  minDeposit: string
  estimatedTime: string
  requiresBridge: boolean
  supportedTokens: DepositTokenConfig[]
}

export interface DepositTokenWithChains extends Omit<DepositTokenConfig, 'minDeposit'> {
  supportedChains: DepositChainId[]
}

export interface DepositAddressResult {
  chain: DepositChainId
  displayName: string
  shortName: string
  icon: string
  iconUrl: string
  address: string
  walletId: string
  walletCreated: boolean
  justCreated: boolean
  nativeToken: string
  supportedTokens: DepositTokenConfig[]
  requiresBridge: boolean
  minDeposit: string
  estimatedTime: string
  tips: string[]
}

// ─── API helpers ───────────────────────────────────────────────────────────────

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any)?.error || `HTTP ${res.status}`)
  }
  const json = await res.json() as { success: boolean; data: T }
  return json.data
}

async function getWithAuth<T>(path: string, params?: Record<string, string>): Promise<T> {
  const token = await getAccessToken()
  if (!token) throw new Error('Not authenticated')

  const url = new URL(`${API_BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any)?.error || `HTTP ${res.status}`)
  }
  const json = await res.json() as { success: boolean; data: T }
  return json.data
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * GET /api/deposit/supportedChains
 * @param token 可选：按币种过滤（USDC / USDT）
 */
export async function getSupportedChains(token?: string): Promise<DepositChainConfig[]> {
  return get<DepositChainConfig[]>('/api/deposit/supportedChains', token ? { token } : undefined)
}

/**
 * GET /api/deposit/supportedTokens
 * @param chain 可选：按链过滤（SOL / ETH / TRON）
 */
export async function getSupportedTokens(chain?: DepositChainId): Promise<DepositTokenWithChains[] | DepositTokenConfig[]> {
  return get('/api/deposit/supportedTokens', chain ? { chain } : undefined)
}

/**
 * GET /api/deposit/address
 * 自动 check → create，前端调一次即可，无需先调 create 接口
 * @param chain   链 ID：SOL / ETH / TRON
 * @param tradeAccountId  交易账户 ID
 */
export async function getDepositAddress(chain: DepositChainId, tradeAccountId: string): Promise<DepositAddressResult> {
  return getWithAuth<DepositAddressResult>('/api/deposit/address', { chain, tradeAccountId })
}

// ─── Solana Balance ───────────────────────────────────────────────────────────

export interface SolanaTokenBalance {
  /** 格式化后的余额字符串（如 "54.030880"） */
  balance: string
  /** USD 估值 */
  usdValue: number
  /** 该 token 余额估值低于 $10 */
  insufficient: boolean
}

export interface SolanaBalanceResult {
  address: string
  solPrice: number
  totalUsdValue: number
  insufficientBalance: boolean
  insufficientBalanceMessage?: string
  /** { SOL: [usdValue, amount, insufficient], USDC: [...], USDT: [...] } */
  balances: Record<string, [number, string, boolean]>
}

/**
 * GET /api/solana-wallet/balance?address=<address>
 * 公开接口（链上数据），无需认证
 * @param address  Solana 钱包地址
 */
export async function getSolanaBalance(address: string): Promise<SolanaBalanceResult> {
  const url = new URL(`${API_BASE}/api/solana-wallet/balance`)
  url.searchParams.set('address', address)
  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any)?.error || `HTTP ${res.status}`)
  }
  return res.json() as Promise<SolanaBalanceResult>
}
