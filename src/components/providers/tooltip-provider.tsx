// 'use client'

import * as React from 'react'

import { TooltipProvider as TooltipProviderPrimitive } from '@/components/ui/tooltip'

export function TooltipProvider({ children, ...props }: React.ComponentProps<typeof TooltipProviderPrimitive>) {
  return (
    <TooltipProviderPrimitive delayDuration={100} skipDelayDuration={100} {...props}>
      {children}
    </TooltipProviderPrimitive>
  )
}
