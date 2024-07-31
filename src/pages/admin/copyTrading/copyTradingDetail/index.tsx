import { FormattedMessage, useLocation, useModel, useParams } from '@umijs/max'
import { useEffect, useMemo, useState } from 'react'

import Footer from '@/components/Admin/Footer'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTaker, IOrderTakerState } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'

import AccountSelectFull from '../comp/AccountSelectFull'
import { CardContainer } from '../comp/CardContainer'
import Cumulative from '../comp/CardContainer/Cumulative'
import { Performance } from '../comp/CardContainer/Performance'
import Preferences from '../comp/CardContainer/Preferences'
import { Introduction } from '../comp/Introduction'
import NoAccountModal from '../comp/NoAccountModal'
import TabsTable from '../comp/TabsTable'
import TakeDatas from '../comp/TakeDatas'
import TradingSettingModal from '../comp/TradingSettingModal'
import EndModal from './EndModal'
import { defaultTaker, defaultTimeRange, mockNotifications } from './mock'
import { useTabsConfig } from './useTabsConfig'

export default function copyTradingDetail() {
  const { setPageBgColor } = useModel('global')

  const params = useParams()
  const { id } = params

  const location = useLocation()
  useEffect(() => {
    const query = new URLSearchParams(location.search)
    query.get('state') && setTakeState(query.get('state') as IOrderTakerState)
  }, [location])

  const [takeState, setTakeState] = useState<IOrderTakerState>('yigendan')

  const [taker, setTaker] = useState<IOrderTaker>()

  useEffect(() => {
    // 得到 takeId 之后去请求后端数据
    setTaker(defaultTaker)
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

  const { items: tabs, items2: tabs2, onChange } = useTabsConfig()

  const tab = useMemo(() => (takeState === 'yigendan' ? tabs : tabs2), [takeState])

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
    if (takerState === 'gendan' || takerState === 'yigendan') {
      if (ableList.length === 0) {
        setOpenTips(true)
        return
      }

      setOpenSetting(true)
    }
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

            <AccountSelectFull />
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
                  <Introduction
                    avatar={taker?.account.avatar}
                    name={taker?.account.name}
                    introduction={taker?.account.introduction}
                    tags={taker?.tags}
                  />
                  <TakeDatas datas={taker?.datas} gap="gap-18" />
                </div>
              </div>
            </div>
            {/* 操作区 */}
            <div className="flex flex-col gap-3.5">
              {takeState === 'yigendan' ? (
                <>
                  <EndModal
                    onConfirm={() => {
                      // todo 跳转
                      setTakeState('gendan')
                    }}
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
                takeState === 'gendan' && (
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
              <Performance datas={taker?.datas} />
            </CardContainer>
            <CardContainer
              title={
                <>
                  <FormattedMessage id="mt.leijiyingkui" />
                  (USDT)
                </>
              }
              defaultValue={timeRange}
              onChange={onTimeRangeChange}
              options={timeRangeOptions}
            >
              <Cumulative />
            </CardContainer>
            <CardContainer
              title={<FormattedMessage id="mt.jiaoyipianhao" />}
              defaultValue={timeRange}
              onChange={onTimeRangeChange}
              options={timeRangeOptions}
            >
              <Preferences />
            </CardContainer>
          </div>
          {/* 表格数据 */}
          <div className="mt-9 border border-gray-150 rounded-2xl px-5 bg-white">
            <TabsTable items={tab} onChange={onChange} />
          </div>
        </div>
      </div>
      <Footer />
      <NoAccountModal open={openTips} onOpenChange={onOpenChangeTips} />
      <TradingSettingModal
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={() => {
          setTakeState('yigendan')
          onOpenChangeSetting(false)
        }}
      />
    </div>
  )
}
