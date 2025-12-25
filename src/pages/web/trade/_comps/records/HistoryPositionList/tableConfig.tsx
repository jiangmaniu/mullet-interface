import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import SymbolIcon from '@/components/Base/SymbolIcon'
import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { getEnum } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/libs/ui/lib/utils'
import { observer } from 'mobx-react'
import { BNumber } from '@/libs/utils/number'
import { Trans } from '@/libs/lingui/react/macro'
import { renderFallback } from '@/libs/utils/format/fallback'
import { Button } from '@/libs/ui/components/button'
import { HistoryPositionRecordDetailModal } from './_comps/modal/history-position-record-detail-modal'
import { useRef } from 'react'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { formatAddress } from '@/libs/utils/format'

export const getColumns = (currencyDecimal: any): ProColumns<Order.BgaOrderPageListItem>[] => {
  const { trade } = useStores()
  const precision = currencyDecimal
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
      width: 200,
      renderText(text, record, index, action) {
        // const buySellInfo = getBuySellInfo(record)
        return (
          // <div className="flex items-center">
          //   <SymbolIcon src={record.imgUrl} />
          //   <div className="flex items-center pl-[10px]">
          //     <span className="text-base font-pf-bold text-primary">{record.symbol}</span>
          //     <span className={cn('text-xs font-medium pl-2', buySellInfo.colorClassName)}>{buySellInfo.text2}</span>
          //   </div>
          // </div>

          <HistoryPositionSymbolInfoCell recordInfo={record} />
        )
      }
    },
    {
      title: <Trans>开仓均价</Trans>,
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
        return BNumber.toFormatNumber(text, { volScale: record.symbolDecimal })
      }
    },

    {
      title: <Trans>手数</Trans>,
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
      width: 100,
      className: 'text-paragraph-p2 text-content-1'
    },

    {
      title: (
        <>
          <Trans>手续费</Trans> / <Trans>库存费</Trans>
        </>
      ),
      dataIndex: 'Fees',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 220,
      renderText(text, record, index, action) {
        return <HistoryPositionFeesCell positionRecord={record} />
      }
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
      }
    },

    {
      title: <Trans>交易账号</Trans>,
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
      className: 'text-paragraph-p2 text-content-1',
      width: 150
    },

    {
      title: <Trans>持仓单号</Trans>,
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
      title: <Trans>开仓时间</Trans>,
      dataIndex: 'createTime',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 190,
      className: 'text-paragraph-p2 text-content-1'
    },

    {
      title: <Trans>状态</Trans>,
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
      width: 150,
      className: 'text-paragraph-p2 text-content-1'
    },
    {
      title: <Trans>地址</Trans>,
      dataIndex: 'pdaAddress',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      width: 150,
      renderText(text, record, index, action) {
        return (
          <>
            {renderFallback(
              <span className="text-paragraph-p2 text-content-1">
                <ExplorerLink path={`address/${record.pdaAddress}`} address={record.pdaAddress} />
              </span>,
              {
                verify: !!record.pdaAddress
              }
            )}
          </>
        )
      }
    },

    {
      title: <Trans>操作</Trans>,
      key: 'option',
      fixed: 'right',
      width: 100,
      align: 'right',
      hideInForm: true,
      hideInSearch: true,
      render: (text, record, _, _action) => {
        return (
          <div className="flex gap-2 justify-end">
            <div>
              <HistoryPositionActionDetail record={record} />
            </div>
          </div>
        )
      }
    }
  ]
}

const HistoryPositionSymbolInfoCell = observer(({ recordInfo }: { recordInfo: Order.BgaOrderPageListItem }) => {
  const { colorClassName, text2 } = getBuySellInfo(recordInfo)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={recordInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{recordInfo.symbol}</span>
        <span className={cn('text-paragraph-p3 text-content-4', colorClassName)}>{text2}</span>
      </div>
    </div>
  )
})

const HistoryPositionFeesCell = observer(({ positionRecord }: { positionRecord: Order.BgaOrderPageListItem }) => {
  const handlingFees = positionRecord?.handlingFees
  const interestFees = positionRecord?.interestFees

  const { trade } = useStores()
  const precision = trade.currentAccountInfo.currencyDecimal
  const unit = 'USDC'

  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(handlingFees, {
        volScale: precision,
        unit: unit,
        positive: false
      })}
      {' / '}
      {BNumber.toFormatNumber(interestFees, {
        volScale: precision,
        unit: unit,
        positive: false
      })}
    </div>
  )
})

const HistoryPositionActionDetail = ({ record }: { record: Order.BgaOrderPageListItem }) => {
  const HistoryPositionRecordDetailModalRef = useRef<any>(null)
  return (
    <div>
      <Button
        variant="primary"
        size="sm"
        color="default"
        onClick={() => {
          HistoryPositionRecordDetailModalRef?.current?.show()
        }}
      >
        <Trans>明细</Trans>
      </Button>

      <HistoryPositionRecordDetailModal ref={HistoryPositionRecordDetailModalRef} record={record} />
    </div>
  )
}
