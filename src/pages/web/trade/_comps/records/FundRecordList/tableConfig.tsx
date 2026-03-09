import { ColumnDef } from '@tanstack/react-table'

import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { getEnum } from '@/constants/enum'
import { cn } from '@/utils/cn'
import { BNumber } from '@/libs/utils/number'
import { Trans } from '@/libs/lingui/react/macro'
import { renderFallback } from '@/libs/utils/format/fallback'

export const getColumns = ({
  currentAccountInfo
}: {
  currentAccountInfo: User.AccountItem
}): ColumnDef<Account.MoneyRecordsPageListItem>[] => {
  return [
    {
      accessorKey: 'createTime',
      header: () => <Trans>时间</Trans>,
      size: 150,
      meta: {
        fixed: 'left'
      },
      cell: ({ row }) => <span className="text-paragraph-p2 text-content-1">{row.original.createTime}</span>
    },
    {
      accessorKey: 'type',
      header: () => <Trans>类型</Trans>,
      size: 150,
      cell: ({ row }) => {
        const typeEnum = getEnum().Enum.CustomerBalanceRecordType
        const text = typeEnum[row.original.type as keyof typeof typeEnum]?.text || row.original.type
        return <span className="text-paragraph-p2 text-content-1">{text}</span>
      }
    },
    {
      accessorKey: 'money',
      header: () => <Trans>金额</Trans>,
      size: 150,
      cell: ({ row }) => {
        const text = row.original.money ?? 0
        return (
          <span
            className={cn(
              'text-paragraph-p2 text-content-1',
              BNumber.from(text).gt(0) ? 'text-market-rise' : BNumber.from(text).lt(0) ? 'text-market-fall' : 'text-content-1'
            )}
          >
            {BNumber.toFormatNumber(text, {
              volScale: currentAccountInfo.currencyDecimal,
              positive: false,
              forceSign: true,
              unit: currentAccountInfo.currencyUnit
            })}
          </span>
        )
      }
    },
    {
      accessorKey: 'newBalance',
      header: () => <Trans>余额</Trans>,
      size: 150,
      cell: ({ row }) => {
        const text = row.original.newBalance
        return (
          <span className="text-paragraph-p2 text-content-1">
            {BNumber.toFormatNumber(text, {
              volScale: currentAccountInfo.currencyDecimal,
              unit: currentAccountInfo.currencyUnit
            })}
          </span>
        )
      }
    },
    {
      accessorKey: 'oldBalance',
      header: () => <Trans>变动前</Trans>,
      size: 150,
      cell: ({ row }) => {
        const text = row.original.oldBalance
        return (
          <span className="text-paragraph-p2 text-content-1">
            {BNumber.toFormatNumber(text, {
              volScale: currentAccountInfo.currencyDecimal,
              unit: currentAccountInfo.currencyUnit
            })}
          </span>
        )
      }
    },
    {
      accessorKey: 'signature',
      header: () => (
        <div className="text-right">
          <Trans>交易签名</Trans>
        </div>
      ),
      size: 180,
      meta: {
        fixed: 'right'
      },
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            {renderFallback(
              <span className="text-paragraph-p2 text-content-1">
                <ExplorerLink path={`tx/${row.original.signature}`} address={row.original.signature} />
              </span>,
              {
                verify: !!row.original.signature
              }
            )}
          </div>
        )
      }
    }
  ]
}
