import { FormattedMessage, useModel, useParams } from '@umijs/max'
import { useEffect, useState } from 'react'

import Carousel from '@/components/Admin/Carousel'
import Iconfont from '@/components/Base/Iconfont'
import { CURRENCY } from '@/constants'
import { formatNum } from '@/utils'

import AccountSelect from '../comp/AccountSelect'
import TabsTable from '../comp/TabsTable'
import { defaultDatas, mockNotifications } from './mock'
import { useTabsConfig } from './useTabsConfig'

export default function CopyTradingDetail() {
  const { setPageBgColor } = useModel('global')

  useEffect(() => {
    // 设置当前页背景颜色
    setPageBgColor('#fff')
  }, [])

  const params = useParams()
  const { id } = params

  const [order, setOrder] = useState<any>()

  useEffect(() => {
    // 得到 takeId 之后去请求后端数据
    setOrder(defaultDatas)
  }, [])

  // 系統通知
  const notifications = mockNotifications

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
              <Iconfont name="gendan" width={22} height={22} />
              <div className="text-[20px] font-bold pl-2">
                <FormattedMessage id="mt.gendanguanli" />
              </div>
            </div>
            <AccountSelect />
          </div>
        </div>

        <div>
          {/* 头部 */}
          <div className="flex items-start justify-between md:gap-4 gap-2 ">
            <div className="flex flex-col gap-9 mt-10">
              {/* 帶單人信息 */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-start gap-5">
                  {/* 账户分润 */}
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className=" text-sm font-normal text-gray-600">
                        <FormattedMessage id="mt.quanbugendanbaozhengjin" />
                      </span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className=" text-3xl font-medium text-black-900 !font-dingpro-medium"> {order?.datas.rate1}</span>
                      <span className=" text-sm font-normal text-black-900">{CURRENCY}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-6">
                {/* 帶單人數據 */}
                <div className="flex items-center justify-start gap-18 flex-wrap gap-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-medium !font-dingpro-medium">{formatNum(order?.datas.rate1)}</span>
                    <span className="text-sm text-gray-600">
                      <FormattedMessage id="mt.zhanghuzongzichan" />
                      (USD)
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-medium !font-dingpro-medium">{formatNum(order?.datas.rate2)}</span>
                    <span className="text-sm text-gray-600">
                      <FormattedMessage id="mt.leijiyingkui" />
                      (USD)
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-medium !font-dingpro-medium">{formatNum(order?.datas.rate3)}</span>
                    <span className="text-sm text-gray-600">
                      <FormattedMessage id="mt.jingyingkui" />
                    </span>
                  </div>
                </div>
                {/* 通知 */}
                <div>
                  <Carousel dotPosition="left" items={notifications}></Carousel>
                </div>
              </div>
            </div>
            {/* 操作区 */}
            <div className="flex flex-col gap-3.5">
              <img src="/img/follow-icon.png" width={270} height={232} />
            </div>
          </div>
          {/* 表格数据 */}
          <div className="mt-9 border border-gray-150 rounded-2xl px-5">
            <TabsTable items={tabs} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
