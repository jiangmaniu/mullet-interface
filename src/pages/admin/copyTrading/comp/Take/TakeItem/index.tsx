import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTakerProps } from '@/models/takers'
import { colorTextPrimary } from '@/theme/theme.config'
import { formatNum, getColorClass } from '@/utils'
import { push } from '@/utils/navigator'

import { AccountTag } from '../../AccountTag'

type IProps = IOrderTakerProps & {
  onClick?: (id: string) => void
  onTake?: (id: string) => void
}
export const TakeItem = ({ item, state, onClick, onTake }: IProps) => {
  const { leadId, tradeAccountId, imageUrl, projectName, groupName, tags, state: takerState } = item
  return (
    <div
      onClick={() => {
        push(`/copy-trading/take-detail/${leadId}`)
      }}
      className=" border rounded-lg border-gray-150 flex flex-col flex-1 w-full hover:shadow"
    >
      {/* header */}
      <div className="flex gap-3 py-2.5 px-3.5 items-center">
        <img src={imageUrl} width={24} height={24} className=" rounded-full border border-solid border-gray-340" />
        <span className=" text-base font-bold">
          {projectName}
          {/* ·{account.id} */}
        </span>
        <AccountTag size="auto" color={groupName}>
          {groupName}
        </AccountTag>
      </div>
      {/* footer */}
      <div className="border-t  border-gray-150 p-4 flex items-center justify-between md:gap-4 gap-2">
        <div className="grid xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:gap-12 md:gap-10 gap-8">
          {/* 累計分潤 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className={classNames(' text-base !font-dingpro-regular', getColorClass(item.shareProfitTotal))}>
              {item.shareProfitTotal > 0 ? `+${item.shareProfitTotal}` : item.shareProfitTotal}
            </span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.leijifenrun" />
              (USDT)
            </span>
          </div>
          {/* 今日分潤 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className={classNames(' text-base !font-dingpro-regular', getColorClass(item.shareProfitToday))}>
              {item.shareProfitToday > 0 ? `+${item.shareProfitToday}` : item.shareProfitToday}
            </span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.jinrifenrun" />
              (USDT)
            </span>
          </div>
          {/* 當前跟隨人數 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base !font-dingpro-regular">{formatNum(item.followerNumber)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.dangqiangensuirenshu" />
            </span>
          </div>
          {/* 入住天數 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base !font-dingpro-regular">{formatNum(item.createDayTotal)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.ruzhutianshu" />
            </span>
          </div>
          {/* 帶單保證金餘額 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base !font-dingpro-regular">{formatNum(item.remainingGuaranteedAmount)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.daidanbaozhengjinyue" />
            </span>
          </div>
          {/* 管理資產規模 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base !font-dingpro-regular">{formatNum(item.assetScaleTotal)}</span>
            <span className=" text-xs font-normal text-gray-500">
              <FormattedMessage id="mt.guanlizichanguimo" />
            </span>
          </div>
          {/* 分潤比例 */}
          <div className=" flex flex-col items-start gap-0.5">
            <span className=" text-base !font-dingpro-regular">{formatNum(item.profitSharingRatio)}%</span>
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
            onClick={(e) => {
              e.stopPropagation()

              onTake?.(tradeAccountId)
            }}
            // disabled={takerState === 'wufagendan'}
          >
            <div className="flex items-center text-sm font-semibold gap-1">
              <Iconfont name="daidan" width={18} color="white" height={18} hoverColor={colorTextPrimary} />
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
            // disabled={takerState === 'wufagendan'}
            onClick={(e) => {
              e.stopPropagation()
              onClick?.(leadId)
            }}
          >
            <div className="flex items-center text-sm font-semibold gap-1 align-middle">
              <Iconfont name="shezhi" width={18} color="black" height={18} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.shezhi" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
