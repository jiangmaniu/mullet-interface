import { ProColumns, useIntl } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Spin } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import LockIcon from '@/components/Base/Svg/LockIcon'
import SelectIcon from '@/components/Base/Svg/SelectIcon'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { TRADE_BUY_SELL } from '@/constants/enum'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import ClosePositionConfirmModal from '@/pages/web/trade/comp/Modal/ClosePositionConfirmModal'
import SetStopLossProfitModal from '@/pages/web/trade/comp/Modal/SetStopLossProfitModal'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'
import { calcForceClosePrice, calcYieldRate, covertProfit, getCurrentQuote } from '@/utils/wsUtil'

import AddOrExtractMarginModal from './comp/AddOrExtractMarginModal'

export type IPositionItem = Order.BgaOrderPageListItem & {
  /**现价 */
  currentPrice?: number | string
  /**收益率 */
  yieldRate?: string
  /**强平价 */
  forceClosePrice?: number
  /**保证金率 */
  marginRate?: string
  /**展开子列表 */
  childrenList?: IPositionItem[]
}

type IProps = {
  style?: React.CSSProperties
  parentPopup?: any
}

function Position({ style, parentPopup }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'
  const intl = useIntl()
  const [modalInfo, setModalInfo] = useState({} as IPositionItem)
  const { recordListClassName } = useStyle()
  const showActiveSymbol = trade.showActiveSymbol

  const [loading, setLoading] = useState(true)

  const closePositionRef = useRef<any>(null)
  const stopLossProfitRef = useRef<any>(null)
  const [pageNum, setPageNum] = useState(1)
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([])
  const expandedRowKeysRef = useRef<any>([])

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
      width: 240,
      renderText(_text, record, index, action) {
        const { colorClassName, text } = getBuySellInfo(record)
        const childrenListLen = record?.childrenList?.length
        if (childrenListLen) {
          return (
            <div className="flex items-center">
              <div className="flex items-center">
                <SymbolIcon src={record.imgUrl} />
                <span className="text-base font-pf-bold text-primary pl-2">{record.alias}</span>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 dark:bg-gray-700 flex items-center font-pf-bold text-primary text-xs flex-shrink justify-center rounded w-[18px] h-[18px] mx-2 p-1">
                  {childrenListLen}
                </div>
                <span className="flex items-center">
                  <span className={cn('text-sm font-pf-bold', colorClassName)}>{record.leverageMultiple}X</span>
                  <LockIcon color={record.buySell === 'BUY' ? 'var(--color-green)' : 'var(--color-red)'} />
                </span>
                <span className="flex">
                  <SelectIcon style={{ transform: expandedRowKeysRef.current.includes(record.id) ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </span>
              </div>
            </div>
          )
        }
        return (
          <div className="flex items-center">
            <SymbolIcon src={record.imgUrl} />
            <div className="flex flex-col pl-4">
              <span className="text-base font-pf-bold text-primary">{record.alias}</span>
              <span className={cn('text-xs font-medium', colorClassName)}>{text}</span>
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
        if (record?.childrenList?.length) return ' '
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
        if (record?.childrenList?.length) return ' '
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
        if (record?.childrenList?.length) return ' '
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
        if (record?.childrenList?.length) return ' '
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
        if (record?.childrenList?.length) return ' '

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
        if (record?.childrenList?.length) return ' '

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
      className: '!text-[13px] text-primary',
      renderText(text, record, index, action) {
        if (record?.childrenList?.length) return ' '
        return <span className="!text-[13px] text-primary">{text}</span>
      }
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
      className: '!text-[13px] text-primary',
      renderText(text, record, index, action) {
        if (record?.childrenList?.length) return ' '
        return <span className="!text-[13px] text-primary">{text}</span>
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
          <FormattedMessage id="mt.fudongyingkui" />/<FormattedMessage id="mt.shouyilv" />
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
      width: 170,
      align: 'center',
      fixed: 'right',
      renderText(text, record, index, action) {
        const profit = record.profit
        const flag = Number(profit) > 0
        const color = flag ? 'text-green' : 'text-red'

        const profitFormat = Number(profit) ? formatNum(profit, { precision }) : profit || '-' // 格式化的
        const profitDom = profit ? (
          <span className={cn('font-pf-bold', color)}>{profitFormat} USD</span>
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
        const isMarketOpen = trade.isMarketOpen(record.symbol)
        return (
          <div className="flex justify-end">
            <div
              className={cn(
                'min-w-[82px] cursor-pointer flex items-center justify-center rounded-[6px] border border-gray-250 dark:btn-dark px-2 py-[5px] text-center text-primary text-sm',
                {
                  '!bg-[--btn-disabled-bg] !cursor-not-allowed': !isMarketOpen
                }
              )}
              onClick={() => {
                if (!isMarketOpen) return
                closePositionRef.current?.show(record)
              }}
            >
              {isMarketOpen ? (
                <FormattedMessage id="mt.pingcang" />
              ) : (
                <>
                  <img src="/img/xiushizhong.png" width={18} height={18} className="mr-1" />
                  <FormattedMessage id="mt.xiushizhong" />
                </>
              )}
            </div>
          </div>
        )
      }
    }
  ]

  // 账户组是锁仓模式下按品种名称分类 统计全仓模式下的品种分类
  const getSymbolGroup = (list: IPositionItem[]) => {
    if (trade.currentAccountInfo.orderMode === 'LOCKED_POSITION') {
      let res: IPositionItem[] = []

      const symbolMap = new Map()
      list.forEach((item) => {
        if (item.marginType === 'CROSS_MARGIN') {
          const symbol = item.symbol
          if (!symbolMap.has(symbol)) {
            symbolMap.set(symbol, [])
          }
          symbolMap.get(symbol).push(item)
        }
      })
      res = Array.from(symbolMap.values()).map((children) => ({
        ...children[0],
        childrenList: children
      }))

      console.log('res', res)

      return res
    }
    return list
  }

  const pageSize = 10
  // 一次性获取全部持仓单然后分页处理避免ws实时计算消耗性能，ws实时推过来会覆盖接口请求的数据
  const dataSource = getSymbolGroup(toJS(list))
    .slice((pageNum - 1) * pageSize, pageNum * pageSize)
    .map((v) => {
      const conf = v.conf as Symbol.SymbolConf
      const symbol = v.symbol as string
      const contractSize = conf.contractSize || 0
      const quoteInfo = getCurrentQuote(symbol)
      const digits = v.symbolDecimal || 2
      const currentPrice = v.buySell === TRADE_BUY_SELL.BUY ? quoteInfo?.bid : quoteInfo?.ask // 价格需要取反方向的
      const isCrossMargin = v.marginType === 'CROSS_MARGIN'

      // if (isCrossMargin) {
      //   // 全仓单笔保证金 = (开盘价 * 合约大小 * 手数) / 杠杆
      //   // 如果没有设置杠杆，读后台配置的杠杆
      //   const prepaymentConf = conf?.prepaymentConf as Symbol.PrepaymentConf
      //   const leverage = prepaymentConf?.mode === 'fixed_leverage' ? prepaymentConf?.fixed_leverage?.leverage_multiple : 0
      //   const leverageMultiple = v.leverageMultiple || leverage
      //   const initialMargin = prepaymentConf?.mode === 'fixed_margin' ? prepaymentConf?.fixed_margin?.initial_margin : 0 // 读后台初始预付款的值

      //   // 存在杠杆
      //   if (leverageMultiple) {
      //     v.orderMargin = toFixed((Number(v.startPrice) * contractSize * Number(v.orderVolume)) / leverageMultiple, digits)
      //   } else {
      //     // 固定保证金 * 手数
      //     v.orderMargin = toFixed(Number(initialMargin) * Number(v.orderVolume || 0), digits)
      //   }
      // } else {
      //   // 逐仓保证金
      //   // v.orderMargin = toFixed(v.orderMargin, digits)
      // }

      // const [exchangeSymbol, exchangeRate] = (v.marginExchangeRate || '').split(',')
      // v.orderMargin =
      //   v.marginType === 'CROSS_MARGIN'
      //     ? calcOrderMarginExchangeRate({
      //         value: v.orderMargin,
      //         exchangeSymbol,
      //         exchangeRate
      //       })
      //     : v.orderMargin
      // 全仓使用基础保证金
      if (isCrossMargin) {
        v.orderMargin = v.orderBaseMargin
      }

      v.currentPrice = currentPrice // 现价
      const profit = covertProfit(v) as number // 浮动盈亏
      // 订单盈亏 = 盈亏 - 手续费 + 库存费
      v.profit = profit - Number(v.handlingFees || 0) + Number(v.interestFees || 0)
      // v.startPrice = toFixed(v.startPrice, digits) // 开仓价格格式化
      v.yieldRate = calcYieldRate(v, precision) // 收益率
      v.forceClosePrice = calcForceClosePrice(v) // 强平价

      // 保证金率
      const { marginRate } = trade.getMarginRateInfo(v)
      v.marginRate = `${marginRate}%`
      return v
    })

  useEffect(() => {
    // 保存格式化过的持仓列表，避免多次计算
    trade.setPositionListCalcCache(dataSource)
  }, [JSON.stringify(dataSource), pageNum])

  const className = useEmotionCss(({ token }) => {
    return {
      '.ant-table-expanded-row.ant-table-expanded-row-level-1': {
        '.ant-table': {
          marginLeft: `0px !important`
        },
        '.ant-table-expanded-row-fixed': {
          paddingTop: '0 !important'
        },
        '.ant-table-thead > tr > th': {
          background: `var(--bg-base-gray) !important`,
          color: `var(--color-text-secondary) !important`
        }
      },
      '.ant-table-expanded-row-fixed': {
        paddingLeft: '0 !important',
        // 设置展开的表格第一行paddingTop
        '.ant-table-tbody tr:nth-child(2) > td': {
          paddingTop: '16px !important'
        }
      }
    }
  })

  return (
    <>
      {/* 加上loading避免右侧闪动问题 */}
      <Spin spinning={loading} style={{ background: 'var(--bg-primary)' }}>
        <StandardTable
          columns={columns}
          key={trade.currentAccountInfo.id}
          // ghost
          dataSource={loading ? [] : dataSource}
          showOptionColumn={false}
          stripe={false}
          hasTableBordered
          hideSearch
          cardBordered={false}
          bordered={false}
          className={cn(recordListClassName, className)}
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
            total: showActiveSymbol ? positionList.filter((v) => v.symbol === activeSymbolName).length : trade.positionList.length,
            onShowSizeChange(current, size) {
              setPageNum(current)
            }
          }}
          expandable={{
            // columnWidth: 30,
            showExpandColumn: false,
            expandRowByClick: true, // 点击行展开
            rowExpandable: (record) => true, // 可展开行
            expandedRowKeys,
            onExpandedRowsChange(expandedRowKeys) {
              console.log('expandedRowKeys', expandedRowKeys)
              setExpandedRowKeys(expandedRowKeys)
              expandedRowKeysRef.current = expandedRowKeys
            },
            expandedRowRender: (record) => {
              return (
                <StandardTable
                  columns={[
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
                      width: 240,
                      renderText(text, record, index, action) {
                        const buySellInfo = getBuySellInfo(record)
                        return (
                          <div className="flex items-center">
                            <div className="flex flex-col pl-[32px]">
                              <span className="text-base font-pf-bold text-primary">{record.alias || record.symbol}</span>
                              <span className={cn('text-xs font-medium', buySellInfo.colorClassName)}>{buySellInfo.text}</span>
                            </div>
                          </div>
                        )
                      }
                    },
                    ...columns.slice(1)
                  ]}
                  key={trade.currentAccountInfo.id}
                  // ghost
                  dataSource={loading ? [] : dataSource}
                  showOptionColumn={false}
                  stripe={false}
                  hasTableBordered
                  hideSearch
                  cardBordered={false}
                  bordered={false}
                  showHeader={false}
                  className={recordListClassName}
                  cardProps={{
                    bodyStyle: { padding: 0 },
                    headStyle: { borderRadius: 0 },
                    className: ''
                  }}
                  size="small"
                  pagination={false}
                  rowClassName={(record, i) => {
                    return record.buySell === 'BUY' ? 'table-row-green' : 'table-row-red'
                  }}
                />
              )
            },

            expandIcon: ({ expanded, onExpand, record }) => {
              return <></>
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
