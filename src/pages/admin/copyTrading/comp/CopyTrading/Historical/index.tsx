import { FormattedMessage } from '@umijs/max'
import { Pagination } from 'antd'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { DEFAULT_PAGE_SIZE } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { getTradeFollowFolloerManagementHistory } from '@/services/api/tradeFollow/follower'
import { colorTextPrimary } from '@/theme/theme.config'

import TabTable from '../../TabsTable/Table'
import { orders as mockOrders } from './mock'
import useColumns from './useColumns'

export default ({ segment }: { segment: string }) => {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const columns = useColumns()
  const [orders, setOrders] = useState(mockOrders)

  // 分页
  const [total, setTotal] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    trade.currentAccountInfo &&
      trade.currentAccountInfo.id &&
      segment === 'lishicangwei' &&
      getTradeFollowFolloerManagementHistory({
        followerId: currentAccountInfo.id,
        size,
        current
      })
        .then((res) => {
          if (res.success) {
            // setTakers(res.data)
            if (res.data?.records.length && res.data.records.length > 0) {
              setOrders(res.data.records)
              setTotal(res.data.total)
            }
            // message.info(getIntl().formatMessage({ id: 'mt.caozuochenggong' }))
          }
        })
        .catch((err) => {
          console.log(err)
        })
  }, [segment, currentAccountInfo, current, size])

  return (
    <div className="flex flex-col gap-5 w-full">
      {orders.length > 0 ? (
        <>
          <TabTable columns={columns} datas={orders} />

          <div className="self-end">
            <Pagination
              current={current}
              onChange={setCurrent}
              total={total}
              pageSize={size}
              onShowSizeChange={setSize}
              pageSizeOptions={['10', '20', '50']}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-col h-[36rem] gap-[3rem]">
          <Empty src="/img/empty-gendanguanli.png" description={<FormattedMessage id="mt.zanwujilu" />} />
          <Button
            height={44}
            type="primary"
            style={{
              width: 197,
              borderRadius: 8
            }}
            onClick={() => {
              // todo 跳转
            }}
          >
            <div className="flex items-center text-base font-semibold">
              <Iconfont name="gendanguanli" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.qugendan" />
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
