import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/libs/ui/lib/utils'

const chipVariants = cva(
  [
    'inline-flex items-center justify-center rounded-xs px-xs py-0.5 text-paragraph-p3 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 transition-[color,box-shadow] overflow-hidden',
    'text-paragraph-p3'
  ],
  {
    variants: {
      variant: {
        solid: ''
      },
      color: {
        default: '',
        rise: '',
        fall: '',
        secondary: ''
      }
    },

    compoundVariants: [
      {
        color: 'default',
        variant: 'solid',
        class: 'bg-button text-content-1'
      },
      {
        color: 'rise',
        variant: 'solid',
        class: 'bg-market-rise text-content-foreground'
      },
      {
        color: 'fall',
        variant: 'solid',
        class: 'bg-market-fall text-content-1'
      },
      {
        color: 'secondary',
        variant: 'solid',
        class: 'bg-brand-support text-content-1'
      }
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'default'
    }
  }
)

function Chip({
  className,
  variant,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof chipVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return <Comp data-slot="chip" className={cn(chipVariants({ color, variant }), className)} {...props} />
}

export { Chip, chipVariants }
