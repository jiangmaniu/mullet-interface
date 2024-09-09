import './style.less'

import { SwapRightOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from '@umijs/max'
import { Space } from 'antd'
import classNames from 'classnames'
import { MouseEventHandler, useMemo } from 'react'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTakerProps, IOrderTakerState } from '@/models/takers'
import { colorTextPrimary, gray } from '@/theme/theme.config'
import { formatNum, getColorClass } from '@/utils'

import { AccountTag } from '../../AccountTag'
import OrderTakerChart from './Chart'

type IProps = IOrderTakerProps & {
  onClick: (id: string, state: string, followerId?: string) => void
  onFollow: (bo: IOrderTakerState, info: Record<string, any>, ableList: User.AccountItem[]) => void
  accountList: User.AccountItem[]
}
export const OrderTaker = ({ item, state, onClick, onFollow, accountList }: IProps) => {
  const intl = useIntl()

  const {
    leadId,
    imageUrl,
    leadName,
    accountGroupName,
    datas,
    tags,
    followerNumber,
    maxSupportCount,
    followerTotal,
    winRate,
    leadProfit,
    earningRate,
    profitTotal,
    tradeTotal,
    followerId,
    tradeAccountId
  } = item

  const ableList = useMemo(() => {
    return accountList.filter((item) => item.groupName === accountGroupName)
  }, [accountList, accountGroupName])

  const takerState: IOrderTakerState = useMemo(() => {
    // 如果 ableList 存在 id = item.tradeAccountId 的值，则返回 3
    const account = ableList.find((item) => item.id === tradeAccountId)
    if (account) {
      return 0
    }

    return item.status
  }, [item])

  // xx(xx:时间区间)盈亏
  const jinqi = intl.formatMessage({ id: `mt.${state.jinqi}` })

  const handleOnOpen: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    onFollow(takerState, item, ableList)
  }

  return (
    <div
      className=" border rounded-2xl border-gray-150 flex flex-col justify-between xl:w-[25rem] max-w-full flex-1 p-5.5 cursor-pointer hover:shadow-md"
      onClick={() => onClick(leadId, String(takerState), followerId)}
    >
      {/* header */}
      <div className=" flex flex-col  gap-5">
        {/* account */}
        <div className=" flex items-center gap-4 justify-between">
          <div className=" flex flex-row gap-4">
            <img src={imageUrl} width={54} height={54} className=" rounded-xl border border-solid border-gray-340" />
            <div className=" flex flex-col gap-1.5">
              <div className=" flex gap-2 items-center flex-wrap">
                <span className="account-name">{leadName}</span>
                <AccountTag size="auto" color={accountGroupName}>
                  {accountGroupName}
                </AccountTag>
              </div>
              <div className="flex items-center gap-1">
                <Iconfont name="renshu" width={16} color="black" height={16} hoverColor={colorTextPrimary} />
                <span>
                  <span className=" text-sm font-pf-medium">{followerNumber}</span>
                  <span className=" text-sm text-gray-500">/{maxSupportCount}</span>
                </span>
              </div>
            </div>
          </div>

          <Button
            height={26}
            type="link"
            style={{
              borderWidth: 1,
              borderColor: gray[150],
              width: 54,
              borderRadius: 16
            }}
          >
            <SwapRightOutlined style={{ color: 'black', fontSize: 20 }} />
          </Button>
        </div>
        {/* datas */}
        <div className="flex flex-col gap-4">
          <div className=" grid grid-cols-2 gap-1">
            <div className="flex flex-col gap-2 justify-between">
              <span className="tips">
                <FormattedMessage id="mt.jinqiyingkui" values={{ range: jinqi }} />
                &nbsp;USD
              </span>
              <span className={classNames('  text-2xl font-bold !font-dingpro-medium ', getColorClass(leadProfit))}>
                {leadProfit > 0 ? `+${leadProfit}` : leadProfit}
              </span>
              <span className="tips">
                <FormattedMessage id="mt.shouyilv" />
                &nbsp;
                <span className={classNames('font-medium !font-dingpro-medium', getColorClass(earningRate))}>
                  {earningRate > 0 ? `+${earningRate}` : earningRate}%
                </span>
              </span>
            </div>

            <OrderTakerChart
              datas={{
                followerNumber,
                maxSupportCount,
                followerTotal,
                winRate,
                leadProfit,
                earningRate,
                profitTotal,
                tradeTotal
              }}
            />
          </div>
          <div className=" grid grid-cols-3 gap-y-2">
            <div className="flex flex-col ">
              <span className="count !font-dingpro-medium ">{formatNum(profitTotal)}</span>
              <span className="tips">
                <FormattedMessage id="mt.quanbuyingkui" />
                &nbsp;USD
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="count !font-dingpro-medium ">{formatNum(tradeTotal)}</span>
              <span className="tips">
                <FormattedMessage id="mt.leijijiaoyibishu" />
              </span>
            </div>
            <div className="flex flex-col justify-self-end mr-2 ">
              <span className="count !font-dingpro-medium  ">{formatNum(followerTotal)}</span>
              <span className="tips">
                <FormattedMessage id="mt.leijigensuirenshu" />
              </span>
            </div>

            <div className="flex flex-row gap-1 items-end col-span-3">
              <span className="tips">
                <FormattedMessage id="mt.jinqishenglv" values={{ range: jinqi }} />
              </span>
              <span className={classNames('count !font-dingpro-medium ', getColorClass(winRate))}>
                {winRate > 0 ? `+${winRate}` : winRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      <Space direction="vertical" size={8} className="border-t mt-4 pt-1 border-gray-150">
        <Space>
          {/* {tags.map((tag, idx) => (
            <Tags size="small" color="green" format={{ id: `mt.${tag}` }} key={idx} />
          ))} */}
        </Space>
        <Button
          height={42}
          type="primary"
          style={{
            width: '100%',
            borderRadius: 8
          }}
          className={`daidanzhuangtai${takerState}`}
          disabled={takerState === 0}
          onClick={handleOnOpen}
        >
          <div className=" flex items-center font-semibold gap-1 text-base">
            {takerState === 2 && <Iconfont name="fire" width={15} color="white" height={20} hoverColor={colorTextPrimary} />}
            <FormattedMessage id={`mt.daidanzhuangtai${takerState}`} />
          </div>
        </Button>
      </Space>
    </div>
  )
}
