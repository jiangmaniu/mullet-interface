import { FormattedMessage } from '@umijs/max'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { IOrder } from '@/models/takers'
import { getTradeFollowFolloerManagementEnd } from '@/services/api/tradeFollow/follower'
import { colorTextPrimary } from '@/theme/theme.config'
import { push } from '@/utils/navigator'

import { defaultTakers } from '../mock'
import { TradingItem } from '../TradingItem'
import useColumns from './useColumns'

export default ({ active }: { active: boolean }) => {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const [takers, setTakers] = useState<TradeFollowFollower.ManagementEndItem[]>(defaultTakers)
  const [state, setState] = useState({})

  const columns = useColumns()

  useEffect(() => {
    active &&
      getTradeFollowFolloerManagementEnd({
        accountGroupId: currentAccountInfo?.accountGroupId,
        clientId: currentAccountInfo?.clientId,
        followerTradeAccountId: currentAccountInfo?.id
      })
        .then((res) => {
          if (res.success) {
            // setTakers(res.data)
            if (res.data?.length && res.data.length > 0) {
              setTakers(res.data as IOrder[])
            }
            // message.info(getIntl().formatMessage({ id: 'mt.caozuochenggong' }))
          }
        })
        .catch((err) => {
          console.log(err)
        })
  }, [active, currentAccountInfo])

  return (
    <div className="flex flex-col gap-5 w-full">
      {takers.length > 0 ? (
        takers.map((item: TradeFollowFollower.ManagementEndItem, idx: number) => (
          <TradingItem
            key={idx}
            item={item}
            state={state}
            columns={columns}
            onClick={() => {
              push(`/copy-trading/detail/1`)
            }}
          />
        ))
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
