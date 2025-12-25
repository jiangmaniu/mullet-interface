import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { observer } from 'mobx-react'

import StandardTable from '@/components/Admin/StandardTable'
import { getEnum } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import useStyle from '@/hooks/useStyle'
import { getBgaOrderPage, getOrderAllDetail } from '@/services/api/tradeCore/order'
import { formatNum } from '@/utils'
import { cn } from '@/libs/ui/lib/utils'

import { getColumns } from './tableConfig'

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
          backgroundColor: `#0e123a !important`,
          color: `var(--color-text-secondary) !important`
        }
      }
    }
  })

  return (
    <div>
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
        pageSize={6}
      />
    </div>
  )
}

export default observer(HistoryPositionList)
