import { FormattedMessage, useModel } from '@umijs/max'
import { observer } from 'mobx-react'

import ProList from '@/components/Admin/ProList'
import Iconfont from '@/components/Base/Iconfont'
import { getWithdrawalBankList } from '@/services/api/wallet'
import { formatBankCard } from '@/utils/deposit'
import { Popconfirm } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'
import { IParams } from '../Address'

type IProps = {
  params: IParams
  onSelectItem: (item: Wallet.WithdrawalBank) => void
  onDeleteItem?: (item: Wallet.WithdrawalBank) => void
}

function BankCard({ params, onSelectItem, onDeleteItem }: IProps, ref: any) {
  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList || []

  const onQuery = async (params: IParams) => {
    if (!params.tradeAccountId) return
    const data = await getWithdrawalBankList({
      current: 1,
      size: 1000
    })

    const res = data.data

    let total = res?.total
    let list = res?.records || []
    return { data: list, total, success: true }
  }

  useImperativeHandle(ref, () => ({
    onQuery
  }))

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
      className="home-custom-commision-list"
      ghost
      split={false}
      renderItem={(item: Wallet.WithdrawalBank, index) => (
        <div className="flex flex-col gap-2 mb-5">
          {/* <div className=" font-medium text-gray-900">{item.createTime} </div> */}
          <div className="flex items-center flex-wrap gap-y-4 justify-between border border-gray-150 py-5 px-4 rounded-lg">
            <div className="flex flew-row items-center gap-4 text-start min-w-[180px]">
              <div className=" bg-gray-50 w-10 h-10 rounded-full border-gray-100 flex items-center justify-center">
                <Iconfont name="qianbaodizhi" color="gray" width={18} height={18} />
              </div>
              <div>
                <div className="text-primary font-bold">{item.userName}</div>
                <div className="text-secondary text-xs">{item.bankName}</div>
              </div>
            </div>
            <div className=" flex flex-row gap-2 md:gap-3 items-center justify-center flex-grow">
              <div>
                <div className=" text-xs font-semibold flex-1 flex flex-row gap-2 items-center ">
                  <span>{formatBankCard(item.bankCard || '')}</span>
                  {/* <span>{item.icon || '[icon]'}</span>
                  <span>{item.symbol || '[symbol]'}</span>
                  <span>·</span>
                  <span>
                    <FormattedMessage id="mt.dizhi" />
                  </span>
                  <span>{item.address}</span> */}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              {/* <Button
                onClick={() => {
                  onSelectItem(item)
                }}
              >
                <FormattedMessage id="mt.xiugai" />
              </Button> */}

              <Popconfirm
                title={<FormattedMessage id="mt.tishi" />}
                description={<FormattedMessage id="mt.querenshanchugaidizhima" />}
                onConfirm={() => onDeleteItem?.(item)}
              >
                {/* <span className="text-red-500">
                  <FormattedMessage id="common.delete" />
                </span> */}
                <Iconfont name="lajitong" color="red" width={20} height={20} />
              </Popconfirm>
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default observer(forwardRef(BankCard))
