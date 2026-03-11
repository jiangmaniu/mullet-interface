import { useMemo } from 'react'

import { useDepositSupportedTokens } from '../../_apis/use-supported-tokens'
import { USDC_TOKEN_SYMBOL } from '@/constants/deposit'

export function useUSDCTokenConfig() {
  const { data: tokensConfig } = useDepositSupportedTokens()

  return useMemo(() => {
    return tokensConfig?.find((t) => t.symbol.toUpperCase() === USDC_TOKEN_SYMBOL.toUpperCase())
  }, [tokensConfig])
}
