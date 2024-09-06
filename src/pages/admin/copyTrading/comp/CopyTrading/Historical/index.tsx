import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'
import { useRequest } from 'ahooks'
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
import useColumns from './useColumns'

export default ({ segment, toSquare }: { segment: string; toSquare: VoidFunction }) => {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const columns = useColumns()
  const [orders, setOrders] = useState<TradeFollowFollower.ManagementHistoryItem>([])

  // 分页
  const [total, setTotal] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [current, setCurrent] = useState(1)

  const { run, loading } = useRequest(getTradeFollowFolloerManagementHistory, {
    manual: true,
    onSuccess(data, params) {
      if (data?.data) {
        if (data.data.records) {
          setOrders(data.data.records)
          setTotal(data.data.total)
        }
      }
    }
  })

  useEffect(() => {
    if (trade.currentAccountInfo && trade.currentAccountInfo.id && segment === 'lishicangwei') {
      run({
        followerId: currentAccountInfo.id,
        size,
        current
      })
    }
  }, [segment, currentAccountInfo, current, size])

  return (
    <div className="flex flex-col gap-5 w-full">
      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0">
          <PageLoading />
        </div>
      )}
      {orders.length > 0 ? (
        <>
          <TabTable columns={columns} datas={orders as any[]} />

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
          <Empty src="/img/empty-gendanguanli.png" description={<FormattedMessage id="common.zanwujilu" />} />
          <Button
            height={44}
            type="primary"
            style={{
              width: 197,
              borderRadius: 8
            }}
            onClick={toSquare}
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
