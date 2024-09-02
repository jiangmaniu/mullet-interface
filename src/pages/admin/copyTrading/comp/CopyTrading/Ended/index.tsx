import { FormattedMessage } from '@umijs/max'
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

  useEffect(() => {
    trade.currentAccountInfo &&
      trade.currentAccountInfo.id &&
      segment === 'yijieshu' &&
      getTradeFollowFolloerManagementEnd({
        accountGroupId: currentAccountInfo?.accountGroupId,
        clientId: currentAccountInfo?.clientId,
        followerTradeAccountId: currentAccountInfo?.id,
        size,
        current
      })
        .then((res) => {
          if (res.success) {
            if (res.data) {
              if (res.data.records) {
                setTakers(res.data.records as IOrder[])
                setTotal(res.data.total)
              }
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
      {takers.length > 0 ? (
        <>
          {takers.map((item: TradeFollowFollower.ManagementEndItem, idx: number) => (
            <TradingItem
              key={idx}
              item={item}
              state={state}
              columns={columns}
              onClick={() => {
                push(`/copy-trading/detail/${item.leadId}`)
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
          <Empty src="/img/empty-gendanguanli.png" description={<FormattedMessage id="mt.zanwujilu" />} />
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
