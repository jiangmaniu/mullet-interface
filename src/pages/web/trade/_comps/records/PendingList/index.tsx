import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useRef } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { ORDER_TYPE } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'

import CurrentPrice from '../PositionList/comp/CurrentPrice'
import { Trans } from '@/libs/lingui/react/macro'
import { BNumber } from '@/libs/utils/number/b-number'
import { formatAddress } from '@/libs/utils/format/common'
import { GeneralTooltip } from '@/components/tooltip'
import { TooltipTriggerDottedText } from '@/libs/ui/components/tooltip'
import { Button, IconButton } from '@/libs/ui/components/button'
import { useNiceModal } from '@/components/providers/nice-modal-provider/hooks'
import { SecondaryConfirmationGlobalModalProps } from '@/components/providers/nice-modal-provider/global-modal'
import { GLOBAL_MODAL_ID } from '@/components/providers/nice-modal-provider/register'
import { TradeOrderDirectionEnum } from '../../../_options/order'
import { renderFallback } from '@/libs/utils/format/fallback'
import { Iconify } from '@/libs/ui/components/icons'
// import { SettingPendingTpSlAction } from './_comps/setting-pending-tp-sl-action'
import ModifyPendingOrderModal from '../../../comp/Modal/PendingOrderModifyModal'

export type IPendingItem = Order.OrderPageListItem & {
  /**是否是限价单 */
  isLimitOrder: boolean
}

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
}

// 挂单记录
function PendingList({ style, parentPopup }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { recordListClassName } = useStyle()
  const showActiveSymbol = trade.showActiveSymbol
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'

  let pendingList = trade.pendingList as IPendingItem[]
  let list = showActiveSymbol ? pendingList.filter((v) => v.symbol === trade.activeSymbolName) : pendingList
  // const settingPendingTpSlActionRef = useRef<any>(null)
  const modifyPendingRef = useRef<any>(null)

  const columns: ProColumns<IPendingItem>[] = [
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
      width: 200,
      renderText(text, record, index, action) {
        return <PendingSymbolCell pendingOrderInfo={record} />
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
      width: isZh ? 100 : 120,
      align: 'left',
      className: '!text-[13px] text-primary',
      renderText(text, record, index, action) {
        return <PendingTypeCell pendingOrderInfo={record} />
      }
    },

    {
      title: (
        <>
          <Trans>挂单价</Trans> / <Trans>标记价</Trans>
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
        return <PendingPriceCell pendingOrderInfo={record} />
      }
    },

    {
      title: <FormattedMessage id="mt.shoushu" />,
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
      width: 120,
      align: 'left',
      renderText(text, record, index, action) {
        return <PendingAmountCell pendingOrderInfo={record} />
      }
    },
    {
      title: <FormattedMessage id="mt.zhiyingzhisun2" />,
      dataIndex: 'stopLossProfit',
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
        const AddDom = (
          <span className="font-pf-bold">
            <FormattedMessage id="mt.tianjia" />
          </span>
        )
        return (
          <div>
            <div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  modifyPendingRef.current?.show(record)
                }}
              >
                <span className="!text-[13px] text-primary border-b border-dashed border-gray-weak">
                  {Number(record?.takeProfit) ? formatNum(record?.takeProfit, { precision: record.symbolDecimal }) : AddDom}
                </span>
                <span> / </span>
                <span className="!text-[13px] text-primary border-b border-dashed border-gray-weak">
                  {Number(record?.stopLoss) ? formatNum(record?.stopLoss, { precision: record.symbolDecimal }) : AddDom}
                </span>
              </div>
            </div>
            {/* <div>
              <PendingTpSlCell
                pendingOrderInfo={record}
                onEdit={() => {
                  settingPendingTpSlActionRef.current?.show(record)
                }}
              />
            </div> */}
          </div>
        )
      }
    },

    {
      title: <FormattedMessage id="mt.dingdanhao" />,
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
      width: 200,

      renderText(text, record, index, action) {
        return <PendingIdCell pendingOrderInfo={record} />
      }
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
      title: <FormattedMessage id="common.op" />,
      key: 'option',
      fixed: 'right',
      width: 100,
      align: 'right',
      hideInForm: true,
      hideInSearch: true,
      render: (text, record, _, _action) => {
        return (
          <div className="flex items-center justify-end">
            <PendingCancelOrderAction pendingOrderInfo={record} />
          </div>
        )
      }
    }
  ]

  const dataSource = toJS(list).map((v) => {
    const isLimitOrder = v.type === ORDER_TYPE.LIMIT_BUY_ORDER || v.type === ORDER_TYPE.LIMIT_SELL_ORDER // 限价单
    v.isLimitOrder = isLimitOrder

    return v
  })

  return (
    <>
      <StandardTable
        columns={columns}
        key={trade.currentAccountInfo.id}
        // ghost
        showOptionColumn={false}
        dataSource={dataSource}
        stripe={false}
        hasTableBordered={false}
        hideSearch
        cardBordered={false}
        bordered={false}
        className={recordListClassName}
        cardProps={{
          bodyStyle: { padding: 0 },
          headStyle: { borderRadius: 0 },
          className: ''
        }}
        rowClassName={(record, i) => {
          return record.buySell === 'BUY' ? 'table-row-green' : 'table-row-red'
        }}
        size="small"
        pageSize={6}
      />

      {/* <SettingPendingTpSlAction ref={settingPendingTpSlActionRef} /> */}
      <ModifyPendingOrderModal ref={modifyPendingRef} />
    </>
  )
}

