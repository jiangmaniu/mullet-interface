'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'

import { cn } from '@/libs/ui/lib/utils'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState<'start' | 'middle' | 'end' | 'none'>('start')

  const checkScroll = () => {
    const el = containerRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const isScrollable = scrollWidth > clientWidth

    if (!isScrollable) {
      setScrollState('none')
      return
    }

    // Buffer for float precision
    const isStart = scrollLeft <= 1
    const isEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) <= 1

    if (isStart) setScrollState('start')
    else if (isEnd) setScrollState('end')
    else setScrollState('middle')
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      onScroll={checkScroll}
      data-slot="table-container"
      data-scroll={scrollState}
      className={cn('relative w-full h-full overflow-auto group/table-container')}
    >
      <table data-slot="table" className={cn('w-full caption-bottom', className)} {...props} />
    </div>
  )
}

interface TableHeaderProps extends React.ComponentProps<'thead'> {
  sticky?: boolean
}

function TableHeader({ className, sticky, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        '[&_tr]:border-b border-none',
        sticky && '[&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:bg-background',
        sticky && '[&_th[data-fixed]]:z-30',
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('bg-muted/50 border-t border-none font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted group border-b border-none transition-colors',
        '[&_th]:py-medium [&_th]:px-xl [&_th:last-child]:pr-3xl [&_th:first-child]:pl-3xl',
        '[&_td]:py-medium [&_td]:px-xl [&_td:last-child]:pr-3xl [&_td:first-child]:pl-3xl',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-paragraph-p3 text-content-5 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        'data-[fixed]:bg-background data-[fixed]:sticky data-[fixed]:z-10',

        // Left fixed column pseudo-element shadow
        'data-[fixed=left]:after:absolute data-[fixed=left]:after:top-0 data-[fixed=left]:after:right-0 data-[fixed=left]:after:h-full data-[fixed=left]:after:w-[30px] data-[fixed=left]:after:translate-x-full data-[fixed=left]:after:pointer-events-none data-[fixed=left]:after:content-[""]',
        'data-[fixed=left]:after:transition-[box-shadow] data-[fixed=left]:after:duration-300',
        'group-data-[scroll=middle]/table-container:data-[fixed=left]:after:shadow-[inset_10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',
        'group-data-[scroll=end]/table-container:data-[fixed=left]:after:shadow-[inset_10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',

        // Right fixed column pseudo-element shadow
        'data-[fixed=right]:before:absolute data-[fixed=right]:before:top-0 data-[fixed=right]:before:left-0 data-[fixed=right]:before:h-full data-[fixed=right]:before:w-[30px] data-[fixed=right]:before:-translate-x-full data-[fixed=right]:before:pointer-events-none data-[fixed=right]:before:content-[""]',
        'data-[fixed=right]:before:transition-[box-shadow] data-[fixed=right]:before:duration-300',
        'group-data-[scroll=middle]/table-container:data-[fixed=right]:before:shadow-[inset_-10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',
        'group-data-[scroll=start]/table-container:data-[fixed=right]:before:shadow-[inset_-10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',

        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'text-paragraph-p2 text-content-1 align-middle text-left whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        'data-[fixed]:bg-background data-[fixed]:group-hover:bg-muted/50 data-[fixed]:group-data-[state=selected]:bg-muted data-[fixed]:sticky data-[fixed]:z-10',

        // Left fixed column pseudo-element shadow
        'data-[fixed=left]:after:absolute data-[fixed=left]:after:top-0 data-[fixed=left]:after:right-0 data-[fixed=left]:after:h-full data-[fixed=left]:after:w-[30px] data-[fixed=left]:after:translate-x-full data-[fixed=left]:after:pointer-events-none data-[fixed=left]:after:content-[""]',
        'data-[fixed=left]:after:transition-[box-shadow] data-[fixed=left]:after:duration-300',
        'group-data-[scroll=middle]/table-container:data-[fixed=left]:after:shadow-[inset_10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',
        'group-data-[scroll=end]/table-container:data-[fixed=left]:after:shadow-[inset_10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',

        // Right fixed column pseudo-element shadow
        'data-[fixed=right]:before:absolute data-[fixed=right]:before:top-0 data-[fixed=right]:before:left-0 data-[fixed=right]:before:h-full data-[fixed=right]:before:w-[30px] data-[fixed=right]:before:-translate-x-full data-[fixed=right]:before:pointer-events-none data-[fixed=right]:before:content-[""]',
        'data-[fixed=right]:before:transition-[box-shadow] data-[fixed=right]:before:duration-300',
        'group-data-[scroll=middle]/table-container:data-[fixed=right]:before:shadow-[inset_-10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',
        'group-data-[scroll=start]/table-container:data-[fixed=right]:before:shadow-[inset_-10px_0_8px_-8px_var(--ant-color-split,rgba(0,0,0,0.15))]',

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
