import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import ProList from '@/components/Admin/ProList'
import Iconfont from '@/components/Base/Iconfont'
import { formatNum } from '@/utils'
import { IParams } from '../Address'

type IProps = {
  params: IParams
}

// 入金记录
function BankCard({ params }: IProps) {
  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList || []

  const onQuery = async (params: IParams) => {
    if (!params.tradeAccountId) return
    // const data = await getDepositOrderList({
    //   // current: 1,
    //   // size: 10,
    //   startTime: params.startTime,
    //   endTime: params.endTime,
    //   tradeAccountId: params.tradeAccountId as string
    // })

    // const res = data.data

    // let total = res?.total
    // let list = res?.records || []
    let list: Wallet.WithdrawalAddress[] = []
    let total = 0
    return { data: list, total, success: true }
  }

  return (
    <ProList
      rowKey="orderId" // 设置列表唯一key
      action={{
        query: (params) => onQuery(params)
      }}
      pagination={{
        pageSize: 10
        // align: 'end'
      }}
      params={params}
      className="px-4 home-custom-commision-list"
      ghost
      split={false}
      renderItem={(item: Wallet.DepositRecord, index) => (
        <div className="flex flex-col gap-2 mb-5">
          <div className="text-16 font-medium text-gray-900">{item.createTime} </div>
          <div className="flex items-center flex-wrap gap-y-4 justify-between border border-gray-150 py-5 px-4 rounded-lg">
            <div className="flex flew-row items-center gap-4 text-start min-w-[180px]">
              <div className=" bg-gray-50 w-10 h-10 rounded-full border-gray-100"></div>
              <div>
                <div className="text-primary font-bold">
                  <FormattedMessage id="mt.chujin" />
                </div>
                <div className="text-secondary text-xs">
                  <FormattedMessage id="mt.danhao" />:{item.orderNo}
                </div>
              </div>
            </div>
            <div className=" flex flex-row gap-2 md:gap-3 items-center  justify-center flex-grow">
              <div className="text-end text-sm font-medium flex-1">
                {item.type === 'bank' ? (
                  <span>{item.bank}</span>
                ) : (
                  <span>
                    {item.icon || '[icon]'}
                    {item.channelRevealName || '[channelRevealName]'}
                  </span>
                )}
              </div>
              <div>
                <Iconfont name="zhixiang" width={14} color="black" height={14} />
              </div>
              <div className="flex text-sm font-bold flex-row items-center gap-1 w-[150px] md:w-[196px] overflow-hidden  ">
                <div className="ml-[6px] flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white ">
                  {accountList.find((v) => v.id === item.tradeAccountId)?.synopsis?.abbr}
                </div>
                <span className=" text-nowrap text-ellipsis overflow-hidden">
                  {accountList.find((v) => v.id === item.tradeAccountId)?.synopsis?.name}
                </span>
              </div>
            </div>
            <div className="text-start min-w-[100px]">{item.status || '[status]'}</div>
            <div className="text-end min-w-[150px] text-base  md:text-xl font-bold">
              {formatNum(item.baseOrderAmount)} {item.baseCurrency}
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default observer(BankCard)
