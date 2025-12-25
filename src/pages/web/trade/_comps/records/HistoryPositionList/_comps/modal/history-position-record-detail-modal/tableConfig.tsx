import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import { getEnum } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { cn } from '@/libs/ui/lib/utils'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format'
import { Trans } from '@/libs/lingui/react/macro'

export const getHistoryPositionRecordDetailModalTableColumns = (): ProColumns<Order.BgaOrderPageListItem>[] => {
  const { trade } = useStores()
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'
  const precision = trade.currentAccountInfo.currencyDecimal

  const { screenSize } = useEnv()
  const width = screenSize.width

  return [
    {
      title: <Trans>订单号</Trans>,
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
      width: 150,
      fixed: 'left',
      renderText(text, record, index, action) {
        return (
          <GeneralTooltip content={<>{record?.id}</>} triggerClassName="inline-block">
            <TooltipTriggerDottedText className="text-paragraph-p2 text-content-1">
              {formatAddress(record?.id, { prefix: 4, suffix: 3 })}
            </TooltipTriggerDottedText>
          </GeneralTooltip>
        )
      }
    },
    {
      title: <Trans>品种</Trans>,
      dataIndex: 'symbol',
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
      title: <Trans>方向</Trans>,
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
      title: <Trans>手数</Trans>,
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
      title: <Trans>价格</Trans>,
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
      title: <Trans>时间</Trans>,
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
      title: <Trans>类型</Trans>,
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
      title: (
        <>
          <Trans>止盈</Trans> / <Trans>止损</Trans>
        </>
      ),
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
          <Trans>手续费</Trans>
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
          <Trans>库存费</Trans>
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
          <Trans>盈亏</Trans>
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
