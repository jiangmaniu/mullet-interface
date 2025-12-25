import StandardTable from '@/components/Admin/StandardTable'
import columns from '@/components/Admin/StandardTable/demo.tableConfig'
import useStyle from '@/hooks/useStyle'
import { Trans } from '@/libs/lingui/react/macro'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/libs/ui/components/modal'
import { cn } from '@/libs/ui/lib/utils'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { getHistoryPositionRecordDetailModalTableColumns } from './tableConfig'
import { getEnum } from '@/constants/enum'
import { getOrderAllDetail } from '@/services/api/tradeCore/order'
import { useStores } from '@/context/mobxProvider'
import { BNumber } from '@/libs/utils/number'
import { removeEmptyChildren } from '@/utils/tree'

export const HistoryPositionRecordDetailModal = observer(
  forwardRef<{ show: () => void; close: () => void }, { record: Order.BgaOrderPageListItem }>((props, ref) => {
    const { record } = props
    const [isOpen, setIsOpen] = useState(false)
    const { recordListClassName } = useStyle()
    const { trade } = useStores()
    const symbol = trade.showActiveSymbol ? trade.activeSymbolName : undefined

    const onClose = () => {
      setIsOpen(false)
    }

    const show = () => {
      setIsOpen(true)
    }

    useImperativeHandle(ref, () => {
      return {
        show,
        close
      }
    })

    return (
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        {/* {children && <ModalTrigger asChild>{children}</ModalTrigger>} */}

        <ModalContent
          onInteractOutside={(event) => event.preventDefault()}
          className="flex min-h-[460px] w-full overscroll-contain max-w-[1120px] min-w-[600px]"
        >
          <ModalHeader className="w-full">
            <ModalTitle className="flex items-center justify-between gap-3">
              <div className={cn('')}>
                <Trans>历史仓位明细</Trans>
              </div>
            </ModalTitle>
          </ModalHeader>
          <div>
            <StandardTable
              columns={getHistoryPositionRecordDetailModalTableColumns()}
              key={record.id}
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
              size="middle"
              pagination={false}
              params={{ accountId: record.accountId, symbol: record.symbol }}
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
                        price: item.limitPrice ? (
                          BNumber.toFormatNumber(item.limitPrice, { volScale: item.symbolDecimal })
                        ) : (
                          <Trans>市价</Trans>
                        ), // 委托单：请求价
                        // 第三层：成交单
                        children: (item.tradeRecordsInfo || []).map((v) => {
                          return {
                            ...v,
                            direction: getEnum().Enum.OrderInOut[v.inOut as string]?.text, // 交易方向
                            price: BNumber.toFormatNumber(v.inOut === 'IN' ? v.startPrice : v.tradePrice, {
                              volScale: item.symbolDecimal
                            }), // 成交单：成交价
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
          </div>
        </ModalContent>
      </Modal>
    )
  })
)
