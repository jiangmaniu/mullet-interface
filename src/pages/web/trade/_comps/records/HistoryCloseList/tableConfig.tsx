import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import SymbolIcon from '@/components/Base/SymbolIcon'
import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { getEnum } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/libs/ui/lib/utils'
import { observer } from 'mobx-react'
import { BNumber } from '@/libs/utils/number'
import CurrentPrice from '../PositionList/_comps/CurrentPrice'
import { Trans } from '@/libs/lingui/react/macro'
import { formatAddress } from '@/libs/utils/format'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { renderFallback } from '@/libs/utils/format/fallback'
import { parseSymbolLotsVolScale } from '@/helpers/parse/symbol/parse-lots-vol-scale'

export const getColumns = ({
  currentAccountInfo
}: {
  currentAccountInfo: User.AccountItem
}): ProColumns<Order.TradeRecordsPageListItem>[] => {
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'
  const currencyDecimal = currentAccountInfo.currencyDecimal
  const currencyUnit = currentAccountInfo.currencyUnit
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
      width: 230,
      renderText(text, record, index, action) {
        return <HistoryOrderSymbolInfoCell orderInfo={record} />
      }
    },
    {
      title: <Trans>交易类型</Trans>,
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
        return renderFallback(getEnum().Enum.OrderInOut?.[record.inOut!]?.text)
      }
    },

    {
      title: (
        <>
          <Trans>开仓均价</Trans> / <Trans>成交价</Trans>
        </>
      ),
      dataIndex: ' price',
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
      dataIndex: 'tradingVolume',
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
        const lotVolScale = parseSymbolLotsVolScale(record.conf)
        return (
          <span className="text-paragraph-p2 text-content-1">
            {BNumber.toFormatNumber(record.tradingVolume, { volScale: lotVolScale })}
          </span>
        )
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
      title: <Trans>保证金类型</Trans>,
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
      width: 140,
      className: 'text-paragraph-p2 text-content-1'
    },

    {
      title: <Trans>成交单号</Trans>,
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
      title: <Trans>交易签名</Trans>,
      dataIndex: 'signature',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      width: 140,
      renderText(text, record, index, action) {
        return (
          <>
            {renderFallback(
              <span className="text-content-1 text-paragraph-p2">
                <ExplorerLink path={`tx/${record.signature}`} address={record.signature} />
              </span>,
              {
                verify: !!record.signature
              }
            )}
          </>
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
      title: (
        <>
          <Trans>盈亏</Trans>({currencyUnit})
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
      width: isZh ? 120 : 140,
      align: 'right',
      fixed: 'right',
      renderText(text, record, index, action) {
        const profit = record.profit
        return (
          <>
            <span
              className={cn(
                'text-paragraph-p2',
                BNumber.from(profit)?.gt(0) ? 'text-market-rise' : BNumber.from(profit)?.lt(0) ? 'text-market-fall' : 'text-content-1'
              )}
            >
              {BNumber.toFormatNumber(profit, { forceSign: true, positive: false, volScale: currencyDecimal })}
            </span>
          </>
        )
      }
    }
  ]
}

const HistoryOrderSymbolInfoCell = observer(({ orderInfo }: { orderInfo: Order.TradeRecordsPageListItem }) => {
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

const HistoryOrderPriceCell = observer(({ orderInfo }: { orderInfo: Order.TradeRecordsPageListItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(orderInfo?.startPrice, {
        volScale: orderInfo?.symbolDecimal
      })}
      {' / '}
      {BNumber.toFormatNumber(orderInfo?.tradePrice, {
        volScale: orderInfo?.symbolDecimal
      })}
    </div>
  )
})
