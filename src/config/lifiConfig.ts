/**
 * LiFi SDK Configuration
 * Centralized configuration for all LiFi integrators and RPC URLs
 * 用于支持多链跨链桥接功能
 */

// LiFi integrator configurations - rotate between multiple accounts to avoid rate limits
export const LIFI_INTEGRATORS = [
  { name: 'm1', apiKey: '0c0399a9-61bb-401b-9ccd-88de4b22e9c0.fd2cc714-1e85-438e-98d6-91e7a044b226' },
  { name: 'm2', apiKey: 'c3aef4e7-967b-42d8-b773-9395dbf0ac11.b2b1e2c0-1d97-471c-9278-b91040dc8de0' },
  { name: 'm3', apiKey: '4d465dea-3554-4f85-9a3e-4442388ab3bf.b45ef6e7-f8c2-472a-b058-602e7ed57567' },
  { name: 'm4', apiKey: '15d1648e-cc90-4426-b723-b17fbacfbf82.48e55d69-f8b0-4607-af61-1593ebd71bd8' },
  { name: 'm5', apiKey: 'f33beff2-ae5d-4b11-8680-4566e30b0584.bf2c6fa7-ac5f-4e5f-8e60-263793c02c45' },
  { name: 'm6', apiKey: '45a577f4-117f-4f6d-805b-c3a49de5fbe1.6d724b10-c870-49f5-99df-0531a871413a' },
  { name: 'm7', apiKey: '40a80666-eff9-4828-ab32-27fa5e22ac9f.e1a6bd9b-8363-4649-8ca6-08f4405ac708' },
  { name: 'm8', apiKey: '39c55617-f1b9-4251-bc51-8e011aa10276.b0c267e1-eb26-43e1-890a-2b87ce06fc64' },
  { name: 'm9', apiKey: 'e52b6e9d-f12a-42b3-8104-b2ae9a3a35bb.0c7750c4-c24e-4de6-85db-708c4d373b1e' },
  { name: 'm10', apiKey: 'e2db5dfe-2693-4c91-9375-ef691bd8c79f.38fe301e-9ef5-489a-8dd2-6e5a15e528cd' }
]

/**
 * Rotate integrator based on timestamp to distribute requests
 * 每分钟切换一个账号,分散请求避免限流
 */
export const getIntegrator = () => {
  const index = Math.floor(Date.now() / 60000) % LIFI_INTEGRATORS.length
  return LIFI_INTEGRATORS[index]
}

// Custom RPC URLs for different chains
export const CUSTOM_RPC_URLS = {
  // Ethereum Mainnet
  ethereum: 'https://rpc.ankr.com/eth/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3',

  // Solana Mainnet
  solana: 'https://rpc.ankr.com/solana/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3',

  // TRON Mainnet
  tron: 'https://rpc.ankr.com/premium-http/tron/6399319de5985a2ee9496b8ae8590d7bba3988a6fb28d4fc80cb1fbf9f039fb3'
}

// LiFi configuration defaults
export const LIFI_CONFIG = {
  fee: 0.0025, // 0.25% integrator fee
  feePercent: 0.25, // 0.25% for display
  slippage: 0.03, // 3% slippage tolerance
  order: 'FASTEST' as const, // Route ordering preference
  integrators: LIFI_INTEGRATORS, // Available integrators
  rpcUrls: CUSTOM_RPC_URLS // RPC URLs for chains
}

// Supported chains for cross-chain bridging
export const SUPPORTED_BRIDGE_CHAINS = [
  {
    id: 'tron',
    name: 'Tron',
    color: '#c62828',
    minDeposit: 20 // Tron桥接最低金额
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    color: '#627EEA',
    minDeposit: 3 // Ethereum桥接最低金额
  },
  {
    id: 'solana',
    name: 'Solana',
    color: '#14F195',
    minDeposit: 10 // Solana桥接最低金额
  }
] as const

// Supported tokens for each chain
export const SUPPORTED_TOKENS = {
  tron: [
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      decimals: 6
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
      decimals: 6
    }
  ],
  ethereum: [
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6
    }
  ],
  solana: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      decimals: 6
    }
  ]
} as const
