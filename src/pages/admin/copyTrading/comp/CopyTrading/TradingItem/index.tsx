import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { CURRENCY } from '@/constants'
import { IOrderProps } from '@/models/takers'
import { getColorClass } from '@/utils'
import { push } from '@/utils/navigator'

import { AccountTag } from '../../AccountTag'

export const TradingItem = ({ item: { id, title, account, followers, datas }, state }: IOrderProps) => {
  return (
    <div className=" border rounded-lg border-gray-150 flex flex-col flex-1 w-full">
      {/* header */}
      <div className="flex gap-3 py-2.5 px-3.5 items-center">
        <span className=" text-base font-bold">
          {title}·{id}
        </span>
        <AccountTag type={account.type} />
      </div>
      {/* footer */}
      <div className="border-t  border-gray-150 px-2 py-4 flex items-center justify-between gap-2 md:flex-nowrap flex-wrap">
        <div className=" grid grid-cols-11 gap-1 items-center">
          <div className="flex items-center gap-0.5 col-span-5 w-28">
            <Iconfont name="ren" width={38} color="black" height={38} />
            <div className="flex flex-col ">
              <span className=" text-base font-normal leading-5"> {account.id} </span>
              <span className=" text-xs text-gray-600">{account.name}</span>
            </div>
          </div>
          <Iconfont name="zhixiang" width={22} color="black" height={22} />
          <div className="flex gap-3 items-center max-w-28  col-span-5">
            {/* 頭像列表 前五个 */}
            {followers
              .filter((item, idx) => idx < 5)
              .map((item, idx) => {
                return (
                  <img
                    key={idx}
                    src={item.avatar}
                    width={24}
                    height={24}
                    className="rounded-full border border-solid border-gray-340"
                    style={{
                      transform: `translateX(${idx * -14}px)`
                    }}
                  />
                )
              })}

            {followers.length > 5 && (
              <div
                className="rounded-full  text-black-800 bg-white flex items-center justify-center text-center text-lg font-medium  w-6 h-6 flex-shrink-0 z-10 "
                style={{
                  transform: `translateX(${5 * -14}px)`
                }}
              >
                <span>...</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 md:gap-15 sm:gap-10 gap-6">
          {/* 賬戶保證金 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base !font-dingpro-medium">{datas.rate1}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.zhanghubaozhengjin" />({CURRENCY})
            </span>
          </div>
          {/* 賬戶餘額 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base !font-dingpro-medium">{datas.rate2}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.zhanghuyue" />({CURRENCY})
            </span>
          </div>
          {/* 累計盈虧 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className={classNames('text-base !font-dingpro-medium', getColorClass(datas.rate2))}>
              {datas.rate3 > 0 ? `+${datas.rate3}` : datas.rate3}
            </span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.leijiyingkui" />({CURRENCY})
            </span>
          </div>
          {/* 淨盈虧 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base  !font-dingpro-medium">{datas.rate4}%</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.jingyingkui" />%
            </span>
          </div>
        </div>

        <div className=" flex items-center justify-end gap-3.5">
          <Button
            height={44}
            type="primary"
            style={{
              width: 124,
              borderRadius: 8
            }}
            onClick={() => {
              push(`/copy-trading/management`)
            }}
          >
            <div className="flex items-center text-base">
              <Iconfont name="gendanguanli" width={22} color="white" height={22} />
              <FormattedMessage id="mt.gendanguanli" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
