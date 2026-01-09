import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { getEnum } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { cn } from '@/utils/cn'
import { BNumber } from '@/libs/utils/number'
import { Trans } from '@/libs/lingui/react/macro'
import { renderFallback } from '@/libs/utils/format/fallback'

export const getColumns = ({
  currentAccountInfo
}: {
  currentAccountInfo: User.AccountItem
}): ProColumns<Account.MoneyRecordsPageListItem>[] => {
  return [
    {
      title: <Trans>时间</Trans>, // 与 antd 中基本相同，但是支持通过传入一个方法
      dataIndex: 'createTime',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      fixed: 'left',
      width: 150,
      className: 'text-paragraph-p2 text-content-1'
    },
    {
      title: <Trans>类型</Trans>,
      dataIndex: 'type',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      valueEnum: getEnum().Enum.CustomerBalanceRecordType,
      className: 'text-paragraph-p2 text-content-1'
    },
    {
      title: <Trans>金额</Trans>,
      dataIndex: 'money',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      renderText(text, record, index, action) {
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
      title: <Trans>余额</Trans>,
      dataIndex: 'newBalance',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      renderText(text, record, index, action) {
        return BNumber.toFormatNumber(text, { volScale: currentAccountInfo.currencyDecimal, unit: currentAccountInfo.currencyUnit })
      },
      className: 'text-paragraph-p2 text-content-1'
    },
    {
      title: <Trans>变动前</Trans>,
      dataIndex: 'oldBalance',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      renderText(text, record, index, action) {
        return BNumber.toFormatNumber(text, { volScale: currentAccountInfo.currencyDecimal, unit: currentAccountInfo.currencyUnit })
      },
      className: 'text-paragraph-p2 text-content-1'
    },
    {
      title: <Trans>交易签名</Trans>,
      dataIndex: 'signature',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      width: 180,
      align: 'right',
      fixed: 'right',
      renderText(text, record, index, action) {
        return (
          <>
            {renderFallback(
              <span className="text-paragraph-p2 text-content-1">
                <ExplorerLink path={`tx/${record.signature}`} address={record.signature} />
              </span>,
              {
                verify: !!record.signature
              }
            )}
          </>
        )
      }
    }
  ]
}
