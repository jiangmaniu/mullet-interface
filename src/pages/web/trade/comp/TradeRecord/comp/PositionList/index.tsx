import { ProColumns, useIntl } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import { Spin } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import ClosePositionConfirmModal from '@/pages/web/trade/comp/Modal/ClosePositionConfirmModal'
import SetStopLossProfitModal from '@/pages/web/trade/comp/Modal/SetStopLossProfitModal'
import { formatNum } from '@/utils'
import { calcPositionList, getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { getCurrentQuote } from '@/utils/wsUtil'

import AddOrExtractMarginModal from './comp/AddOrExtractMarginModal'

export type IPositionItem = Order.BgaOrderPageListItem & {
  /**格式化浮动盈亏 */
  profitFormat?: string | number
  /**现价 */
  currentPrice?: number | string
  /**收益率 */
  yieldRate?: string
  /**强平价 */
  forceClosePrice?: number
  /**保证金率 */
  marginRate?: string
}

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
}

function Position({ style, parentPopup }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { lng } = useLang()
  const { quotes } = ws
  const isZh = lng === 'zh-TW'
  const intl = useIntl()
  const [modalInfo, setModalInfo] = useState({} as IPositionItem)
  const { recordListClassName } = useStyle()
  const showActiveSymbol = trade.showActiveSymbol
  const accountGroupPrecision = trade.currentAccountInfo.currencyDecimal

  const [loading, setLoading] = useState(true)

  const closePositionRef = useRef<any>(null)
  const stopLossProfitRef = useRef<any>(null)
  const [pageNum, setPageNum] = useState(1)

  const [deplayLoading, setDeplayLoading] = useState(true)

  const positionList = trade.positionList as IPositionItem[]

  const activeSymbolName = trade.activeSymbolName
  let list = showActiveSymbol ? positionList.filter((v) => v.symbol === activeSymbolName) : positionList

  const precision = trade.currentAccountInfo.currencyDecimal

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }, [])

  const columns: ProColumns<IPositionItem>[] = [
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
      width: 180,
      renderText(text, record, index, action) {
        const buySellInfo = getBuySellInfo(record)
        return (
          <div className="flex items-center">
            <SymbolIcon src={record.imgUrl} />
            <div className="flex flex-col pl-4">
              <span className="text-base font-pf-bold text-primary">{record.symbol}</span>
              <span className={cn('text-xs font-medium pt-[2px]', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: <FormattedMessage id="mt.kaicangshoushu" />,
      dataIndex: 'orderVolume',
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
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-primary">{text}</span>
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
        return <span className="!text-[13px] text-primary">{formatNum(text, { precision: record.symbolDecimal })} </span>
      }
    },
    {
      title: <FormattedMessage id="mt.biaojijia" />,
      dataIndex: 'currentPrice',
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
        const quote = getCurrentQuote(record.symbol)
        return (
          <>
            {Number(record.currentPrice) ? (
              <span className={cn('!text-[13px]', quote?.bidDiff > 0 ? 'text-green' : 'text-red')}>
                {formatNum(record.currentPrice, { precision: record.symbolDecimal })}
              </span>
            ) : (
              <span className="!text-[13px]">-</span>
            )}
          </>
        )
      }
    },
    // {
    //   title: <FormattedMessage id="mt.yuguqiangpingjia" />,
    //   dataIndex: 'forceClosePrice',
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
    //     return <span className="!text-[13px] text-primary">{text ? formatNum(text) : '--'} </span>
    //   }
    // },
    {
      title: <FormattedMessage id="mt.baozhengjinlv" />,
      dataIndex: 'marginRate',
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
        return <span className="!text-[13px] text-primary">{text || '-'}</span>
      }
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.baozhengjin" />
          (USD)
        </>
      ),
      dataIndex: 'margin',
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
        const buySellInfo = getBuySellInfo(record)
        const orderMargin = record.orderMargin

        return (
          <div className="flex items-center pl-[1px]">
            <div className="flex flex-col">
              <span className="text-primary text-[13px]">{orderMargin ? formatNum(orderMargin, { precision }) : '--'} </span>
              <span className={cn('text-xs font-medium dark:!text-yellow-600')}>{buySellInfo.marginTypeText}</span>
            </div>
            {/* 逐仓才可以追加保证金 */}
            {record.marginType === 'ISOLATED_MARGIN' && (
              <div className="pl-[6px]">
                {/* 追加、提取保证金 */}
                <AddOrExtractMarginModal
                  trigger={
                    <div className="cursor-pointer">
                      <img src="/img/edit-icon.png" width={30} height={30} />
                    </div>
                  }
                  info={record}
                />
              </div>
            )}
          </div>
        )
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
      width: 180,
      renderText(text, record, index, action) {
        const AddDom = (
          <span className="font-pf-bold">
            <FormattedMessage id="mt.tianjia" />
          </span>
        )
        return (
          <div
            className="cursor-pointer"
            onClick={() => {
              stopLossProfitRef.current?.show(record)
            }}
          >
            <span className="!text-[13px] text-primary border-b border-dashed dark:border-gray-570 border-gray-weak">
              {Number(record?.takeProfit) ? formatNum(record?.takeProfit, { precision: record.symbolDecimal }) : AddDom}
            </span>
            <span className="dark:text-gray-95"> / </span>
            <span className="!text-[13px] text-primary border-b border-dashed dark:border-gray-570 border-gray-weak">
              {Number(record?.stopLoss) ? formatNum(record?.stopLoss, { precision: record.symbolDecimal }) : AddDom}
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
      title: <FormattedMessage id="mt.chicangdanhao" />,
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
      className: '!text-[13px] text-primary'
    },
    {
      title: <FormattedMessage id="mt.fudongyingkui_shouyilv" />,
      dataIndex: 'profit',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 170,
      align: 'center',
      fixed: 'right',
      renderText(text, record, index, action) {
        const profit = record.profit
        const flag = Number(profit) > 0
        const color = flag ? 'text-green' : 'text-red'
        const profitDom = profit ? (
          <span className={cn('font-pf-bold', color)}>{record.profitFormat}</span>
        ) : (
          <span className="!text-[13px]">-</span>
        )
        const yieldRate = record.yieldRate
        return (
          <div className="flex flex-col">
            <div>{profitDom}</div>
            {yieldRate && <div className={cn('!text-xs font-pf-bold', color)}>({yieldRate})</div>}
          </div>
        )
      }
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
          <div className="flex justify-end">
            <div
              className="min-w-[70px] cursor-pointer rounded border border-gray-250 dark:btn-dark px-2 py-[5px] text-center text-primary text-sm"
              onClick={() => {
                closePositionRef.current?.show(record)
              }}
            >
              <FormattedMessage id="mt.pingcang" />
            </div>
          </div>
        )
      }
    }
  ]

  const pageSize = 10
  // 一次性获取全部持仓单然后分页处理避免ws实时计算消耗性能，ws实时推过来会覆盖接口请求的数据
  const dataSource = calcPositionList(toJS(list).slice((pageNum - 1) * pageSize, pageNum * pageSize)).map((v) => {
    // 保证金率
    const { marginRate } = trade.getMarginRateInfo(v)
    v.marginRate = `${marginRate}%`
    return v
  })

  useEffect(() => {
    // 保存格式化过的持仓列表，避免多次计算
    trade.setPositionListCalcCache(dataSource)
  }, [JSON.stringify(dataSource), pageNum])

  return (
    <>
      {/* 加上loading避免右侧闪动问题 */}
      <Spin spinning={loading} style={{ background: 'var(--bg-primary)' }}>
        <StandardTable
          columns={columns}
          // ghost
          dataSource={loading ? [] : dataSource}
          showOptionColumn={false}
          stripe={false}
          hasTableBordered
          hideSearch
          cardBordered={false}
          bordered={false}
          className={recordListClassName}
          cardProps={{
            bodyStyle: { padding: 0 },
            headStyle: { borderRadius: 0 },
            className: ''
          }}
          size="small"
          rowClassName={(record, i) => {
            return record.buySell === 'BUY' ? 'table-row-green' : 'table-row-red'
          }}
          pageSize={pageSize}
          pagination={{
            total: trade.positionList.length,
            onShowSizeChange(current, size) {
              setPageNum(current)
            }
          }}
        />
      </Spin>
      {/* 平仓修改确认弹窗 */}
      <ClosePositionConfirmModal ref={closePositionRef} list={dataSource} />
      {/* 设置止损止盈弹窗 */}
      <SetStopLossProfitModal ref={stopLossProfitRef} list={dataSource} />
    </>
  )
}

export default observer(Position)
