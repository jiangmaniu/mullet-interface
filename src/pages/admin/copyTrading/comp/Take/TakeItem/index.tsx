import { FormattedMessage } from '@umijs/max'
import { Tag } from 'antd'
import classNames from 'classnames'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTakerProps } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'
import { formatNum, getColorClass } from '@/utils'
import { push } from '@/utils/navigator'

export const TakeItem = ({ item: { id, account, datas, tags, state: takerState }, state }: IOrderTakerProps) => {
  return (
    <div className=" border rounded-lg border-gray-150 flex flex-col flex-1 w-full">
      {/* header */}
      <div className="flex gap-3 py-2.5 px-3.5">
        <img src={account.avatar} width={24} height={24} className=" rounded-full border border-solid border-gray-340" />

        <span className=" text-base font-bold">
          {account.name}·{account.id}
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
      <div className="border-t  border-gray-150 p-4 flex items-center justify-between md:gap-4 gap-2">
        <div className="grid xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:gap-15 md:gap-10 gap-5">
          {/* 累計分潤 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className={classNames(' text-base font-medium', getColorClass(datas.rate1))}>
              {datas.rate1 > 0 ? `+${datas.rate1}` : datas.rate1}
            </span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.leijifenrun" />
              (USDT)
            </span>
          </div>
          {/* 今日分潤 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className={classNames(' text-base font-medium', getColorClass(datas.rate2))}>
              {datas.rate2 > 0 ? `+${datas.rate2}` : datas.rate2}
            </span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.jinrifenrun" />
              (USDT)
            </span>
          </div>
          {/* 當前跟隨人數 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{formatNum(datas.rate3)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.dangqiangensuirenshu" />
            </span>
          </div>
          {/* 入住天數 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{formatNum(datas.rate4)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.ruzhutianshu" />
            </span>
          </div>
          {/* 帶單保證金餘額 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{formatNum(datas.rate5)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.daidanbaozhengjinyue" />
            </span>
          </div>
          {/* 管理資產規模 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{formatNum(datas.rate6)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.guanlizichanguimo" />
            </span>
          </div>
          {/* 分潤比例 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base font-medium">{datas.rate7}%</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.fenrunbili" />
            </span>
          </div>
        </div>

        <div className=" flex items-center justify-end gap-3.5 md:flex-row flex-col">
          <Button
            height={44}
            type="primary"
            style={{
              width: 124,
              borderRadius: 8
            }}
            disabled={takerState === 'wufagendan'}
            onClick={() => {
              push(`/copy-trading/take-detail/${id}`)
            }}
          >
            <div className="flex items-center text-base">
              <Iconfont name="daidan" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.daidan" />
            </div>
          </Button>
          <Button
            height={44}
            type="default"
            style={{
              width: 124,
              borderRadius: 8
            }}
            disabled={takerState === 'wufagendan'}
            onClick={() => {
              // todo 跳转
            }}
          >
            <div className="flex items-center text-base">
              <Iconfont name="shezhi" width={22} color="black" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.shezhi" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
