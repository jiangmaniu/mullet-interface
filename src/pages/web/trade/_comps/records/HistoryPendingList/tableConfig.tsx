import { ProColumns } from '@ant-design/pro-components'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { getEnum } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { Trans } from '@/libs/lingui/react/macro'
import { GeneralTooltip } from '@/components/tooltip/general'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format'
import { renderFallback } from '@/libs/utils/format/fallback'
import { BNumber } from '@/libs/utils/number'
import { observer } from 'mobx-react'

export const getColumns = (): ProColumns<Order.OrderPageListItem>[] => {
  const { trade } = useStores()
  const currencyDecimal = trade.currentAccountInfo.currencyDecimal
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'

  return [
    {
      title: (
        <span className="!pl-1">
          <Trans>品种</Trans>
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
      width: 200,
      renderText(text, record, index, action) {
        return <HistoryOrderSymbolInfoCell orderInfo={record} />
      }
    },
    {
      title: <Trans>类型</Trans>,
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
      width: isZh ? 120 : 160,
      align: 'left',
      valueEnum: getEnum().Enum.OrderType,
      className: 'text-paragraph-p2 text-content-1'
    },

    {
      title: (
        <>
          <Trans>请求价格</Trans> / <Trans>成交价</Trans>
        </>
      ),
      dataIndex: 'price',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 200,
      renderText(text, record, index, action) {
        return <HistoryOrderPriceCell orderInfo={record} />
      }
    },

    {
      title: <Trans>手数</Trans>,
      dataIndex: 'orderVolume',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        precision: 2,
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 100,
      align: 'left',
      renderText(text, record, index, action) {
        return <span className="text-paragraph-p2 text-content-1">{BNumber.toFormatNumber(text)}</span>
      }
    },
    {
      title: (
        <>
          <Trans>手续费</Trans>
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
      width: isZh ? 140 : 150,
      renderText(text, record, index, action) {
        return (
          <span className="text-paragraph-p2 text-content-1">
            {BNumber.toFormatNumber(text, { precision: currencyDecimal, unit: 'USDC' })}
          </span>
        )
      }
    },

    {
      title: <Trans>订单号</Trans>,
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
      width: 140,
      renderText(text, record, index, action) {
        return (
          <div>
            <GeneralTooltip content={<>{record.id}</>} triggerClassName="inline-block">
              <TooltipTriggerDottedText className="text-paragraph-p2 text-content-1">
                {formatAddress(record.id, { prefix: 3, suffix: 3 })}
              </TooltipTriggerDottedText>
            </GeneralTooltip>
          </div>
        )
      }
    },
    {
      title: <Trans>交易时间</Trans>,
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
      className: 'text-paragraph-p2 text-content-1'
    },
    {
      title: <Trans>状态</Trans>,
      dataIndex: 'status',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      align: 'right',
      fixed: 'right',
      className: '!text-[13px] text-primary',
      renderText(text, record, index, action) {
        return (
          <span className="text-paragraph-p2 text-content-1">{renderFallback(getEnum().Enum.OrderStatus?.[record.status!]?.text)}</span>
        )
      }
    }
  ]
}

const HistoryOrderSymbolInfoCell = observer(({ orderInfo }: { orderInfo: Order.OrderPageListItem }) => {
  const { colorClassName, text2 } = getBuySellInfo(orderInfo)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={orderInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{orderInfo.symbol}</span>
        <span className={cn('text-paragraph-p3 text-content-4', colorClassName)}>{text2}</span>
      </div>
    </div>
  )
})

const HistoryOrderPriceCell = observer(({ orderInfo }: { orderInfo: Order.OrderPageListItem }) => {
  const { trade } = useStores()
  const currencyDecimal = trade.currentAccountInfo.currencyDecimal

  return (
    <div className="text-paragraph-p2 text-content-1">
      {orderInfo.type === 'MARKET_ORDER' ? (
        <span className="text-paragraph-p2 text-content-1">
          <Trans>市价</Trans>
        </span>
      ) : (
        BNumber.toFormatNumber(orderInfo.limitPrice, {
          volScale: currencyDecimal
        })
      )}

      {' / '}
      {BNumber.toFormatNumber(orderInfo?.tradePrice, {
        volScale: currencyDecimal
      })}
    </div>
  )
})
