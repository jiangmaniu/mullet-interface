import { QueryClientProvider, QueryOptions } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren } from 'react'

import { getQueryClient } from './get-query-client'

export type QueryOptionsParams = {
  enabled?: boolean
  refetchInterval?: number
}

export const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
