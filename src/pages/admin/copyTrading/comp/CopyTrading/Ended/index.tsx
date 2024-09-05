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
import { IOrder } from '@/models/takers'
import { getTradeFollowFolloerManagementEnd } from '@/services/api/tradeFollow/follower'
import { colorTextPrimary } from '@/theme/theme.config'
import { push } from '@/utils/navigator'

import { TradingItem } from '../TradingItem'
import useColumns from './useColumns'

export default ({ segment, toSquare }: { segment: string; toSquare: VoidFunction }) => {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const [takers, setTakers] = useState<TradeFollowFollower.ManagementEndItem[]>([])
  const [state, setState] = useState({})

  const columns = useColumns()

  // 分页
  const [total, setTotal] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [current, setCurrent] = useState(1)

  const { run, loading } = useRequest(getTradeFollowFolloerManagementEnd, {
    manual: true,
    onSuccess(data, params) {
      if (data?.data) {
        if (data.data.records) {
          setTakers(data.data.records as IOrder[])
          setTotal(data.data.total)
        }
      }
    }
  })

  useEffect(() => {
    if (trade.currentAccountInfo && trade.currentAccountInfo.id && segment === 'yijieshu') {
      run({
        // accountGroupId: currentAccountInfo?.accountGroupId,
        clientId: currentAccountInfo?.clientId,
        // followerTradeAccountId: currentAccountInfo?.id,
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
      {takers.length > 0 ? (
        <>
          {takers.map((item: TradeFollowFollower.ManagementEndItem, idx: number) => (
            <TradingItem
              key={idx}
              item={item}
              state={state}
              columns={columns}
              onClick={() => {
                let _url = `/copy-trading/detail/${item.leadId}`
                if (item.followerId) _url += `?followerId=${item.followerId}`
                push(_url)
              }}
            />
          ))}

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