export default observer(PendingList)

const PendingPriceCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(pendingOrderInfo?.limitPrice, {
        volScale: pendingOrderInfo?.symbolDecimal
      })}
      {' / '}
      <CurrentPrice item={pendingOrderInfo} />
    </div>
  )
})

const PendingTypeCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {pendingOrderInfo?.type === ORDER_TYPE.LIMIT_BUY_ORDER ? (
        <FormattedMessage id="mt.xianjiaguadan" />
      ) : (
        <FormattedMessage id="mt.tingsundan" />
      )}
    </div>
  )
})

const PendingSymbolCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  const { colorClassName, text2 } = getBuySellInfo(pendingOrderInfo)
  return (
    <div className="flex items-center gap-medium">
      <SymbolIcon src={pendingOrderInfo.imgUrl} width={24} height={24} />
      <div className="flex flex-col">
        <span className="text-paragraph-p2 text-content-1">{pendingOrderInfo.alias}</span>
        <span className={cn('text-paragraph-p3 text-content-4', colorClassName)}>{text2}</span>
      </div>
    </div>
  )
})

const PendingAmountCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(pendingOrderInfo?.orderVolume, {
        volScale: pendingOrderInfo?.symbolDecimal
      })}
    </div>
  )
})

const PendingIdCell = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  return (
    <div>
      <GeneralTooltip content={<>{pendingOrderInfo?.id}</>} triggerClassName="inline-block">
        <TooltipTriggerDottedText>{formatAddress(pendingOrderInfo?.id, { prefix: 3, suffix: 3 })}</TooltipTriggerDottedText>
      </GeneralTooltip>
    </div>
  )
})

const PendingCancelOrderAction = observer(({ pendingOrderInfo }: { pendingOrderInfo: IPendingItem }) => {
  const { trade } = useStores()

  const secondaryConfirmationDialog = useNiceModal<SecondaryConfirmationGlobalModalProps>(GLOBAL_MODAL_ID.SecondaryConfirmation, {
    title: '撤销挂单',
    message: `确定要撤销该挂单吗？`,
    confirm: {
      cb: async () => {
        await trade.cancelOrder({ id: pendingOrderInfo.id })
      }
    }
  })

  return (
    <div>
      <Button
        onClick={() => {
          secondaryConfirmationDialog.show()
        }}
      >
        <Trans>取消</Trans>
      </Button>
    </div>
  )
})

const PendingTpSlCell = observer(({ pendingOrderInfo, onEdit }: { pendingOrderInfo: IPendingItem; onEdit: () => void }) => {
  const isBuy = pendingOrderInfo?.buySell === TradeOrderDirectionEnum.BUY

  return (
    <div className="flex gap-medium items-center">
      <div className={'text-paragraph-p2 text-content-1'}>
        {renderFallback(
          <span className="text-market-rise">
            {BNumber.toFormatNumber(pendingOrderInfo?.takeProfit, {
              volScale: pendingOrderInfo?.symbolDecimal,
              //止盈：买入方向 ≥，卖出方向 ≤
              prefix: isBuy ? '≥' : '≤'
            })}
          </span>,
          { verify: !!pendingOrderInfo?.takeProfit }
        )}{' '}
        /{' '}
        {renderFallback(
          <span className="text-market-fall">
            {BNumber.toFormatNumber(pendingOrderInfo?.stopLoss, {
              volScale: pendingOrderInfo?.symbolDecimal,
              // 止损：买入方向 ≤，卖出方向 ≥
              prefix: isBuy ? '≤' : '≥'
            })}
          </span>,
          { verify: !!pendingOrderInfo?.stopLoss }
        )}
      </div>

      <IconButton variant={'ghost'} className="p-0.5 rounded-1" onClick={onEdit}>
        <Iconify icon="iconoir:edit" className="size-4" />
      </IconButton>
    </div>
  )
})
