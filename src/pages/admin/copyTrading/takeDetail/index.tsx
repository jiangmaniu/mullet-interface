import './style.less'

import { FormattedMessage, useIntl, useModel, useParams } from '@umijs/max'
import { Select } from 'antd'
import { useEffect, useRef, useState } from 'react'

import Carousel from '@/components/Admin/Carousel'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { ModalLoading } from '@/components/Base/Lottie/Loading'
import { IOrderTaker } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'
import { message } from '@/utils/message'

import AccountSelectFull from '../comp/AccountSelectFull'
import { CardContainer } from '../comp/CardContainer'
import Cumulative from '../comp/CardContainer/Cumulative'
import { Performance } from '../comp/CardContainer/Performance'
import Preferences from '../comp/CardContainer/Preferences'
import { Introduction } from '../comp/Introduction'
import TabsTable from '../comp/TabsTable'
import TakeDatas from '../comp/TakeDatas'
import TakeSettingModal from '../comp/TakeSettingModal'
import DetailModal from './DetailModal'
import EndModal from './EndModal'
import { defaultTaker, defaultTimeRange, mockNotifications } from './mock'
import { useTabsConfig } from './useTabsConfig'
export default function TakeDetail() {
  const intl = useIntl()
  const { setPageBgColor } = useModel('global')
  const loadingRef = useRef<any>()

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

  const [status, setStatus] = useState<'abled' | 'disabled'>('disabled')
  const [openEnd, setOpenEnd] = useState(false)

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
                <Iconfont name="daidan" width={22} height={22} />
                <div className="text-[20px] font-bold">
                  <FormattedMessage id="mt.daidan" />
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
                  {/* 账户分润 */}
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className=" text-sm font-normal text-gray-600">
                        <FormattedMessage id="mt.leijifenrun" />
                      </span>
                      <Select
                        defaultValue={'778321'}
                        rootClassName=" bg-unset"
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
                      <span className=" text-3xl font-medium text-primary !font-dingpro-medium"> {taker?.datas.rate1}</span>
                      <span className=" text-sm font-normal text-primary">USDT</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 帶單人數據 */}
              {/* <div className="flex items-center justify-start gap-18 flex-wrap gap-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xl font-medium !font-dingpro-medium">{formatNum(taker?.datas.rate1)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.jinrifenrun" />
                    (USDT)
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xl font-medium !font-dingpro-medium">{formatNum(taker?.datas.rate1)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.ruzhutianshu" />
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xl font-medium !font-dingpro-medium">{formatNum(taker?.datas.rate1)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.daidanbaozhengjinyue" />
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xl font-medium !font-dingpro-medium">{formatNum(taker?.datas.rate4)}</span>
                  <span className="text-sm text-gray-600">
                    <FormattedMessage id="mt.guanlizichanguimo" />
                  </span>
                </div>
              </div> */}

              <div className="">
                <Carousel dotPosition="left" items={notifications}></Carousel>
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
                  <span className=" font-semibold text-base ">
                    <FormattedMessage id="mt.jiaoyi" />
                  </span>
                </div>
              </Button>
              <TakeSettingModal
                info={{}}
                trigger={
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
                      <span className=" font-semibold text-base ">
                        <FormattedMessage id="mt.shezhi" />
                      </span>
                    </div>
                  </Button>
                }
              />
              <DetailModal
                trigger={
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
                      <span className=" font-semibold text-base ">
                        <FormattedMessage id="mt.fenrunmingxi" />
                      </span>
                    </div>
                  </Button>
                }
              />

              <Button
                height={42}
                type="primary"
                danger
                style={{
                  width: 158,
                  borderRadius: 8
                }}
                onClick={() => {
                  setOpenEnd(true)
                }}
              >
                <div className=" flex items-center gap-1">
                  <Iconfont name="jiaoyi" width={20} color="white" height={20} hoverColor={colorTextPrimary} />
                  <span className=" font-semibold text-base ">
                    <FormattedMessage id="mt.jieshudaidan" />
                  </span>
                </div>
              </Button>
              <EndModal
                open={openEnd}
                onOpenChange={setOpenEnd}
                onConfirm={() => {
                  if (status === 'abled') {
                    loadingRef.current?.show()
                    setTimeout(() => {
                      loadingRef.current?.close()
                      message.info(intl.formatMessage({ id: 'mt.caozuochenggong' }))
                    }, 3000)
                    setOpenEnd(false)

                    return
                  }

                  setStatus('abled')
                  setOpenEnd(false)
                }}
                status={status}
              />
              <ModalLoading
                ref={loadingRef}
                title={intl.formatMessage({ id: 'mt.jieshudaidan' })}
                tips={intl.formatMessage({ id: 'mt.jieshudaidanzhong' })}
              />
            </div>
          </div>
          {/* 通知 */}
          {/* <div className="mt-7.5">
            <Carousel dotPosition="left" items={notifications}></Carousel>
          </div> */}
          {/* 带单数据 */}
          <div className="mt-2 border border-gray-150 rounded-2xl w-full pt-3 p-5.5 flex flex-col justify-between gap-5 mb-4.5 bg-white">
            <span className=" text-primary text-xl font-medium">
              <FormattedMessage id="mt.daidanshuju" />
            </span>
            <TakeDatas datas={taker?.datas} gap="gap-16" />
          </div>
          {/* 帶單表現，累計盈虧，交易偏好 */}
          <div className=" grid xl:grid-cols-3 sm:grid-cols-1 items-start gap-5  ">
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
              <Preferences datas={[]} />
            </CardContainer>
          </div>
          {/* 表格数据 */}
          <div className="mt-9 border border-gray-150 rounded-2xl px-5 bg-white">
            <TabsTable items={tabs} onChange={onChange} />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}
