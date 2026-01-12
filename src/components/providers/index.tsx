// 'use client'

import type { PropsWithChildren } from 'react'
import { Toaster } from '../ui/toast'
import { NiceModalProvider } from './nice-modal-provider'
import { PrivyProvider } from './privy-provider'
import { ReactQueryProvider } from './react-query-provider'
import { TooltipProvider } from './tooltip-provider'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'

export type ProvidersProps = PropsWithChildren<{}>

export function Providers({ children, ...props }: ProvidersProps) {
  return (
    <NuqsAdapter>
      <ReactQueryProvider>
        <PrivyProvider>
          <NiceModalProvider>
            <TooltipProvider>
              <>{children}</>
              <Toaster />
            </TooltipProvider>
          </NiceModalProvider>
        </PrivyProvider>
      </ReactQueryProvider>
    </NuqsAdapter>
  )
}
