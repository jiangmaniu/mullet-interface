import { ProColumns, useIntl } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Spin } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import StandardTable from '@/components/Admin/StandardTable'
import SelectIcon from '@/components/Base/Svg/SelectIcon'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { useEnv } from '@/context/envProvider'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import ClosePositionConfirmModal from '@/pages/web/trade/comp/Modal/ClosePositionConfirmModal'
import SetStopLossProfitModal from '@/pages/web/trade/comp/Modal/SetStopLossProfitModal'
import { formatNum, toFixed } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'

import { useTheme } from '@/context/themeProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import AddOrExtractMarginModal from './comp/AddOrExtractMarginModal'
import CurrentPrice from './comp/CurrentPrice'
import MarginRate from './comp/MarginRate'
import ProfitYieldRate from './comp/ProfitYieldRate'
import RowTotalProfitYieldRate from './comp/RowTotalProfitYieldRate'

export type IPositionItem = Order.BgaOrderPageListItem & {
  /**合并汇总展开行的手续费 */
  totalHandlingFees?: number
  /**合并汇总展开行的库存费 */
  totalInterestFees?: number
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

  const positionList = trade.positionList as IPositionItem[]

  const activeSymbolName = trade.activeSymbolName
  let list = showActiveSymbol ? positionList.filter((v) => v.symbol === activeSymbolName) : positionList

  const precision = trade.currentAccountInfo.currencyDecimal

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }, [])

  useEffect(() => {
    const posIds = positionList.map((item) => item.id)
    expandedRowKeysRef.current = (expandedRowKeysRef.current || []).filter((id: string) => posIds.includes(id)) // 过滤掉不存在的id
  }, [positionList.length])

  const isExpandCurrentRow = (id: string) => expandedRowKeysRef.current.includes(id)

  const getColumns = (key?: 'expand' | 'oneLevel'): ProColumns<IPositionItem>[] => {
    const isOneLevel = key === 'oneLevel'

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
        width: 240,
        renderText(_text, record, index, action) {
          const { colorClassName, text } = getBuySellInfo(record)
          const childrenListLen = Number(record?.childrenList?.length)
          if (childrenListLen > 1) {
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
                  {/* <span className="flex items-center">
                    {!!record.leverageMultiple && (
                      <span className={cn('text-sm font-pf-bold', colorClassName)}>{record.leverageMultiple}X</span>
                    )} */}
                  {/**<LockIcon color={record.buySell === 'BUY' ? 'var(--color-green)' : 'var(--color-red)'} /> */}
                  {/* </span> */}
                  <span className="flex">
                    <SelectIcon style={{ transform: isExpandCurrentRow(record.id) ? 'rotate(180deg)' : 'rotate(0deg)' }} />
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
        width: 90,
        align: 'left',
        renderText(text, record, index, action) {
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '
          return <span className="!text-[13px] text-primary">{formatNum(text, { precision: 2 })}</span>
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
        width: 110,
        renderText(text, record, index, action) {
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '
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
        width: 110,
        renderText(text, record, index, action) {
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '
          return <CurrentPrice item={record} />
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
        width: isZh ? 115 : 125,
        renderText(text, record, index, action) {
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '
          return (
            <span className="!text-[13px] text-primary">
              <MarginRate item={record} />
            </span>
          )
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
        width: 120,
        renderText(text, record, index, action) {
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '

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
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '

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
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '
          return <span className="!text-[13px] text-primary">{record.id}</span>
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
          return <span className="!text-[13px] text-primary">{record.createTime}</span>
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
        width: isZh ? 110 : 150,
        renderText(text, record, index, action) {
          const handlingFees = isOneLevel && Number(record?.childrenList?.length) ? record.totalHandlingFees : text
          return <span className="!text-[13px] text-primary">{handlingFees ? formatNum(handlingFees, { precision }) : '0.00'}</span>
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
        width: 110,
        renderText(text, record, index, action) {
          const interestFees = isOneLevel && Number(record?.childrenList?.length) ? record.totalInterestFees : text
          return <span className="!text-[13px] text-primary">{interestFees ? formatNum(interestFees, { precision }) : '0.00'}</span>
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
        width: 150,
        align: 'center',
        fixed: 'right',
        renderText(text, record, index, action) {
          if (isOneLevel && record.childrenList?.length) return <RowTotalProfitYieldRate childrenList={record.childrenList} />
          return <ProfitYieldRate item={record} />
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
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '
          return (
            <div className="flex justify-end">
              <div
                className="min-w-[82px] cursor-pointer rounded-[6px] border border-gray-250 dark:btn-dark px-2 py-[5px] text-center text-primary text-sm"
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
  }

  // 账户组是锁仓模式下按品种名称分类 统计全仓模式下的品种分类
  const getSymbolGroup = (list: IPositionItem[]) => {
    if (trade.currentAccountInfo.orderMode === 'LOCKED_POSITION') {
      // 分离全仓和逐仓仓位
      const crossMarginPositions = list.filter((item) => item.marginType === 'CROSS_MARGIN')
      const isolatedPositions = list.filter((item) => item.marginType === 'ISOLATED_MARGIN')

      // 处理全仓仓位分组
      const symbolMap = new Map()
      crossMarginPositions.forEach((item) => {
        const symbol = item.symbol
        if (!symbolMap.has(symbol)) {
          symbolMap.set(symbol, [])
        }
        symbolMap.get(symbol).push(item)
      })

      // 将全仓分组转换为所需格式，并与逐仓仓位合并
      const groupedCrossMargin = Array.from(symbolMap.entries()).map(([symbol, children]) => ({
        ...children.at(-1), // 获取最后一项时间最早的作为展开行之前的数据
        totalHandlingFees: (children || []).reduce((acc: number, item: IPositionItem) => acc + Number(item.handlingFees || 0), 0), // 合并手续费
        totalInterestFees: (children || []).reduce((acc: number, item: IPositionItem) => acc + Number(item.interestFees || 0), 0), // 合并库存费
        childrenList: children.map((v: IPositionItem) => {
          const digits = v.symbolDecimal || 2
          if (v.marginType === 'CROSS_MARGIN') {
            v.orderMargin = v.orderBaseMargin
          }
          v.startPrice = toFixed(v.startPrice, digits) // 开仓价格格式化
          return v
        })
      }))

      // 合并全仓分组和逐仓仓位
      return [...groupedCrossMargin, ...isolatedPositions]
    }
    return list
  }

  const pageSize = 6
  const dataSource = getSymbolGroup(toJS(list)).map((v) => {
    const conf = v.conf as Symbol.SymbolConf
    const symbol = v.symbol as string
    const contractSize = conf.contractSize || 0
    const digits = v.symbolDecimal || 2
    const isCrossMargin = v.marginType === 'CROSS_MARGIN'

    // 全仓使用基础保证金
    if (isCrossMargin) {
      v.orderMargin = v.orderBaseMargin
    }

    // const profit = covertProfit(v) as number // 浮动盈亏
    // v.profit = profit
    v.startPrice = toFixed(v.startPrice, digits) // 开仓价格格式化
    // v.yieldRate = calcYieldRate(v, precision) // 收益率
    // v.forceClosePrice = calcForceClosePrice(v) // 强平价

    // 保证金率
    // const { marginRate } = trade.getMarginRateInfo(v)
    // v.marginRate = `${marginRate}%`
    return v
  })

  const themeConfig = useTheme()
  const themeMode = themeConfig.theme.mode
  const isDark = themeMode === 'dark'

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
        paddingRight: '0 !important',
        marginBottom: '-17px !important',
        // 设置展开的表格第一行paddingTop
        '.ant-table-tbody tr:nth-child(2) > td': {
          paddingTop: '16px !important'
        }
      },
      '.ant-table-expanded-row .ant-table': {
        marginInline: '0 !important'
      },
      '.ant-table > .ant-table-container .ant-table-body': {
        '&::-webkit-scrollbar': {
          height: `7px !important`,
          width: 4,
          scrollbarColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 5,
          background: `${isDark ? '#161A1E' : '#fff'} !important`,
          boxShadow: 'none'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'none',
          borderRadius: 0,
          background: `${isDark ? '#161A1E' : '#fff'}  !important`
        }
      },
      '.ant-table:hover .ant-table-container .ant-table-body': {
        '&::-webkit-scrollbar-thumb': {
          background: isDark ? '#2A2A32 !important' : 'rgba(0, 0, 0, 0.07)',
          borderRadius: 5,
          boxShadow: isDark ? 'inset 0 0 10px #2A2A32' : 'inset 0 0 10px rgba(0, 0, 0, 0.07)'
        }
      }
    }
  })

  const handleScrollTable = (e: any) => {
    const rootTableBody = document.querySelector('.ant-table-body')
    const items = Array.from(document.querySelectorAll('.ant-table-content'))
    // 拖动任意表格 联动多表格滚动条
    items.forEach((item) => {
      item.scrollLeft = e.target.scrollLeft
    })

    // 联动最外层表格滚动条
    if (rootTableBody) {
      rootTableBody.scrollLeft = e.target.scrollLeft
    }
  }

  const [forceUpdateKey, setForceUpdateKey] = useState(0)

  usePageVisibility(
    () => {
      setForceUpdateKey((prev) => prev + 1)
    },
    () => {
      //
    }
  )

  return (
    <>
      {/* 加上loading避免右侧闪动问题 */}
      <Spin spinning={loading} style={{ background: 'var(--bg-primary)' }}>
        <div onScrollCapture={handleScrollTable} key={forceUpdateKey}>
          <StandardTable
            columns={getColumns('oneLevel')}
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
            scroll={{ y: 410 }}
            size="small"
            rowClassName={(record, i) => {
              let className = record.buySell === 'BUY' ? 'table-row-green' : 'table-row-red'
              className = isExpandCurrentRow(record.id) ? `${className} !bg-[--bg-base-gray] position-table-expand-row` : className
              return className
            }}
            pageSize={pageSize}
            pagination={{
              total: showActiveSymbol ? dataSource.filter((v) => v.symbol === activeSymbolName).length : dataSource.length,
              onShowSizeChange(current, size) {
                setPageNum(current)
              }
            }}
            expandable={{
              // columnWidth: 30,
              showExpandColumn: false,
              expandRowByClick: true, // 点击行展开
              rowExpandable: (record) => Number(record.childrenList?.length || 0) > 1, // 可展开行
              expandedRowKeys,
              onExpandedRowsChange(expandedRowKeys) {
                // console.log('expandedRowKeys', expandedRowKeys)
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
                      ...getColumns('expand').slice(1)
                    ]}
                    key={trade.currentAccountInfo.id}
                    // ghost
                    dataSource={record?.childrenList || []}
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
        </div>
      </Spin>
      {/* 平仓修改确认弹窗 */}
      <ClosePositionConfirmModal ref={closePositionRef} />
      {/* 设置止损止盈弹窗 */}
      <SetStopLossProfitModal ref={stopLossProfitRef} />
    </>
  )
}

export default observer(Position)
