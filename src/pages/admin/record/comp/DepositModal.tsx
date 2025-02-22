import { FormattedMessage, useModel } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Iconfont from '@/components/Base/Iconfont'
import { formatNum } from '@/utils'
import { cn } from '@/utils/cn'

import { getEnv } from '@/env'
import { push } from '@/utils/navigator'
import { statusMap } from '..'

type IProps = {
  trigger?: JSX.Element
  item?: Wallet.depositOrderListItem
}

function DepositModal({ item }: IProps, ref: any) {
  const modalRef = useRef<any>()

  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList || []

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  return (
    <Modal
      width={430}
      maskClosable
      title={
        <div className="flex items-center">
          <img src="/img/default-avatar.png" width={40} height={40} />
          <div className="pl-3">
            <div className="text-lg text-primary font-semibold flex flex-row items-center gap-3">
              {item?.type}
              {/* @ts-ignore */}
              <div className="text-sm flex items-center" style={{ color: statusMap[item?.status]?.color }}>
                <span
                  className={cn('w-[6px] h-[6px] rounded-full mr-1 mt-[1px]', item?.status === 'WAIT' && 'animate-pulse')}
                  // @ts-ignore
                  style={{ backgroundColor: statusMap[item?.status]?.color }}
                >
                  {/*  */}
                </span>
                {/* @ts-ignore */}
                {statusMap[item?.status]?.text}
              </div>

              {item?.status === 'WAIT' && (
                <div
                  className="text-sm font-normal underline text-yellow-700 italic mr-1"
                  onClick={() => {
                    push(`/deposit/otc/${item?.id}`)
                  }}
                >
                  <FormattedMessage id="mt.shangchuanpingzheng" />
                </div>
              )}
            </div>
            <div className="text-xs text-secondary pt-1">
              <FormattedMessage id="mt.danhao" />:{item?.orderNo || '-'}
            </div>
          </div>
        </div>
      }
      footer={null}
      ref={modalRef}
    >
      <span className=" text-sm text-primary">{item?.createTime}</span>
      <div className="flex flex-row items-center justify-between flex-wrap gap-4 mt-[14px] text-sm">
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm text-secondary">
            <FormattedMessage id="mt.rujinwangluo" />
          </span>
          <div className="flex flex-row items-center gap-1">
            {item?.channelIcon && (
              <img src={`${getEnv().imgDomain}${item?.channelIcon}`} alt="" width={18} height={18} className="bg-gray-150 rounded-full" />
            )}
            <span>{item?.channelRevealName ?? '[channelRevealName]'}</span>
          </div>
        </div>
        <Iconfont name="zhixiang" width={20} color="black" height={20} />

        <div className="flex flex-col items-start gap-1">
          <span className="text-sm text-secondary">
            <FormattedMessage id="mt.shoukuanzhanghu" />
          </span>
          <div className="flex flex-row items-center gap-1 w-[150px] md:w-[196px] overflow-hidden flex-shrink ">
            <div className="flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white ">
              {accountList.find((v) => v.id === item?.tradeAccountId)?.synopsis?.abbr}
            </div>
            <span className=" text-nowrap text-ellipsis overflow-hidden">
              {accountList.find((v) => v.id === item?.tradeAccountId)?.synopsis?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="h-[.5px] w-full bg-gray-250 my-6"></div>

      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col items-start gap-1">
          <div className=" min-w-[150px] text-base  md:text-xl font-bold">
            {formatNum(item?.orderAmount)} {item?.currency}
          </div>

          <span className="text-sm text-secondary">
            <FormattedMessage id="mt.jine" />
          </span>
        </div>
        <div className="flex flex-row items-center">
          <span className="text-sm text-secondary">
            <FormattedMessage id="mt.shouxufei" />
            &nbsp;
          </span>
          <div className="text-sm text-primary">
            {formatNum(item?.fee)} {item?.currency}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default forwardRef(DepositModal)
