/**
 * Token Icon URLs Configuration
 * 统一管理所有代币的图标 CDN 地址
 */

export const TOKEN_ICONS = {
  // Solana Tokens - Using CoinGecko CDN for consistent quality
  SOL: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  USDC_SOLANA:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  USDT_SOLANA: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  PYUSD_SOLANA: 'https://coin-images.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png',

  // Ethereum Tokens - Using CoinGecko CDN for consistent quality
  ETH: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
  USDC_ETHEREUM: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png',
  USDT_ETHEREUM: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  DAI: 'https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png',
  PYUSD_ETHEREUM: 'https://coin-images.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png',

  // TRON Tokens - Using CoinGecko CDN for consistent quality
  TRX: 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png',
  USDC_TRON: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png',
  USDT_TRON: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',

  // Generic (可用于任何链的 USDC/USDT/PYUSD) - Using CoinGecko CDN
  USDC: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  PYUSD: 'https://coin-images.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png'
} as const

/**
 * 根据代币符号和链获取图标 URL
 */
export function getTokenIcon(symbol: string, chain?: 'solana' | 'ethereum' | 'tron'): string {
  const key = `${symbol}_${chain?.toUpperCase()}` as keyof typeof TOKEN_ICONS

  // 尝试链特定的图标
  if (chain && key in TOKEN_ICONS) {
    return TOKEN_ICONS[key]
  }

  // 回退到通用图标
  if (symbol in TOKEN_ICONS) {
    return TOKEN_ICONS[symbol as keyof typeof TOKEN_ICONS]
  }

  // 默认返回一个占位符
  return ''
}

// 链图标配置
export const CHAIN_ICONS: Record<string, string> = {
  Ethereum: TOKEN_ICONS.ETH,
  Solana: TOKEN_ICONS.SOL,
  Tron: TOKEN_ICONS.TRX,
  // Cobo 托管链图标 (复用对应 Privy 链的图标)
  'Cobo-Ethereum': TOKEN_ICONS.ETH,
  'Cobo-Solana': TOKEN_ICONS.SOL,
  'Cobo-TRON': TOKEN_ICONS.TRX
}
