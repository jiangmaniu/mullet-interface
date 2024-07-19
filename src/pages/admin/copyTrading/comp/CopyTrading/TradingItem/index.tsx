import { FormattedMessage } from '@umijs/max'
import { Tag } from 'antd'
import classNames from 'classnames'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderProps } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'

export const TradingItem = ({ item: { id, title, account, followers, datas }, state }: IOrderProps) => {
  const getColor = (val: number) => (val > 0 ? 'text-green' : 'text-red')

  return (
    <div className=" border rounded-lg border-gray-150 flex flex-col flex-1 w-full">
      {/* header */}
      <div className="flex gap-3 py-2.5 px-3.5">
        <span className=" text-base font-bold">
          {title}·{id}
        </span>
        {account.type === 'biaozhun' ? (
          <Tag style={{ background: 'var(--color-yellow-490)', width: '2.625rem', height: '1.25rem', fontSize: '0.75rem' }}>
            <FormattedMessage id={`mt.${account.type}`} />
          </Tag>
        ) : account.type === 'luodian' ? (
          <Tag
            style={{
              background: 'var(--color-green-700)',
              color: 'white',
              width: '2.625rem',
              height: '1.25rem',
              fontSize: '0.75rem'
            }}
          >
            <FormattedMessage id={`mt.${account.type}`} />
          </Tag>
        ) : (
          <Tag style={{ background: 'black', color: 'white', width: '2.625rem', height: '1.25rem', fontSize: '0.75rem' }}>
            <FormattedMessage id={`mt.${account.type}`} />
          </Tag>
        )}
      </div>
      {/* footer */}
      <div className="border-t  border-gray-150 px-2 py-4 flex items-center justify-between">
        <div className=" flex flex-row gap-2 items-center">
          <div className="flex items-center gap-0.5">
            <Iconfont name="ren" width={38} color="black" height={38} hoverColor={colorTextPrimary} />
            <div className="flex flex-col ">
              <span className=" text-base font-normal leading-5"> {account.id} </span>
              <span className=" text-xs text-gray-600">{account.name}</span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Iconfont name="zhixiang" width={22} color="black" height={22} hoverColor={colorTextPrimary} />
            {/* 頭像列表 */}
            {followers.map((item, idx) => {
              return (
                <img
                  key={idx}
                  src={item.avatar}
                  width={24}
                  height={24}
                  className=" rounded-full border border-solid border-gray-340"
                  style={{
                    transform: `translateX(${idx * -14}px)`
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 md:gap-15 gap-12">
          {/* 賬戶保證金 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{datas.rate1}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.zhanghubaozhengjin" />
              (USDT)
            </span>
          </div>
          {/* 賬戶餘額 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{datas.rate2}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.zhanghuyue" />
              (USDT)
            </span>
          </div>
          {/* 累計盈虧 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className={classNames('text-base font-medium', getColor(datas.rate2))}>
              {datas.rate3 > 0 ? `+${datas.rate3}` : datas.rate3}
            </span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.leijiyingkui" />
              (USDT)
            </span>
          </div>
          {/* 淨盈虧 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{datas.rate4}%</span>
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
              // todo 跳转
            }}
          >
            <div className="flex items-center text-base">
              <Iconfont name="gendanguanli" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.gendanguanli" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
