'use client'

import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import * as React from 'react'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn('w-full caption-bottom text-main-paragraph', className)} {...props} />
    </div>
  )
}

function TableHeader({
  className,
  divider = false,
  ...props
}: React.ComponentProps<'thead'> & {
  divider?: boolean
}) {
  return <thead data-slot="table-header" className={cn(divider && '[&_tr]:border-b', className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

function TableFooter({
  className,
  divider = false,
  ...props
}: React.ComponentProps<'tfoot'> & {
  divider?: boolean
}) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('bg-muted/50 font-medium [&>tr]:last:border-b-0', divider && 'border-t', className)}
      {...props}
    />
  )
}

function TableRow({
  className,
  divider = false,
  ...props
}: React.ComponentProps<'tr'> & {
  divider?: boolean
}) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'data-[state=selected]:bg-muted transition-colors ',
        '[&>td:first-child]:pl-7 [&>td:last-child]:pr-7 [&>th:first-child]:pl-7 [&>th:last-child]:pr-7',
        divider && 'border-b',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  const tableHeadClassName = useEmotionCss(() => {
    return {
      'font-family': 'HarmonyOS Sans SC',
      'font-size': '12px',
      'font-weight': 'normal',
      'line-height': 'normal',
      'letter-spacing': '0em',
      'font-variation-settings': 'opsz auto',
      'font-feature-settings': 'kern on',
      color: '#9FA0B0'
    }
  })

  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-[#9FA0B0] h-10 py-2 text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        tableHeadClassName,
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  const tableCellClassName = useEmotionCss(() => {
    return {
      'font-family': 'HarmonyOS Sans SC',
      'font-size': '14px',
      'font-weight': 'normal',
      'line-height': 'normal',
      'letter-spacing': '0em',

      'font-variation-settings': 'opsz auto',
      'font-feature-settings': 'kern on',
      color: '#FFFFFF'
    }
  })

  return (
    <td
      data-slot="table-cell"
      className={cn(
        'py-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        tableCellClassName,
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return <caption data-slot="table-caption" className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
