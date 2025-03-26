import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import ProList from '@/components/Admin/ProList'
import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { getMoneyRecordsPageList } from '@/services/api/tradeCore/account'
import { formatNum } from '@/utils'

import { getAccountSynopsisByLng } from '@/utils/business'
import { IParams } from '..'

type IProps = {
  params: IParams
}

// 划转记录
function Transfer({ params }: IProps) {
  const { trade } = useStores()
  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList || []

  const getTag = (accountId: any) => {
    const synopsis = getAccountSynopsisByLng(accountList.find((item) => item.id === accountId)?.synopsis)

    return synopsis?.abbr
  }

  const onQuery = async (params: IParams) => {
    const { tradeAccountId, firstTradeAccount, ...rest } = params || {}
    const accountId = tradeAccountId || firstTradeAccount
    if (!accountId) return
    const data = await getMoneyRecordsPageList({ current: 1, size: 10, type: 'TRANSFER', accountId, ...rest })

    const res = data.data
    const total = res?.total
    const list = (res?.records || []).filter((item) => item.remark)
    return { data: list, total, success: true }
  }

  return (
    <div>
      <ProList
        rowKey="id" // 设置列表唯一key
        action={{
          query: (params) => onQuery(params)
        }}
        pagination={{
          pageSize: 10,
          // @ts-ignore TODO： ts check 待驗證
          align: 'end'
        }}
        params={params}
        className="px-4 home-custom-commision-list "
        ghost
        split={false}
        renderItem={(item: Account.MoneyRecordsPageListItem, index) => {
          const from = item.remark?.fromAccountId
          const to = item.remark?.toAccountId
          return (
            <div className="mb-5 hover:shadow-sm" key={item.id}>
              <div className="flex items-center pb-2">
                <Iconfont name="shijian1" color={'var(--color-red)'} width={20} height={20} />
                <div className="text-primary pl-1">{item.createTime}</div>
              </div>
              <div className="border border-gray-150 rounded-lg px-3 py-5 grid grid-cols-3 cursor-pointer">
                <div className="flex items-center">
                  <div className="bg-gray-125 rounded-full p-2 w-10 h-10 mr-3 flex items-center justify-center">
                    <Iconfont name="huazhuan" width={18} height={18} />
                  </div>
                  <div>
                    <div className="text-base text-primary font-pf-bold">
                      <FormattedMessage id="mt.huazhuan" />
                    </div>
                    {/* <div className="text-sm text-secondary">
                  <FormattedMessage id="mt.danhao" />
                  ：2042197400471
                </div> */}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="bg-black rounded py-[2px] px-2 mr-[6px] text-white text-xs">{getTag(from)}</div>
                    <div className="text-primary text-sm font-pf-bold">{from}</div>
                  </div>
                  <div className="mx-5 relative top-[2px]">
                    <Iconfont name="zhixiang" width={34} height={28} color="var(--color-text-primary)" />
                  </div>
                  <div className="flex items-center">
                    <div className="bg-black rounded py-[2px] px-2 mr-[6px] text-white text-xs">{getTag(to)}</div>
                    <div className="text-primary text-sm font-pf-bold">{to}</div>
                  </div>
                </div>
                <div className="text-primary text-xl font-dingpro-medium flex items-center justify-end mr-5">
                  {formatNum(item.money)} USD
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}

export default observer(Transfer)
