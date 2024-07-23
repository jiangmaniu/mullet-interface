import { FormattedMessage, useModel, useParams } from '@umijs/max'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTaker } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'

import AccountSelect from '../comp/AccountSelect'
import { CardContainer } from '../comp/CardContainer'
import Cumulative from '../comp/CardContainer/Cumulative'
import { Performance } from '../comp/CardContainer/Performance'
import Preferences from '../comp/CardContainer/Preferences'
import { Introduction } from '../comp/Introduction'
import TabsTable from '../comp/TabsTable'
import TakeDatas from '../comp/TakeDatas'
import { defaultTaker, defaultTimeRange, mockNotifications } from './mock'
import { useTabsConfig } from './useTabsConfig'

export default function copyTradingDetail() {
  const { setPageBgColor } = useModel('global')

  const params = useParams()
  const { id } = params

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

  const { items: tabs, onChange } = useTabsConfig()

  return (
    <div style={{ background: 'linear-gradient(180deg, #F7FDFF 0%, #FFFFFF 100%)' }} className="min-h-screen">
      <div className="max-w-[1332px] px-4 mx-auto mt-6">
        <div className="flex items-center">
          <div className="hover:bg-gray-100 rounded-full cursor-pointer" onClick={() => history.back()}>
            <img src="/img/uc/arrow-left.png" width={40} height={40} />
          </div>
          <div className="flex items-center w-full gap-x-5">
            <div className="ml-2 flex items-center">
              {/* <img src="/img/gendan.png" width={24} height={24} /> */}

              <Iconfont name="daidan" width={22} height={22} hoverColor={colorTextPrimary} />
              <div className="text-[20px] font-bold pl-2">
                <FormattedMessage id="mt.gendan" />
              </div>
            </div>
            <AccountSelect />
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
              <Button
                height={42}
                type="primary"
                style={{
                  width: 158,
                  borderRadius: 8
                }}
                onClick={() => {
                  // todo 跳转
                }}
              >
                <div className=" flex items-center gap-1">
                  <Iconfont name="gendanguanli" width={20} color="white" height={20} hoverColor={colorTextPrimary} />
                  <span className=" font-medium text-base ">
                    <FormattedMessage id="mt.gendan" />
                  </span>
                </div>
              </Button>
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
          <div className="mt-9 border border-gray-150 rounded-2xl px-5">
            <TabsTable items={tabs} onChange={onChange} />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}
