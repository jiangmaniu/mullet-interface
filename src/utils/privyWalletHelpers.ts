/**
 * Privy 钱包辅助函数
 * 用于安全地访问不同链的钱包
 */

import { ConnectedWallet } from '@privy-io/react-auth'

/**
 * 钱包类型扩展（包含实际存在的属性）
 */
interface ExtendedWallet extends ConnectedWallet {
  chainType?: 'ethereum' | 'solana' | 'tron' | string
}

/**
 * 根据链类型查找钱包
 */
export function findWalletByChain(wallets: ConnectedWallet[], chainType: 'ethereum' | 'solana' | 'tron'): ExtendedWallet | undefined {
  return (wallets as ExtendedWallet[]).find((w) => {
    // 类型断言以访问可能存在的属性
    const wallet = w as any
    return wallet?.chainType === chainType
  })
}

/**
 * 根据链类型和钱包客户端类型查找钱包
 */
export function findPrivyWalletByChain(wallets: ConnectedWallet[], chainType: 'ethereum' | 'solana' | 'tron'): ExtendedWallet | undefined {
  return (wallets as ExtendedWallet[]).find((w) => {
    const wallet = w as any
    return wallet?.walletClientType === 'privy' && wallet?.chainType === chainType
  })
}

/**
 * 检查是否有特定链的 Privy 嵌入式钱包
 */
export function hasPrivyEmbeddedWallet(wallets: ConnectedWallet[], chainType: 'ethereum' | 'solana' | 'tron'): boolean {
  const wallet = (wallets as ExtendedWallet[]).find((w) => {
    const wallet = w as any
    return wallet?.connectorType === 'embedded' && wallet?.chainType === chainType && wallet?.walletClientType === 'privy'
  })
  return !!wallet
}

/**
 * 获取所有 Privy 嵌入式钱包
 */
export function getAllPrivyEmbeddedWallets(wallets: ConnectedWallet[]): ExtendedWallet[] {
  return (wallets as ExtendedWallet[]).filter((w) => {
    const wallet = w as any
    return wallet?.connectorType === 'embedded' && wallet?.walletClientType === 'privy'
  })
}

/**
 * 安全地获取钱包的链类型
 */
export function getWalletChainType(wallet: ConnectedWallet): string | undefined {
  return (wallet as any)?.chainType
}

/**
 * 安全地获取钱包的客户端类型
 */
export function getWalletClientType(wallet: ConnectedWallet): string | undefined {
  return (wallet as any)?.walletClientType
}
