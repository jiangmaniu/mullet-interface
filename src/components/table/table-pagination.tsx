import { Icons } from '@/components/ui/icons'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { PageDataResponse } from '@/services/api/trade-core/type'
import { RowData, Table as TableType } from '@tanstack/react-table'
import React from 'react'

export const TablePagination = <TData extends RowData>({
  table,
  pageData,
  ...props
}: React.ComponentProps<typeof Pagination> & {
  table: TableType<TData>
  pageData?: PageDataResponse<TData> | null
}) => {
  const getPageCount = table.getPageCount
  const getState = table.getState
  const pageCount = getPageCount()
  const currentPageIndex = getState().pagination.pageIndex

  if (getPageCount() === 0) {
    return null
  }

  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className="hover:text-[#0A0C27]" disabled={!table.getCanPreviousPage()} onClick={table.previousPage} />
        </PaginationItem>

        {Array.from({ length: pageCount > 5 ? 5 : pageCount }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => {
                table.setPageIndex(index)
              }}
              isActive={currentPageIndex === index}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <div className="flex w-fit items-center justify-center text-[#999]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        {pageCount > 5 && (
          <>
            <PaginationItem>{<Icons.lucide.Ellipsis className="text-[#999] flex items-center" />}</PaginationItem>

            <PaginationItem>
              <PaginationLink onClick={() => table.setPageIndex(pageCount)} isActive={currentPageIndex === pageCount}>
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext className="hover:text-[#0A0C27]" disabled={!table.getCanNextPage()} onClick={table.nextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
