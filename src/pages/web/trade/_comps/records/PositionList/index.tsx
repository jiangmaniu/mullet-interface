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
import { formatNum, toFixed } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'

import ExplorerLink from '@/components/Wallet/ExplorerLink'
import { useTheme } from '@/context/themeProvider'
import usePageVisibility from '@/hooks/usePageVisibility'
import AddOrExtractMarginModal from './comp/AddOrExtractMarginModal'
import CurrentPrice from './comp/CurrentPrice'
import MarginRate from './comp/MarginRate'
import ProfitYieldRate from './comp/ProfitYieldRate'
import RowTotalProfitYieldRate from './comp/RowTotalProfitYieldRate'
import { ClosePositionAction } from './_comps/close-position-action'
import { Trans } from '@/libs/lingui/react/macro'
import { Button, IconButton } from '@/libs/ui/components/button'
import { Iconify } from '@/libs/ui/components/icons'
import { BNumber } from '@/libs/utils/number'
import { SettingPositionTpSlAction } from './_comps/setting-position-tp-sl-action'
import { renderFallback } from '@/libs/utils/format/fallback'
import { GeneralTooltip } from '@/components/tooltip'
import { TradeOrderDirectionEnum } from '../../../_options/order'
import { AdjustPositionMarginAction } from './_comps/adjust-position-margin-action'

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
  const { recordListClassName } = useStyle()
  const showActiveSymbol = trade.showActiveSymbol

  const [loading, setLoading] = useState(true)

  const closePositionActionRef = useRef<any>(null)
  const settingPositionTpSlActionRef = useRef<any>(null)
  const adjustPositionMarginActionRef = useRef<any>(null)
  const [adjustPositionMarginData, setAdjustPositionMarginData] = useState<any>({} as IPositionItem)

  const addOrExtractMarginRef = useRef<any>(null)
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
        width: 160,
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
        title: (
          <>
            <Trans>开仓均价</Trans> / <Trans>标记价</Trans>
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
        width: 220,
        renderText(text, record, index, action) {
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '

          return <PositionPriceCell positionInfo={record} isOneLevel={isOneLevel} />
        }
      },
      {
        title: (
          <>
            <Trans>保证金</Trans> / <Trans>保证金率</Trans>
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
        width: 220,
        renderText(text, record, index, action) {
          return (
            <PositionMarginCell
              positionInfo={record}
              isOneLevel={isOneLevel}
              onEdit={() => {
                setAdjustPositionMarginData(record)
                adjustPositionMarginActionRef.current?.show(record)

                // addOrExtractMarginRef.current?.show()
              }}
            />
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
          if (isOneLevel && Number(record?.childrenList?.length) > 1) return ' '

          return (
            <div>
              <PositionTpSlCell
                positionInfo={record}
                onEdit={() => {
                  settingPositionTpSlActionRef.current?.show(record)
                }}
              />
            </div>
          )
        }
      },

      {
        title: (
          <>
            <Trans>手续费</Trans>/ <Trans>库存费</Trans>
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
          return <PositionFeesCell positionInfo={record} isOneLevel={isOneLevel} />
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
            <div className="flex gap-2 justify-end">
              <div>
                <Button
                  variant={'primary'}
                  size="sm"
                  color={'default'}
                  onClick={() => {
                    closePositionActionRef.current?.show(record)
                  }}
                >
                  <Trans>平仓</Trans>
                </Button>
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
          backgroundColor: `#0e123a !important`,
          color: `var(--color-text-secondary) !important`
        },
        '.ant-table-container .ant-table-content': {
          '&::-webkit-scrollbar': {
            height: `0px !important`
          }
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
          background: `${isDark ? 'transparent' : '#fff'} !important`,
          boxShadow: 'none'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'none',
          borderRadius: 0,
          background: `${isDark ? 'transparent' : '#fff'}  !important`
        },
        '&::-webkit-scrollbar-corner': {
          boxShadow: 'none',
          borderRadius: 0,
          background: `${isDark ? 'transparent' : '#fff'}  !important`
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
      <Spin spinning={loading}>
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
            className={cn(className, recordListClassName)}
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
                        width: 160,
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
      <ClosePositionAction ref={closePositionActionRef} />
      {/* 设置止损止盈弹窗 */}
      <SettingPositionTpSlAction ref={settingPositionTpSlActionRef} />
      {/* 追加、提取保证金弹窗 */}
      <AdjustPositionMarginAction
        ref={adjustPositionMarginActionRef}
        positionInfo={adjustPositionMarginData}
        onClose={() => setAdjustPositionMarginData({})}
      />
    </>
  )
}

export default observer(Position)

const PositionTpSlCell = observer(({ positionInfo, onEdit }: { positionInfo: IPositionItem; onEdit: () => void }) => {
  const isBuy = positionInfo?.buySell === TradeOrderDirectionEnum.BUY

  return (
    <div className="flex gap-medium items-center">
      <div className={'text-paragraph-p2 text-content-1'}>
        {renderFallback(
          <span className="text-market-rise">
            {BNumber.toFormatNumber(positionInfo?.takeProfit, {
              volScale: positionInfo?.symbolDecimal,
              //止盈：买入方向 ≥，卖出方向 ≤
              prefix: isBuy ? '≥' : '≤'
            })}
          </span>,
          { verify: !!positionInfo?.takeProfit }
        )}{' '}
        /{' '}
        {renderFallback(
          <span className="text-market-fall">
            {BNumber.toFormatNumber(positionInfo?.stopLoss, {
              volScale: positionInfo?.symbolDecimal,
              // 止损：买入方向 ≤，卖出方向 ≥
              prefix: isBuy ? '≤' : '≥'
            })}
          </span>,
          { verify: !!positionInfo?.stopLoss }
        )}
      </div>

      <IconButton variant={'ghost'} className="p-0.5 rounded-1" onClick={onEdit}>
        <Iconify icon="iconoir:edit" className="size-4" />
      </IconButton>
    </div>
  )
})

const PositionFeesCell = observer(({ positionInfo, isOneLevel }: { positionInfo: IPositionItem; isOneLevel: boolean }) => {
  const handlingFees = isOneLevel && Number(positionInfo?.childrenList?.length) ? positionInfo.totalHandlingFees : positionInfo.handlingFees
  const interestFees = isOneLevel && Number(positionInfo?.childrenList?.length) ? positionInfo.totalInterestFees : positionInfo.interestFees

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

const PositionPriceCell = observer(({ positionInfo, isOneLevel }: { positionInfo: IPositionItem; isOneLevel: boolean }) => {
  return (
    <div className="text-paragraph-p2 text-content-1">
      {BNumber.toFormatNumber(positionInfo?.startPrice, {
        volScale: positionInfo?.symbolDecimal,
        positive: false
      })}
      {' / '}
      <CurrentPrice item={positionInfo} />
    </div>
  )
})

const PositionMarginCell = observer(
  ({ positionInfo, isOneLevel, onEdit }: { positionInfo: IPositionItem; isOneLevel: boolean; onEdit: () => void }) => {
    const startPrice = isOneLevel && Number(positionInfo?.childrenList?.length) ? positionInfo.startPrice : positionInfo.startPrice

    const { trade } = useStores()
    const precision = trade.currentAccountInfo.currencyDecimal
    const buySellInfo = getBuySellInfo(positionInfo)
    const orderMargin = positionInfo.orderMargin

    return (
      <div className="text-paragraph-p2 text-content-1">
        <div className="flex gap-1">
          <div>
            {BNumber.toFormatNumber(positionInfo?.orderMargin, {
              volScale: precision,
              unit: 'USDC'
            })}
            {' / '}
            <span className={cn('text-content-4')}>{buySellInfo.marginTypeText}</span>
          </div>

          {positionInfo.marginType === 'ISOLATED_MARGIN' && (
            <div>
              <IconButton
                variant={'ghost'}
                className="p-0.5 rounded-1"
                onClick={() => {
                  onEdit()
                }}
              >
                <Iconify icon="iconoir:edit" className="size-4" />
              </IconButton>
            </div>
          )}
        </div>
        <div>
          (<MarginRate item={positionInfo} />)
        </div>
      </div>
    )
  }
)
