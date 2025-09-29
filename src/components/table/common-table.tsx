import type { Row, Table as TableType } from '@tanstack/react-table'
import * as React from 'react'

import * as Table from '@/components/ui/table'
import { cn } from '@/utils/cn'
import { Icons } from '../ui/icons'

type TableBodyProps<TData> = Omit<React.ComponentPropsWithoutRef<typeof Table.TableBody>, 'children'> & {
  loadingFallback?: () => React.ReactNode
  emptyResultFallback?: () => React.ReactNode
  emptyResultDescription?: React.ReactNode
  loading?: boolean
  children?: (row: Row<TData>) => React.ReactNode
  table: TableType<TData>
  getRowKey?: (row: Row<TData>) => React.Key | null | undefined
}

export const CommonTableBody = <TData,>({
  table,
  loadingFallback,
  loading,
  emptyResultFallback,
  emptyResultDescription = 'No results.',
  children,
  getRowKey,
  className,
  ...props
}: TableBodyProps<TData>) => {
  const rows = table.getRowModel().rows

  const LoadingContent =
    loadingFallback ??
    (() => {
      return (
        <tr className="h-full">
          <td colSpan={table.getAllColumns().length}>
            <div
              className={cn('inset-0 z-10 flex h-full w-full flex-col gap-medium bg-base-white p-medium py-large text-center', {
                absolute: table.getRowModel().rows.length
              })}
            >
              {/* <Skeleton className="h-4 w-1/2 shrink-0" />
                  <Skeleton className="h-4 shrink-0" />
                  <Skeleton className="h-4 w-3/4 shrink-0" />
                  <Skeleton className="h-4 shrink-0" /> */}

              <Icons.lucide.Spinner className="size-6 animate-spin" />
            </div>
          </td>
        </tr>
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
