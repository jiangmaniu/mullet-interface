import * as React from 'react'
import type { ButtonProps } from './button'

import { cn } from '@/utils/cn'
import { buttonVariants } from './button'
import { Icons } from './icons'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav role="navigation" aria-label="pagination" className={cn('mx-auto flex w-full justify-center py-s', className)} {...props} />
}
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'div'> & {
    disabled?: boolean
  }

function PaginationLink({ className, isActive, disabled, ...props }: PaginationLinkProps) {
  return (
    <div
      aria-current={isActive ? 'page' : undefined}
      data-disabled={disabled}
      className={cn(
        buttonVariants({
          variant: isActive ? 'primary' : 'ghost',
          size: 'icon',
          className: cn('size-8 cursor-pointer select-none rounded-small', {
            'hover:bg-[#EED94C]': !isActive
          })
        }),
        className
      )}
      {...props}
    />
  )
}
PaginationLink.displayName = 'PaginationLink'

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" className={cn('gap-1', className)} {...props}>
      <Icons.lucide.ChevronLeft className="size-4" />
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" className={cn('gap-1', className)} {...props}>
      <Icons.lucide.ChevronRight className="size-4" />
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span aria-hidden className={cn('flex size-9 items-center justify-center', className)} {...props}>
      <Icons.lucide.Ellipsis className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}
PaginationEllipsis.displayName = 'PaginationEllipsis'

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious }
