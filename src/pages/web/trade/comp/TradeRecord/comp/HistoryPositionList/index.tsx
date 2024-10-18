import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'

import StandardTable from '@/components/Admin/StandardTable'
import { getEnum } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getBgaOrderPage, getOrderAllDetail } from '@/services/api/tradeCore/order'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'
import { removeEmptyChildren } from '@/utils/tree'

import { getColumns } from './tableConfig'
import { getExpandColumns } from './tableConfig.expand'

function HistoryPositionList() {
  const { trade, ws } = useStores()
  const { recordListClassName } = useStyle()
  const symbol = trade.showActiveSymbol ? trade.activeSymbolName : undefined
  const currencyDecimal = trade.currentAccountInfo.currencyDecimal

  const className = useEmotionCss(({ token }) => {
    return {
      '.ant-table-expanded-row.ant-table-expanded-row-level-1': {
        '.ant-table': {
          marginLeft: `0px !important`
        },
        '.ant-table-expanded-row-fixed': {
          marginTop: `-16px !important`
        },
        '.ant-table-thead > tr > th': {
          background: `var(--bg-base-gray) !important`,
          color: `var(--color-text-secondary) !important`
        }
      }
    }
  })

  return (
    <StandardTable
      columns={getColumns(currencyDecimal)}
      // ghost
      showOptionColumn={false}
      stripe={false}
      hasTableBordered
      hideSearch
      cardBordered={false}
      bordered={false}
      cardProps={{
        bodyStyle: { padding: 0 },
        headStyle: { borderRadius: 0 },
        className: ''
      }}
      className={cn(recordListClassName, className)}
      size="middle"
      params={{ accountId: trade.currentAccountInfo.id, symbol }}
      action={{
        // @ts-ignore
        query: (params) => getBgaOrderPage({ ...params, status: 'FINISH', orderByField: 'finishTime', orderBy: 'DESC' })
      }}
      expandable={{
        columnWidth: 30,
        expandedRowRender: (record) => (
          <>
            <StandardTable
              columns={getExpandColumns()}
              key={trade.currentAccountInfo.id}
              ghost
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
              pagination={false}
              size="middle"
              params={{ accountId: trade.currentAccountInfo.id, symbol }}
              action={{
                // @ts-ignore
                query: (params) =>
                  getOrderAllDetail({ id: record.id }).then((res) => {
                    const info = res.data
                    // 第二层：委托单
                    const data = (info?.ordersInfo || []).map((item) => {
                      return {
                        ...item,
                        row_key: item.id,
                        row_type: 'order', // 弹窗类型标识
                        direction: getEnum().Enum.TradeBuySell[item.buySell as string]?.text, // 交易方向
                        price: item.limitPrice ? formatNum(item.limitPrice, { precision: 2 }) : <FormattedMessage id="mt.shijia" />, // 委托单：请求价
                        // 第三层：成交单
                        children: (item.tradeRecordsInfo || []).map((v) => {
                          return {
                            ...v,
                            direction: getEnum().Enum.OrderInOut[v.inOut as string]?.text, // 交易方向
                            price: formatNum(v.inOut === 'IN' ? v.startPrice : v.tradePrice, { precision: 2 }), // 成交单：成交价
                            row_type: 'close', // 弹窗类型标识
                            row_key: v.id
                          }
                        })
                      }
                    })
                    return {
                      total: 1,
                      data: removeEmptyChildren(data),
                      success: true
                    }
                  })
              }}
            />
          </>
        )
        // rowExpandable: (record) => record.symbol !== 'BTC'
      }}
    />
  )
}

export default observer(HistoryPositionList)
