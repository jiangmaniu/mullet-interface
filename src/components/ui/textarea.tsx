import * as React from 'react'

import { cn } from '@/utils/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-[#3B3D52] placeholder:text-[#767783] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full border bg-transparent  shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        'selection:bg-[#3B3D52] selection:text-white',
        'text-[14px] text-white',
        'min-h-20',
        'px-3.5 py-3',
        'rounded-[8px]',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
