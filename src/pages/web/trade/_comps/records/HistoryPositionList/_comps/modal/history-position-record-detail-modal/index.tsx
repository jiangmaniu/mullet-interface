import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { getEnum } from '@/constants/enum'
import { useStores } from '@/context/mobxProvider'
import { Trans } from '@/libs/lingui/react/macro'
import { DataTable } from '@/libs/table'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/libs/ui/components/modal'
import { cn } from '@/libs/ui/lib/utils'
import { BNumber } from '@/libs/utils/number'
import { getOrderAllDetail } from '@/services/api/tradeCore/order'
import { removeEmptyChildren } from '@/utils/tree'

import { getHistoryPositionRecordDetailModalTableColumns } from './tableConfig'

export const HistoryPositionRecordDetailModal = observer(
  forwardRef<{ show: () => void; close: () => void }, { record: Order.BgaOrderPageListItem }>((props, ref) => {
    const { record } = props
    const [isOpen, setIsOpen] = useState(false)
    const { trade } = useStores()

    const { data: dataSource, isLoading: loading } = useQuery({
      queryKey: ['HistoryPositionRecordDetail', record?.id],
      queryFn: async () => {
        if (!process.env.NEXT_PUBLIC_IS_MOCK && !record?.id) return []
        const res = await getOrderAllDetail({ id: record.id })
        const info = res.data
        // 第二层：委托单
        const data = (info?.ordersInfo || []).map((item) => {
          return {
            ...item,
            row_key: item.id,
            row_type: 'order', // 弹窗类型标识
            direction: getEnum().Enum.TradeBuySell[item.buySell as string]?.text, // 交易方向
            price: item.limitPrice ? BNumber.toFormatNumber(item.limitPrice, { volScale: item.symbolDecimal }) : <Trans>市价</Trans>, // 委托单：请求价
            // 第三层：成交单
            children: (item.tradeRecordsInfo || []).map((v) => {
              return {
                ...v,
                direction: getEnum().Enum.OrderInOut[v.inOut as string]?.text, // 交易方向
                price: BNumber.toFormatNumber(v.inOut === 'IN' ? v.startPrice : v.tradePrice, {
                  volScale: item.symbolDecimal
                }), // 成交单：成交价
                row_type: 'close', // 弹窗类型标识
                row_key: v.id,
                orderVolume: v.tradingVolume // Map tradingVolume to orderVolume for table display
              }
            })
          }
        })
        return removeEmptyChildren(data)
      },
      enabled: isOpen && !!record?.id
    })

    const onClose = () => {
      setIsOpen(false)
    }

    const show = () => {
      setIsOpen(true)
    }

    useImperativeHandle(ref, () => {
      return {
        show,
        close: onClose
      }
    })

    return (
      <Modal open={isOpen} onOpenChange={setIsOpen}>
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
          <div className="flex-1 min-h-0 overflow-hidden">
            <DataTable
              columns={getHistoryPositionRecordDetailModalTableColumns({
                currentAccountInfo: trade.currentAccountInfo
              })}
              data={dataSource || []}
              loading={loading}
              getSubRows={(row: any) => row.children}
              pagination={false}
            />
          </div>
        </ModalContent>
      </Modal>
    )
  })
)
