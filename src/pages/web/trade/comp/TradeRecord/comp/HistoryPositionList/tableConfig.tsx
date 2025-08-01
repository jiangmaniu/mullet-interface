import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import SymbolIcon from '@/components/Base/SymbolIcon'
import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { getEnum } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'

export const getColumns = (currencyDecimal: any): ProColumns<Order.BgaOrderPageListItem>[] => {
  const { trade } = useStores()
  const precision = currencyDecimal
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'

  return [
    {
      title: (
        <span className="!pl-1">
          <FormattedMessage id="mt.pinlei" />
        </span>
      ), // 与 antd 中基本相同，但是支持通过传入一个方法
      dataIndex: 'category',
      className: '!px-1',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      fixed: 'left',
      width: 240,
      renderText(text, record, index, action) {
        const buySellInfo = getBuySellInfo(record)
        return (
          <div className="flex items-center">
            <SymbolIcon src={record.imgUrl} />
            <div className="flex items-center pl-[10px]">
              <span className="text-base font-pf-bold text-primary">{record.symbol}</span>
              <span className={cn('text-xs font-medium pl-2', buySellInfo.colorClassName)}>{buySellInfo.text2}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: <FormattedMessage id="mt.chicangdanhao" />,
      dataIndex: 'id',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: true,
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
      title: <FormattedMessage id="mt.kaicangshoushu" />,
      dataIndex: 'orderVolume',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        precision: 2,
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 100
    },
    {
      title: <FormattedMessage id="mt.kaicangjiage" />,
      dataIndex: 'startPrice',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      renderText(text, record, index, action) {
        return text ? formatNum(text, { precision: record.symbolDecimal }) : '-'
      }
    },
    {
      title: <FormattedMessage id="mt.kaicangshijian" />,
      dataIndex: 'createTime',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 190
    },
    {
      title: <FormattedMessage id="mt.jiaoyizhanghao" />,
      dataIndex: 'tradeAccountId',
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
      title: <FormattedMessage id="mt.zhiyingzhisun2" />,
      dataIndex: 'stopLossProfit',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 200,
      renderText(text, record, index, action) {
        return (
          <div>
            <span className="!text-[13px] text-primary">
              {record?.takeProfit ? formatNum(record?.takeProfit, { precision: record.symbolDecimal }) : '--'}
            </span>
            <span className="dark:text-gray-95"> / </span>
            <span className="!text-[13px] text-primary">
              {record?.stopLoss ? formatNum(record?.stopLoss, { precision: record.symbolDecimal }) : '--'}
            </span>
          </div>
        )
      }
    },
    // {
    //   title: <FormattedMessage id="mt.xiugaishijian" />,
    //   dataIndex: 'updateTime',
    //   hideInSearch: true, // 在 table的查询表单 中隐藏
    //   ellipsis: false,
    //   fieldProps: {
    //     placeholder: ''
    //   },
    //   formItemProps: {
    //     label: '' // 去掉form label
    //   },
    //   width: 200
    // },
    {
      title: (
        <>
          <FormattedMessage id="mt.shouxufei" />
          (USD)
        </>
      ),
      dataIndex: 'handlingFees',
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
        return <span className="!text-[13px] text-primary">{formatNum(text, { precision })}</span>
      }
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.kucunfei" />
          (USD)
        </>
      ),
      dataIndex: 'interestFees',
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
        return <span className="!text-[13px] text-primary">{formatNum(text, { precision })}</span>
      }
    },
    {
      title: <FormattedMessage id="common.status" />,
      dataIndex: 'status',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      valueEnum: getEnum().Enum.BGAStatus,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150
    },
    {
      title: <FormattedMessage id="mt.dizhi" />,
      dataIndex: 'pdaAddress',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      width: 150,
      renderText(text, record, index, action) {
        return (
          <span className="!text-[13px] text-primary">
            <ExplorerLink path={`address/${record.pdaAddress}`} address={record.pdaAddress} />
          </span>
        )
      }
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
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      renderText(text, record, index, action) {
        let profit: any = record.profit
        const flag = Number(profit) > 0
        const formatProfit = formatNum(profit, { precision })
        return profit ? (
          <span className={cn('!font-dingpro-medium', flag ? 'text-green' : 'text-red')}>{flag ? `+${formatProfit}` : formatProfit}</span>
        ) : (
          '-'
        )
      },
      align: 'right',
      fixed: 'right'
    }
  ]
}
