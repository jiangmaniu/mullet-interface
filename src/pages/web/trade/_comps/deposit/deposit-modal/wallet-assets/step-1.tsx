import { Trans } from '@/libs/lingui/react/macro'
import { useMemo } from 'react'

import { IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { getTokenIcon } from '@/config/tokenIcons'

import { SUPPORTED_BRIDGE_CHAINS, SUPPORTED_TOKENS } from '@/config/lifiConfig'
import { cn } from '@/libs/ui/lib/utils'
import { Iconify } from '@/libs/ui/components/icons'

// Mock Data for demonstration matching the screenshot
export const MOCK_BALANCES: Record<string, { balance: string; fiat: string; status?: 'insufficient' | 'n/a' }> = {
  'USDC:Solana': { balance: '153,568.00', fiat: '$153,568.00', status: undefined },
  'USDC:Ethereum': { balance: '153,568.00', fiat: '$153,568.00', status: 'n/a' },
  'USDC:Arbitrum': { balance: '0.00', fiat: '$0.00', status: 'insufficient' }
}

export const WalletAssetsStep1 = ({
  onBack,
  onSelect
}: {
  onBack: () => void
  onSelect: (asset: { symbol: string; chainName: string }) => void
}) => {
  const options: Array<{ symbol: string; chainId: string; chainName: string; token: any }> = [
    {
      symbol: 'USDC',
      chainId: 'solana',
      chainName: 'Solana',
      token: {
        symbol: 'USDC',
        chainId: 'solana',
        chainName: 'Solana'
      }
    }
  ]

  const allTokenOptions = useMemo(() => {
    SUPPORTED_BRIDGE_CHAINS.forEach((chain) => {
      const tokens = SUPPORTED_TOKENS[chain.id as keyof typeof SUPPORTED_TOKENS]
      if (tokens) {
        tokens.forEach((token) => {
          options.push({
            symbol: token.symbol,
            chainId: chain.id,
            chainName: chain.displayName,
            token
          })
        })
      }
    })
    return options
  }, [])

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center justify-between w-full">
          <div className="flex items-center gap-medium">
            <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
              <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
            </IconButton>
            <Trans>选择要兑换的资产</Trans>
          </div>
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {allTokenOptions.map((option) => {
          const key = `${option.symbol}:${option.chainName}`
          // Mock data logic for visualization
          // In real app, this comes from store/balance hooks
          const mockData = MOCK_BALANCES[key] || { balance: '0.00', fiat: '$0.00', status: undefined }
          const isInsufficient = mockData.status === 'insufficient'
          const isNA = mockData.status === 'n/a'
          const disabled = isInsufficient || isNA

          return (
            <div
              key={key}
              onClick={() => !disabled && onSelect({ symbol: option.symbol, chainName: option.chainName })}
              className={cn(
                'group flex items-center justify-between gap-2 px-xl py-medium rounded-small border border-default transition-all cursor-pointer',
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-zinc-base hover:shadow-base active:shadow-inset-base active:border-white'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Icon with Badge */}
                <div className="relative">
                  <img src={getTokenIcon(option.symbol)} className="size-6 rounded-full bg-white object-contain" alt={option.symbol} />
                </div>

                <div className="flex flex-col gap-xs">
                  <div className="text-paragraph-p2 text-content-1">{option.symbol}</div>
                  <div className="text-paragraph-p3 text-content-4">
                    {mockData.balance} {option.symbol}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-small">
                {isNA || isInsufficient ? (
                  <span className="px-xs py-0.5 rounded-xs text-paragraph-p3 bg-button text-content-1">
                    {isNA ? <Trans>不适用</Trans> : <Trans>余额不足</Trans>}
                  </span>
                ) : null}

                <div className={cn('text-paragraph-p2')}>{mockData.fiat}</div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
