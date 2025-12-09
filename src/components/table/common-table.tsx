import type { Row, Table as TableType } from '@tanstack/react-table'
import * as React from 'react'

import * as Table from '@/components/ui/table'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/utils/cn'
import { Skeleton } from '../ui/skeleton'

type TableBodyProps<TData> = Omit<React.ComponentPropsWithoutRef<typeof Table.TableBody>, 'children'> & {
  loadingFallback?: () => React.ReactNode
  emptyResultFallback?: () => React.ReactNode
  emptyResultDescription?: React.ReactNode
  loading?: boolean
  loadingRowCount?: number
  children?: (row: Row<TData>) => React.ReactNode
  table: TableType<TData>
  getRowKey?: (row: Row<TData>) => React.Key | null | undefined
}

export const CommonTableBody = <TData,>({
  table,
  loadingFallback,
  loading,
  emptyResultFallback,
  loadingRowCount,
  emptyResultDescription = '暂无数据',
  children,
  getRowKey,
  className,
  ...props
}: TableBodyProps<TData>) => {
  const rows = table.getRowModel().rows

  const LoadingContent =
    loadingFallback ??
    (() => {
      const count = loadingRowCount ?? table.getState().pagination.pageSize ?? 1
      return (
        <>
          {Array.from({ length: count }).map((_, index) => {
            return (
              <TableRow className="h-full" key={index}>
                {/* <td colSpan={table.getAllColumns().length}>
            <div
              className={cn('inset-0 z-10 flex h-full w-full flex-col gap-medium bg-base-white p-medium py-large text-center', {
                absolute:!!table.getRowModel().rows.length
              })}
            >
            {/ * <Skeleton className="h-4 w-1/2 shrink-0" />
                  <Skeleton className="h-4 shrink-0" />
                  <Skeleton className="h-4 w-3/4 shrink-0" />
                  <Skeleton className="h-4 shrink-0" /> * /}

            <Icons.lucide.Spinner className="size-6 animate-spin" />
            </div>

            <div className="flex justify-center items-center">
              <Icons.lucide.Spinner className="size-6 animate-spin" />
            </div>
          </td> */}

                {table.getAllColumns().map((column) => {
                  return (
                    <TableCell key={column.id}>
                      <Skeleton key={column.id} className="h-7 w-2/3 bg-[#131534] shrink-0" />
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </>
      )
    })

  const EmptyResultContent =
    emptyResultFallback ??
    (() => {
      return (
        <tr className="">
          <td colSpan={table.getAllColumns().length}>
            <div className="flex h-full min-h-20 py-10 flex-col items-center justify-center text-center">
              <div className="relative">
                <img src="/img/icons/empty-result-fallback.svg" alt="empty-result" />
              </div>

              {emptyResultDescription && <div className="mt-4 text-[12px] text-[#767783]">{emptyResultDescription}</div>}
            </div>
          </td>
        </tr>
      )
    })

  return (
    <Table.TableBody className={cn('relative', className)} {...props}>
      {rows?.length ? (
        <>
          {rows?.map((row, index) => {
            const key = getRowKey?.(row) ?? row.id ?? index
            return <React.Fragment key={key}>{children?.(row)}</React.Fragment>
          })}
        </>
      ) : !loading ? (
        <EmptyResultContent />
      ) : null}

      {loading && <LoadingContent />}
    </Table.TableBody>
  )
}
