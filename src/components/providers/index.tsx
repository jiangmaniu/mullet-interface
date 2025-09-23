// 'use client'

import type { PropsWithChildren } from 'react'
import { Toaster } from '../ui/toast'
import { NiceModalProvider } from './nice-modal-provider'
import { ReactQueryProvider } from './react-query-provider'
import { TooltipProvider } from './tooltip-provider'

export type ProvidersProps = PropsWithChildren<{}>

export function Providers({ children, ...props }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <NiceModalProvider>
        <TooltipProvider>
          <>{children}</>
          <Toaster />
        </TooltipProvider>
      </NiceModalProvider>
    </ReactQueryProvider>
  )
}
