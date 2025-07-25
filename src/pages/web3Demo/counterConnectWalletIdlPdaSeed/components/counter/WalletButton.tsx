'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function WalletButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <WalletMultiButton />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Devnet Only</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
