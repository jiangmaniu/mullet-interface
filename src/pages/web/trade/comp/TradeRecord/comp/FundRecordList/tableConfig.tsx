import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import { getEnum } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

export const getColumns = (): ProColumns<Account.MoneyRecordsPageListItem>[] => {
  const { trade } = useStores()
  const accountGroupPrecision = trade.currentAccountInfo.currencyDecimal

  return [
    {
      title: <FormattedMessage id="mt.shijian" />, // 与 antd 中基本相同，但是支持通过传入一个方法
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
      width: 150
    },
    {
      title: <FormattedMessage id="common.type" />,
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
      valueEnum: getEnum().Enum.CustomerBalanceRecordType
    },
    {
      title: <FormattedMessage id="mt.jine" />,
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
        const num = formatNum(text, { precision: accountGroupPrecision })
        return text ? (
          <span className={cn('!font-dingpro-medium', text > 0 ? 'text-green' : 'text-red')}>{text > 0 ? '+' + num : num}</span>
        ) : (
          '-'
        )
      }
    },
    {
      title: <FormattedMessage id="mt.yue" />,
      dataIndex: 'newBalance',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        precision: accountGroupPrecision,
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150
    },
    {
      title: <FormattedMessage id="mt.biandongqian" />,
      dataIndex: 'oldBalance',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        precision: accountGroupPrecision,
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      align: 'right',
      fixed: 'right'
    }
  ]
}
