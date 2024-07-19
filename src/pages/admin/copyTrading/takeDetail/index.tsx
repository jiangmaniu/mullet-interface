import { FormattedMessage, useModel } from '@umijs/max'
import { Select } from 'antd'
import { useEffect, useState } from 'react'

import Carousel from '@/components/Admin/Carousel'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTaker } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'
import { formatNum } from '@/utils'
import { getPathnameLng, push } from '@/utils/navigator'

import AccountSelect from '../comp/AccountSelect'
import { CardContainer } from '../comp/CardContainer'
import { Daidanbiaoxian } from '../comp/CardContainer/Daidanbiaoxian'
import Jiaoyipianhao from '../comp/CardContainer/Jiaoyipianhao'
import Leijiyingkui from '../comp/CardContainer/Leijiyingkui'
import { Introduction } from '../comp/Introduction'
import TakeDatas from '../comp/TakeDatas'
import { defaultTaker, defaultTimeRange, mockNotifications } from './mock'

export default function TakeDetail() {
  const { setPageBgColor } = useModel('global')

  // 獲取路由中的 id
  const { pathname } = getPathnameLng()
  const takeId = pathname.split('/').at(-1)

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

  return (
    <div style={{ background: 'linear-gradient(180deg, #F7FDFF 0%, #FFFFFF 100%)' }} className="min-h-screen">
      <div className="max-w-[1332px] px-4 mx-auto mt-6">
        <div className="flex items-center">
          <div
            className="hover:bg-gray-100 rounded-full cursor-pointer"
            onClick={() => {
              push(`/copy-trading`)
            }}
          >
            <img src="/img/uc/arrow-left.png" width={40} height={40} />
          </div>
          <div className="flex items-center w-full gap-x-5">
            <div className="ml-2 flex items-center">
              {/* <img src="/img/gendan.png" width={24} height={24} /> */}

              <Iconfont name="daidan" width={22} height={22} hoverColor={colorTextPrimary} />
              <div className="text-[20px] font-bold pl-2">
                <FormattedMessage id="mt.daidan" />
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
                  {/* 账户分润 */}
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className=" text-sm font-normal text-gray-600">
                        <FormattedMessage id="mt.leijifenrun" />
                      </span>
                      <Select
                        defaultValue={'778321'}
                        style={{ width: 132, height: 30 }}
                        onChange={handleSelectAccount}
                        labelRender={(option) => <span className=" text-sm">{option.label}</span>}
                        options={[
                          { value: '778341', label: '账户#778341' },
                          { value: '778321', label: '账户#778321' }
                        ]}
                      />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className=" text-3xl font-medium text-black-900"> {taker?.datas.rate1}</span>
                      <span className=" text-sm font-normal text-black-900">USDT</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 帶單人數據 */}
              <div className="flex items-center justify-start gap-18 flex-wrap gap-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-medium">{formatNum(taker?.datas.rate1)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.jinrifenrun" />
                    (USDT)
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-medium">{formatNum(taker?.datas.rate1)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.ruzhutianshu" />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-medium">{formatNum(taker?.datas.rate1)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.daidanbaozhengjinyue" />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-medium">{formatNum(taker?.datas.rate4)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.guanlizichanguimo" />
                  </span>
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
                  <Iconfont name="jiaoyi" width={20} color="white" height={20} hoverColor={colorTextPrimary} />
                  <span className=" font-medium text-base ">
                    <FormattedMessage id="mt.jiaoyi" />
                  </span>
                </div>
              </Button>
              <Button
                height={42}
                type="default"
                style={{
                  width: 158,
                  borderRadius: 8
                }}
                onClick={() => {
                  // todo 跳转
                }}
              >
                <div className=" flex items-center gap-1">
                  <Iconfont name="shezhi" width={20} height={20} hoverColor={colorTextPrimary} />
                  <span className=" font-medium text-base ">
                    <FormattedMessage id="mt.shezhi" />
                  </span>
                </div>
              </Button>
              <Button
                height={42}
                type="default"
                style={{
                  width: 158,
                  borderRadius: 8
                }}
                onClick={() => {
                  // todo 跳转
                }}
              >
                <div className=" flex items-center gap-1">
                  <Iconfont name="fenrunmingxi" width={20} height={20} hoverColor={colorTextPrimary} />
                  <span className=" font-medium text-base ">
                    <FormattedMessage id="mt.fenrunmingxi" />
                  </span>
                </div>
              </Button>
              <Button
                height={42}
                type="primary"
                danger
                style={{
                  width: 158,
                  borderRadius: 8
                }}
                onClick={() => {
                  // todo 跳转
                }}
              >
                <div className=" flex items-center gap-1">
                  <Iconfont name="jiaoyi" width={20} color="white" height={20} hoverColor={colorTextPrimary} />
                  <span className=" font-medium text-base ">
                    <FormattedMessage id="mt.jieshudaidan" />
                  </span>
                </div>
              </Button>
            </div>
          </div>
          {/* 通知 */}
          <div className="mt-7.5 mb-7">
            <Carousel dotPosition="left" items={notifications}></Carousel>
          </div>
          {/* 带单数据 */}
          <div className="border border-gray-150 rounded-2xl w-full pt-3 p-5.5 flex flex-col justify-between gap-5 mb-4.5">
            <span className=" text-black-800 text-xl font-medium">
              <FormattedMessage id="mt.daidanshuju" />
            </span>
            <TakeDatas datas={taker?.datas} />
          </div>
          {/* 帶單表現，累計盈虧，交易偏好 */}
          <div className=" grid xl:grid-cols-3 sm:grid-cols-1 items-start gap-5  ">
            <CardContainer
              title={<FormattedMessage id="mt.daidanbiaoxian" />}
              defaultValue={timeRange}
              onChange={onTimeRangeChange}
              options={timeRangeOptions}
            >
              <Daidanbiaoxian datas={taker?.datas} />
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
              <Leijiyingkui />
            </CardContainer>
            <CardContainer
              title={<FormattedMessage id="mt.jiaoyipianhao" />}
              defaultValue={timeRange}
              onChange={onTimeRangeChange}
              options={timeRangeOptions}
            >
              <Jiaoyipianhao />
            </CardContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
