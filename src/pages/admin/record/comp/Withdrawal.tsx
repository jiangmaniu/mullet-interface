import './index.less'

import { FormattedMessage, getIntl, useModel } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import ProList from '@/components/Admin/ProList'
import Iconfont from '@/components/Base/Iconfont'
import { getWithdrawalOrderList } from '@/services/api/wallet'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

import { IParams } from '..'
import { statusMap } from '../index'

type IProps = {
  params: IParams
  onSelectItem?: (item: Wallet.withdrawalOrderListItem) => void
}

// 入金记录
function Withdrawal({ params, onSelectItem }: IProps) {
  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList || []

  // const mockList: Wallet.DepositRecord[] = [
  //   {
  //     icon: '',
  //     orderId: '2042197400471',
  //     createTime: '2024-12-04 14:59:59',
  //     amount: 1000,
  //     type: 'crypto',
  //     currency: 'USDT',
  //     chain: 'ERC 20',
  //     status: 'pending',
  //     toAccountId: '1859151139088416770'
  //   },
  //   {
  //     icon: '',
  //     orderId: '2042197400472',
  //     createTime: '2024-12-04 14:59:59',
  //     amount: 1000,
  //     type: 'bank',
  //     currency: 'USD',
  //     bank: 'Bank of America',
  //     status: 'finished',
  //     toAccountId: '1826513486237188098'
  //   },
  //   {
  //     icon: '',
  //     orderId: '2042197400473',
  //     createTime: '2024-12-04 14:59:59',
  //     amount: 1000,
  //     type: 'bank',
  //     currency: 'USD',
  //     bank: 'Bank of America',
  //     status: 'failed',
  //     toAccountId: '1826513486237188098'
  //   },
  //   {
  //     icon: '',
  //     orderId: '2042197400474',
  //     createTime: '2024-12-04 14:59:59',
  //     amount: 1000,
  //     type: 'bank',
  //     currency: 'USD',
  //     bank: 'Bank of America',
  //     status: 'beginning',
  //     toAccountId: '1826513486237188098'
  //   }
  // ]

  const onQuery = async (params: IParams) => {
    if (!params.tradeAccountId) return
    const data = await getWithdrawalOrderList({
      // current: 1,
      // size: 10,
      startTime: params.startTime,
      endTime: params.endTime,
      tradeAccountId: params.tradeAccountId as string
    })

    const res = data.data

    let total = res?.total
    let list = res?.records || []
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
        <div className="flex flex-col gap-2 mb-5 hover:shadow-sm cursor-pointer" onClick={() => onSelectItem?.(item)}>
          <div className="text-16 font-medium text-gray-900">{item.createTime} </div>
          <div className="flex items-center flex-wrap gap-y-4 justify-between border border-gray-150 py-5 px-4 rounded-lg">
            <div className="flex flew-row items-center gap-4 text-start min-w-[180px]">
              <div className=" bg-gray-50 w-10 h-10 rounded-full border-gray-100 flex items-center justify-center">
                <Iconfont name="chujin" color="gray" width={18} height={18} />
              </div>
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
              <div className="flex flex-row items-center gap-1 w-[150px] md:w-[196px] overflow-hidden flex-shrink justify-end ">
                <div className="ml-[6px] flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white ">
                  {accountList.find((v) => v.id === item.tradeAccountId)?.synopsis?.abbr}
                </div>
                <span className=" text-nowrap text-ellipsis overflow-hidden">
                  {accountList.find((v) => v.id === item.tradeAccountId)?.synopsis?.name}
                </span>
              </div>
              <div>
                <Iconfont name="zhixiang" width={14} color="black" height={14} />
              </div>
              <div className="text-end ">
                {item.type === 'bank' ? (
                  <span>{item.bank}</span>
                ) : (
                  <div className="flex flex-row items-center gap-1">
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <Iconfont name="qianbaodizhi" width={14} color="white" height={14} />
                    </div>
                    <span>{item.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-start min-w-[100px] flex flex-row gap-2" onClick={(e) => e.stopPropagation()}>
              {/* @ts-ignore */}
              <div className="text-sm flex items-center" style={{ color: statusMap[item.status]?.color }}>
                <span
                  className={cn('w-[6px] h-[6px] rounded-full mr-1 mt-[1px]', item.status === 'WAIT' && 'animate-pulse')}
                  // @ts-ignore
                  style={{ backgroundColor: statusMap[item.status]?.color || '#9C9C9C' }}
                >
                  {/*  */}
                </span>
                {/* @ts-ignore */}
                {statusMap[item.status]?.text || '[status]'}
              </div>
              {item.status === 'beginning' && (
                <Popconfirm
                  title=""
                  description={getIntl().formatMessage({ id: 'mt.ningquedingchexiaochujinshenqing' })}
                  onConfirm={() => {}}
                  onCancel={() => {}}
                  okText={getIntl().formatMessage({ id: 'mt.queding' })}
                  cancelText={getIntl().formatMessage({ id: 'mt.quxiao' })}
                >
                  <Button size="small" type="primary">
                    {getIntl().formatMessage({ id: 'mt.chexiao' })}
                  </Button>
                </Popconfirm>
              )}
            </div>
            <div className="text-end min-w-[180px] text-base  md:text-xl font-bold">
              {formatNum(item.orderAmount)} {item.baseCurrency}
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default observer(Withdrawal)
