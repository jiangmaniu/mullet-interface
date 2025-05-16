import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import { getEnum } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

// 点击行展开的表格配置
export const getExpandColumns = (): ProColumns<Order.BgaOrderPageListItem>[] => {
  const { trade } = useStores()
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'
  const precision = trade.currentAccountInfo.currencyDecimal

  const { screenSize } = useEnv()
  const width = screenSize.width

  return [
    {
      title: <FormattedMessage id="mt.danhao" />,
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
      width: 280,
      fixed: 'left',
      className: '!px-1'
    },
    {
      title: <FormattedMessage id="mt.pinzhong" />,
      dataIndex: 'symbol',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 200
    },
    {
      title: <FormattedMessage id="mt.fangxiang" />,
      dataIndex: 'direction',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 100
    },
    {
      title: <FormattedMessage id="mt.shuliang" />,
      dataIndex: 'orderVolume',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120
    },
    {
      title: <FormattedMessage id="mt.jiage" />,
      dataIndex: 'price',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 200
    },
    {
      title: <FormattedMessage id="mt.shijian" />,
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
      title: <FormattedMessage id="mt.leixing" />,
      dataIndex: 'type',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      valueEnum: getEnum().Enum.OrderType,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 150
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
      width: 150,
      renderText(text, record, index, action) {
        return (
          <div>
            <span className="!text-[13px] text-primary">
              {record?.takeProfit ? formatNum(record?.takeProfit, { precision: record.symbolDecimal || 2 }) : '--'}
            </span>
            <span className="dark:text-gray-95"> / </span>
            <span className="!text-[13px] text-primary">
              {record?.stopLoss ? formatNum(record?.stopLoss, { precision: record.symbolDecimal || 2 }) : '--'}
            </span>
          </div>
        )
      }
    },
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
