import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { getEnum } from '@/constants/enum'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'

export const getColumns = (currencyDecimal: any): ProColumns<Order.TradeRecordsPageListItem>[] => {
  return [
    {
      title: (
        <span className="!pl-1">
          <FormattedMessage id="mt.pinlei" />
        </span>
      ), // 与 antd 中基本相同，但是支持通过传入一个方法
      dataIndex: 'category',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      fixed: 'left',
      width: 230,
      renderText(text, record, index, action) {
        const { text2, colorClassName } = getBuySellInfo(record)
        return (
          <div className="flex items-center">
            <SymbolIcon src={record?.imgUrl} />
            <div className="flex flex-col pl-4">
              <span className="text-base font-semibold text-primary">{record.symbol}</span>
              <span className={cn('text-xs font-medium pt-[2px]', colorClassName)}>{text2}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: <FormattedMessage id="common.type" />,
      dataIndex: 'type',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      align: 'left',
      className: '!text-[13px] text-primary',
      renderText(text, record, index, action) {
        return getEnum().Enum.OrderInOut?.[record.inOut!]?.text || '-'
      }
    },
    {
      title: <FormattedMessage id="mt.kaicangjia" />,
      dataIndex: 'startPrice',
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
        return <span className="!text-[13px] text-primary">{formatNum(text, { precision: record.symbolDecimal })}</span>
      }
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.chengjiaojia" />
        </>
      ),
      dataIndex: 'tradePrice',
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
        return <span className="!text-[13px] text-primary">{formatNum(text)}</span>
      }
    },
    {
      title: <FormattedMessage id="mt.shoushu" />,
      dataIndex: 'tradingVolume',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150,
      align: 'left',
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-primary">{formatNum(text)}</span>
      }
    },
    // {
    //   title: (
    //     <>
    //       <FormattedMessage id="mt.shouxufei" />
    //       (USD)
    //     </>
    //   ),
    //   dataIndex: 'handlingFees',
    //   hideInSearch: true, // 在 table的查询表单 中隐藏
    //   ellipsis: false,
    //   fieldProps: {
    //     placeholder: ''
    //   },
    //   formItemProps: {
    //     label: '' // 去掉form label
    //   },
    //   width: 150,
    //   renderText(text, record, index, action) {
    //     return <span className="!text-[13px] text-primary">{formatNum(text)}</span>
    //   }
    // },
    {
      title: <FormattedMessage id="mt.baozhengjinleix" />,
      dataIndex: 'marginType',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      valueEnum: getEnum().Enum.MarginType,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 160,
      className: '!text-[13px] text-primary'
    },
    {
      title: <FormattedMessage id="mt.jiaoyishijian" />,
      dataIndex: 'createTime',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 180,
      className: '!text-[13px] text-primary'
    },
    {
      title: <FormattedMessage id="mt.chengjiaodanhao" />,
      dataIndex: 'id',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 200
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.yingkui" />
          (USD)
        </>
      ),
      dataIndex: 'profit',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      align: 'right',
      fixed: 'right',
      renderText(text, record, index, action) {
        const profit = record.profit
        const flag = Number(profit) > 0
        const color = flag ? 'text-green' : 'text-red'
        const profitFormat = formatNum(profit, { precision: currencyDecimal })
        return <>{profit ? <span className={cn('font-pf-bold', color)}>{flag ? '+' + profitFormat : profitFormat}</span> : '-'}</>
      }
    }
  ]
}
