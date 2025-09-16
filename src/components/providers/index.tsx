// 'use client'

import type { PropsWithChildren } from 'react'
import { ReactQueryProvider } from './react-query-provider'
import { TooltipProvider } from './tooltip-provider'

export type ProvidersProps = PropsWithChildren<{}>

export function Providers({ children, ...props }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <TooltipProvider>
        <>{children}</>
      </TooltipProvider>
    </ReactQueryProvider>
  )
}
