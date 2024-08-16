import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'

import Iconfont from '@/components/Base/Iconfont'
import { IOrderProps } from '@/models/takers'

import { AccountTag } from '../../AccountTag'
import ListItemNumber, { IListItemNumber } from '../../ListItemNumber'

export const TradingItem = ({
  item: { id, title, account, followers, datas },
  columns,
  state,
  onClick,
  children
}: IOrderProps & {
  columns?: IListItemNumber & { label: React.ReactNode; align?: 'left' | 'right' }[]
  onClick?: () => void
  children?: React.ReactNode
}) => {
  return (
    <div className="hover:shadow-md border rounded-lg border-gray-150 flex flex-col flex-1 w-full cursor-pointer" onClick={onClick}>
      {/* header */}
      <div className="flex justify-between py-2.5 px-3.5">
        <div className="flex gap-3  items-center">
          <span className=" text-base font-bold">
            {title}·{id}
          </span>
          <AccountTag type={account.type} />
        </div>
        <span>
          <FormattedMessage id="mt.xiangqing" />
        </span>
      </div>
      {/* footer */}
      <div className="border-t  border-gray-150 px-2 py-4 flex items-center justify-between gap-20 md:flex-nowrap flex-wrap w-full">
        {/* <div className=" grid grid-cols-7 gap-1 items-center "> */}
        <div className=" flex gap-2 items-center ">
          <div className="flex items-center gap-0.5 w-28">
            <Iconfont name="ren" width={38} color="black" height={38} />
            <div className="flex flex-col ">
              <span className=" text-base font-normal leading-5"> {account.id} </span>
              <span className=" text-xs text-gray-600">{account.name}</span>
            </div>
          </div>
          <Iconfont name="zhixiang" width={22} color="black" height={22} />
          {/* <div className="flex gap-3 items-center max-w-28  col-span-5"> */}
          <div className="flex gap-3 items-center max-w-28 ">
            {/* 頭像列表 第一个 */}
            {followers
              .filter((item, idx) => idx < 1)
              .map((item, idx) => {
                return (
                  <div className=" text-primary text-sm font-pf-medium flex gap-1 items-center" key={idx}>
                    <img
                      src={item.avatar}
                      width={24}
                      height={24}
                      className="rounded-full border border-solid border-gray-340"
                      style={{
                        transform: `translateX(${idx * -14}px)`
                      }}
                    />
                    &nbsp;{item.name}
                  </div>
                )
              })}

            {/* {followers.length > 5 && (
              <div
                className="rounded-full  text-primary bg-white flex items-center justify-center text-center text-lg font-medium  w-6 h-6 flex-shrink-0 z-10 "
                style={{
                  transform: `translateX(${5 * -14}px)`
                }}
              >
                <span>...</span>
              </div>
            )} */}
          </div>
        </div>
        {/* flex flex-row justify-between */}
        <div className={classNames(`flex flex-row justify-between flex-1 flex-grow gap-6  `)}>
          {columns?.map((col, idx) => (
            <div className={classNames(`flex flex-col gap-0.5 ${col.align === 'right' ? 'items-end' : 'items-start'}`)} key={idx}>
              <ListItemNumber item={datas} {...col} key={idx} />
              <span className=" text-xs font-normal text-gray-600">{col.label}</span>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  )
}
