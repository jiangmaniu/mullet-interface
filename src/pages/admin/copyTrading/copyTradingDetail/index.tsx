import { FormattedMessage, useIntl, useLocation, useModel, useParams } from '@umijs/max'
import { useEffect, useMemo, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { CURRENCY } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { IOrderTaker, IOrderTakerState } from '@/models/takers'
import { postTradeFollowFolloerClose } from '@/services/api/tradeFollow/follower'
import { getTradeFollowLeadDetail } from '@/services/api/tradeFollow/lead'
import { colorTextPrimary } from '@/theme/theme.config'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import AccountSelectFull from '../comp/AccountSelectFull'
import { CardContainer } from '../comp/CardContainer'
import Cumulative from '../comp/CardContainer/Cumulative'
import { Performance } from '../comp/CardContainer/Performance'
import Preferences from '../comp/CardContainer/Preferences'
import CopyTradingDatas from '../comp/CopyTradingDatas'
import { Introduction } from '../comp/Introduction'
import NoAccountModal from '../comp/NoAccountModal'
import TabsTable from '../comp/TabsTable'
import TradingSettingModal from '../comp/TradingSettingModal'
import EndModal from './EndModal'
import { defaultTaker, defaultTimeRange, mockNotifications } from './mock'
import { useOverview } from './useOverview'
import { useTabsConfig } from './useTabsConfig'

export default function copyTradingDetail() {
  const intl = useIntl()
  const { setPageBgColor } = useModel('global')

  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const params = useParams()
  const { id } = params
  const location = useLocation()
  const loadingRef = useRef<any>()
  // useEffect(() => {
  //   const query = new URLSearchParams(location.search)
  //   query.get('state') && setTakeState(Number(query.get('state')) as IOrderTakerState)
  // }, [location])

  const [takeState, setTakeState] = useState<IOrderTakerState>(1)

  const [taker, setTaker] = useState<IOrderTaker>(defaultTaker)

  useEffect(() => {
    // 得到 takeId 之后去请求后端数据
    // setTaker(defaultTaker)

    getTradeFollowLeadDetail({
      leadId: String(id)
    }).then((res) => {
      // @ts-ignore
      if (res.success) setTaker(res.data)
    })
  }, [])

  useEffect(() => {
    // 设置当前页背景颜色
    setPageBgColor('#fff')
  }, [])

  const handleSelectAccount = (value: string) => {
    console.log(`selected ${value}`)
  }

  // 系統通知
  const notifications = mockNotifications

  // 时间區間
  const [timeRange, setTimeRange] = useState(defaultTimeRange)
  const timeRangeOptions = [
    {
      value: 'liangzhou',
      label: <FormattedMessage id="mt.liangzhou" />
    },
    {
      value: 'yiyue',
      label: <FormattedMessage id="mt.yiyue" />
    }
  ]
  const onTimeRangeChange = (value: string) => {
    const selected = timeRangeOptions.find((item) => item.value === value)
    if (selected) setTimeRange(selected.value)
  }

  const {
    items: tabs,
    items2: tabs2,
    onChange
  } = useTabsConfig({
    leadId: String(id),
    followerId: String(currentAccountInfo.id),
    defaultTabKey: takeState === 3 ? '1' : '2'
  })

  const tab = useMemo(() => (takeState === 3 ? tabs : tabs2), [takeState])

  // 无账号提示弹窗
  const [openTips, setOpenTips] = useState(false)
  const onOpenChangeTips = (val: boolean) => setOpenTips(val)

  // 跟单配置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const onOpenChangeSetting = (val: boolean) => setOpenSetting(val)

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const ableList = useMemo(() => currentUser?.accountList?.filter((item) => item.status === 'ENABLE') || [], [currentUser])
  const onFollow = (takerState: IOrderTakerState) => {
    if (takerState === 1) {
      if (ableList.length === 0) {
        setOpenTips(true)
        return
      }

      setOpenSetting(true)
    }
  }

  const {
    statistics,
    profitStatistics: { earningRates, profitAmounts },
    symbolStatistics
  } = useOverview({ id })

  const onEnd = () => {
    // todo 跳转
    loadingRef.current?.show()

    setTimeout(() => {
      postTradeFollowFolloerClose({
        followerId: String(currentAccountInfo.id)
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
    }, 500)
  }

  return (
    <div style={{ background: 'linear-gradient(180deg, #F7FDFF 0%, #FFFFFF 25%, #FFFFFF 100%)' }} className="min-h-screen">
      <div className="max-w-[1332px] px-4 mx-auto mt-6">
        <div className="flex items-center">
          <div className="flex items-center w-full gap-x-5">
            <Button
              height={56}
              type="default"
              style={{
                width: 148,
                borderRadius: 12
              }}
              onClick={() => history.back()}
            >
              <div className="flex items-center">
                <img src="/img/uc/arrow-left.png" width={40} height={40} />
                <Iconfont name="daidan" width={22} height={22} hoverColor={colorTextPrimary} />
                <div className="text-[20px] font-bold">
                  <FormattedMessage id="mt.gendan" />
                </div>
              </div>
            </Button>

            <AccountSelectFull
              leadId={String(id)}
              onClick={(item) => {
                push(`/copy-trading/detail/${item.leadId}`)
              }}
            />
          </div>
        </div>
        <div className="mt-10">
          {/* 头部 */}
          <div className="flex items-start justify-between md:gap-4 gap-2">
            <div className="flex flex-col gap-9">
              {/* 帶單人信息 */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-start gap-5">
                  {/* 介绍 */}
                  <Introduction avatar={taker?.imageUrl} name={taker?.projectName} introduction={taker?.desc} tags={taker?.tags} />
                  <CopyTradingDatas
                    datas={{
                      followerNumber: taker?.followNumber || 0,
                      createDayTotal: taker?.createDayTotal || 0,
                      profitTotal: taker?.profitTotal || 0,
                      profitSharingRatio: taker?.profitSharingRatio || 0,
                      assetRequirement: taker?.assetRequirement || 0,
                      remainingGuaranteedAmount: taker?.remainingGuaranteedAmount || 0
                    }}
                    gap="gap-18"
                  />
                </div>
              </div>
            </div>
            {/* 操作区 */}
            <div className="flex flex-col gap-3.5">
              {takeState === 3 ? (
                <>
                  <EndModal
                    onConfirm={onEnd}
                    trigger={
                      <Button
                        height={42}
                        type="primary"
                        danger
                        style={{
                          width: 158,
                          borderRadius: 8
                        }}
                      >
                        <div className=" flex items-center gap-1">
                          <Iconfont name="jieshudaidan" width={20} color="white" height={20} hoverColor={colorTextPrimary} />
                          <span className=" font-semibold text-base ">
                            <FormattedMessage id="mt.jieshugendan" />
                          </span>
                        </div>
                      </Button>
                    }
                  />
                  <Button
                    height={42}
                    type="primary"
                    style={{
                      width: 158,
                      borderRadius: 8,
                      backgroundColor: 'black'
                    }}
                    onClick={() => onFollow(takeState)}
                  >
                    <div className=" flex items-center gap-1">
                      <Iconfont name="gendanguanli" width={20} color="white" height={20} hoverColor={colorTextPrimary} />
                      <span className=" font-semibold text-base text-white ">
                        <FormattedMessage id="mt.shezhi" />
                      </span>
                    </div>
                  </Button>
                </>
              ) : (
                takeState === 1 && (
                  <Button
                    height={42}
                    type="primary"
                    style={{
                      width: 158,
                      borderRadius: 8
                    }}
                    onClick={() => onFollow(takeState)}
                  >
                    <div className=" flex items-center gap-1">
                      <Iconfont name="daidan" width={20} color="white" height={20} hoverColor={colorTextPrimary} />
                      <span className=" font-semibold text-base ">
                        <FormattedMessage id="mt.gendan" />
                      </span>
                    </div>
                  </Button>
                )
              )}
            </div>
          </div>
          {/* 通知 */}
          {/* <div className="mt-7.5 mb-7">
            <Carousel dotPosition="left" items={notifications}></Carousel>
          </div> */}
          {/* 帶單表現，累計盈虧，交易偏好 */}
          <div className=" grid xl:grid-cols-3 sm:grid-cols-1 items-start gap-5 mt-7.5  ">
            <CardContainer
              title={<FormattedMessage id="mt.daidanbiaoxian" />}
              defaultValue={timeRange}
              onChange={onTimeRangeChange}
              options={timeRangeOptions}
            >
              <Performance datas={statistics} />
            </CardContainer>
            <CardContainer
              title={
                <>
                  <FormattedMessage id="mt.leijiyingkui" />({CURRENCY})
                </>
              }
              defaultValue={timeRange}
              onChange={onTimeRangeChange}
              options={timeRangeOptions}
            >
              <Cumulative
                earningRates={earningRates?.map((i) => ({
                  date: i.date,
                  value: i.earningRate
                }))}
                profitAmounts={profitAmounts?.map((i) => ({
                  date: i.date,
                  value: i.profitAmount
                }))}
              />
            </CardContainer>
            <CardContainer
              title={<FormattedMessage id="mt.jiaoyipianhao" />}
              defaultValue={timeRange}
              onChange={onTimeRangeChange}
              options={timeRangeOptions}
            >
              <Preferences datas={symbolStatistics} />
            </CardContainer>
          </div>
          {/* 表格数据 */}
          <div className="mt-9 border border-gray-150 rounded-2xl px-5 bg-white">
            <TabsTable items={tab} onChange={onChange} />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
      <NoAccountModal open={openTips} onOpenChange={onOpenChangeTips} />
      <TradingSettingModal
        leadId={String(id)}
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={() => {
          setTakeState(0)
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
