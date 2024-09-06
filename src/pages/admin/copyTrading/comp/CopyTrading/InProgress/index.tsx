import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { useRequest } from 'ahooks'
import { Pagination } from 'antd'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { DEFAULT_PAGE_SIZE } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { IOrder } from '@/models/takers'
import { getTradeFollowFolloerManagementInProgress, postTradeFollowFolloerClose } from '@/services/api/tradeFollow/follower'
import { colorTextPrimary } from '@/theme/theme.config'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import EndModal from '../../../copyTradingDetail/EndModal'
import TradingSettingModal from '../../TradingSettingModal'
import { TradingItem } from '../TradingItem'
import useColumns from './useColumns'

export default ({ segment, toSquare }: { segment: string; toSquare: VoidFunction }) => {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const [takers, setTakers] = useState<TradeFollowFollower.ManagementInProgressItem[]>([])
  const [state, setState] = useState({})
  const intl = useIntl()

  const [openEnd, setOpenEnd] = useState(false)
  const onOpenChangeEnd = (val: boolean) => setOpenEnd(val)

  // 跟单配置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const [info, setInfo] = useState<TradeFollowFollower.ManagementInProgressItem>({})

  const onOpenChangeSetting = (val: boolean) => setOpenSetting(val)

  const columns = useColumns()

  const loadingRef = useRef<any>()

  // 分页
  const [total, setTotal] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [current, setCurrent] = useState(1)

  const { run, loading } = useRequest(getTradeFollowFolloerManagementInProgress, {
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
    if (trade.currentAccountInfo && trade.currentAccountInfo.id && segment === 'jinxingzhong') {
      run({
        // accountGroupId: currentAccountInfo?.accountGroupId,
        clientId: currentAccountInfo?.clientId,
        // followerTradeAccountId: currentAccountInfo?.id,
        current,
        size
      })
    }
  }, [segment, currentAccountInfo, current, size])

  // 計算未實現盈虧
  const getUnrealizedProfitLoss = (item: TradeFollowFollower.ManagementInProgressItem) => {
    // TODO: 待實現盈虧接口
    return item.unrealizedProfitLoss ? item.unrealizedProfitLoss : 0
  }

  const onEnd = (followerId: string | undefined) => {
    // todo 跳转
    loadingRef.current?.show()

    if (!followerId) {
      message.info(intl.formatMessage({ id: 'mt.caozuoshibai' }))
      return
    }

    setTimeout(() => {
      postTradeFollowFolloerClose({
        followerId
      })
        .then((res) => {
          if (res.success) {
            message.info(intl.formatMessage({ id: 'mt.caozuochenggong' }))
            // 刷新页面
            window.location.reload()
          }
        })
        .finally(() => {
          loadingRef.current?.close()
        })
    }, 300)
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {takers.length > 0 ? (
        <>
          {takers.map((item: TradeFollowFollower.ManagementInProgressItem, idx: number) => (
            <TradingItem
              key={idx}
              item={{ ...item, unrealizedProfitLoss: getUnrealizedProfitLoss(item) }}
              state={state}
              columns={columns}
              onClick={() => {
                let _url = `/copy-trading/detail/${item.leadId}`
                if (item.followerId) _url += `?followerId=${item.followerId}`
                push(_url)
              }}
            >
              <div className=" flex items-center justify-end gap-2.5">
                <Button
                  height={44}
                  type="default"
                  style={{
                    width: 80,
                    borderRadius: 8
                  }}
                  onClick={(e) => {
                    // push(`/copy-trading/management`)
                    e.stopPropagation()
                    setInfo(item)
                    setOpenSetting(true)
                  }}
                >
                  <div className="flex items-center text-sm font-semibold gap-1">
                    <Iconfont name="shezhi" width={16} color="black" height={16} />
                    <FormattedMessage id="mt.shezhi" />
                  </div>
                </Button>
                <Button
                  height={44}
                  type="primary"
                  danger
                  style={{
                    width: 106,
                    borderRadius: 8
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    // push(`/copy-trading/management`)
                    setInfo(item)
                    setOpenEnd(true)
                  }}
                >
                  <div className="flex items-center text-sm font-semibold gap-1">
                    <Iconfont name="jieshudaidan" width={16} color="white" height={16} />
                    <FormattedMessage id="mt.jieshugendan" />
                  </div>
                </Button>
              </div>
            </TradingItem>
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

      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0">
          <PageLoading />
        </div>
      )}

      <EndModal
        id={String(info.followerId)}
        open={openEnd}
        onOpenChange={onOpenChangeEnd}
        onConfirm={onEnd}

        //   () => {
        //   onOpenChangeEnd(false)
        //   loadingRef.current?.show()
        //   setTimeout(() => {
        //     loadingRef.current?.close()
        //     message.info(intl.formatMessage({ id: 'mt.caozuochenggong' }))
        //   }, 3000)
        // }}
      />

      <TradingSettingModal
        leadId={String(info?.leadId)}
        followerId={info?.followerId}
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={() => {
          onOpenChangeSetting(false)
        }}
      />

      <ModalLoading
        ref={loadingRef}
        title={intl.formatMessage({ id: 'mt.jieshugendan' })}
        tips={intl.formatMessage({ id: 'mt.jieshugendanzhong' })}
      />
    </div>
  )
}
