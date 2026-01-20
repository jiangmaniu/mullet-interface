'use client'

import React, { useMemo, useState } from 'react'

import {
  type ColumnDef,
  type PaginationState,
  type TableState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  Column
} from '@tanstack/react-table'

import { cn } from '@/libs/ui/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/libs/ui/components/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/ui/components/table'
import { EmptyNoData } from '@/components/empty/no-data'
import { IconCodexLoader } from '../ui/components/icons'

const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned()
  if (!isPinned) return {}

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined
  }
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  emptyState?: React.ReactNode
  className?: string
  /** 状态变化回调（如分页、排序、筛选等）*/
  onStateChange?: (state: TableState) => void
  pagination?:
    | {
        pageIndex?: number
        pageSize?: number
        total?: number
        onPageChange?: (pageIndex: number, pageSize: number) => void
      }
    | boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  pagination,
  onStateChange,
  emptyState,
  className
}: DataTableProps<TData, TValue>) {
  // 是否是服务端分页 (只有当 pagination 是对象且包含 total 属性时，才认为是服务端分页)
  const isManualPagination = typeof pagination === 'object' && 'total' in pagination

  // 处理分页状态
  const paginationState = useMemo(() => {
    if (isManualPagination && typeof pagination === 'object' && typeof pagination.pageIndex === 'number') {
      return {
        pageIndex: Math.max(pagination.pageIndex - 1, 0),
        pageSize: pagination.pageSize || 10
      }
    }
    return undefined
  }, [pagination, isManualPagination])

  const [clientPagination, setClientPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: (typeof pagination === 'object' ? pagination.pageSize : undefined) || 10
  })

  // 计算总页数
  const pageCount = useMemo(() => {
    if (isManualPagination && typeof pagination === 'object' && typeof pagination.total === 'number') {
      return Math.ceil(pagination.total / (pagination.pageSize || 10))
    }
    return -1 // 自动计算
  }, [pagination, isManualPagination])

  // 处理分页变更
  const handlePaginationChange = (updaterOrValue: any) => {
    // 获取当前的分页状态
    const oldState = isManualPagination ? paginationState! : clientPagination
    const newState = typeof updaterOrValue === 'function' ? updaterOrValue(oldState) : updaterOrValue

    if (isManualPagination && typeof pagination === 'object') {
      // 受控模式
      pagination.onPageChange?.(newState.pageIndex + 1, newState.pageSize)

      // 同时触发通用的状态变更回调
      onStateChange?.({ ...table.getState(), pagination: newState })
    } else {
      // 非受控模式，更新内部状态
      setClientPagination(newState)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: !isManualPagination ? getPaginationRowModel() : undefined,
    onPaginationChange: handlePaginationChange,
    manualPagination: isManualPagination,
    pageCount: isManualPagination ? pageCount : undefined,
    state: {
      pagination: isManualPagination ? paginationState : clientPagination,
      columnPinning: {
        left: columns.filter((c: any) => c.fixed === 'left' || c.meta?.fixed === 'left').map((c) => c.id || (c as any).accessorKey),
        right: columns.filter((c: any) => c.fixed === 'right' || c.meta?.fixed === 'right').map((c) => c.id || (c as any).accessorKey)
      }
    }
  })

  // 监听状态变化 (主要用于非受控模式或其它状态变更的响应)
  const state = table.getState()
  React.useEffect(() => {
    if (!isManualPagination) {
      onStateChange?.(state)
    }
  }, [state, onStateChange, isManualPagination]) // eslint-disable-line

  const currentPageIndex = table.getState().pagination.pageIndex
  const totalPages = table.getPageCount()
  const hasPagination = pagination !== false

  // 渲染分页组件
  const renderPagination = () => {
    // 如果总数没有超过一页，则不显示分页
    if (!hasPagination || totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    let displayPages = pages
    if (totalPages > 7) {
      if (currentPageIndex < 4) {
        displayPages = [...pages.slice(0, 5), -1, totalPages] as any
      } else if (currentPageIndex > totalPages - 5) {
        displayPages = [1, -1, ...pages.slice(totalPages - 5)] as any
      } else {
        displayPages = [1, -1, currentPageIndex, currentPageIndex + 1, currentPageIndex + 2, -1, totalPages] as any
      }
    }

    return (
      <Pagination className="py-2xl bg-background">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
          </PaginationItem>
          {displayPages.map((page, idx) => {
            if (page === -1) {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            return (
              <PaginationItem key={page}>
                <PaginationLink isActive={currentPageIndex + 1 === page} onClick={() => table.setPageIndex(page - 1)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  const isFullTable = useMemo(() => loading || !table.getRowModel().rows?.length, [loading, table])

  return (
    <div className={cn('h-full flex flex-col overflow-hidden', className)}>
      <div className="relative flex-1 min-h-0">
        <Table className={cn({ 'h-full': isFullTable })}>
          <TableHeader sticky>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const styles = getCommonPinningStyles(header.column)
                  const isPinned = header.column.getIsPinned()
                  return (
                    <TableHead key={header.id} data-fixed={isPinned || undefined} style={{ ...styles, width: header.getSize() }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex w-full items-center justify-center">
                    <IconCodexLoader className="size-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    const styles = getCommonPinningStyles(cell.column)
                    const isPinned = cell.column.getIsPinned()
                    return (
                      <TableCell key={cell.id} data-fixed={isPinned || undefined} style={{ ...styles }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-full">
                <TableCell colSpan={columns.length} className="text-center h-full">
                  {emptyState ? emptyState : <EmptyNoData />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {renderPagination()}
    </div>
  )
}
