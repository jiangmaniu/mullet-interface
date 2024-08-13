import './style.less'

import { SwapRightOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from '@umijs/max'
import { Space } from 'antd'
import classNames from 'classnames'
import { MouseEventHandler } from 'react'

import Tags from '@/components/Admin/Tags'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { IOrderTakerProps, IOrderTakerState } from '@/models/takers'
import { colorTextPrimary, gray } from '@/theme/theme.config'
import { formatNum, getColorClass } from '@/utils'

import { AccountTag } from '../../AccountTag'
import OrderTakerChart from './Chart'

type IProps = IOrderTakerProps & { onClick: (id: string, state: string) => void; onFollow: (bo: IOrderTakerState) => void }
export const OrderTaker = ({ item: { id, account, datas, tags, state: takerState }, state, onClick, onFollow }: IProps) => {
  const intl = useIntl()

  // xx(xx:时间区间)盈亏
  const jinqi = intl.formatMessage({ id: `mt.${state.jinqi}` })

  const handleOnOpen: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    onFollow(takerState)
  }

  return (
    <div
      className=" border rounded-2xl border-gray-150 flex flex-col xl:w-[25rem] max-w-full flex-1 p-5.5 cursor-pointer"
      onClick={() => onClick(id, takerState)}
    >
      {/* header */}
      <div className=" flex flex-col gap-5">
        {/* account */}
        <div className=" flex items-center gap-4 justify-between">
          <div className=" flex flex-row gap-4">
            <img src={account.avatar} width={54} height={54} className=" rounded-xl border border-solid border-gray-340" />
            <div className=" flex flex-col gap-2">
              <div className=" flex gap-2 items-center ">
                <span className="account-name">{account.name}</span>
                <AccountTag type={account.type} />
              </div>
              <div className="flex items-center gap-1">
                <Iconfont name="renshu" width={16} color="black" height={16} hoverColor={colorTextPrimary} />
                <span>
                  <span className=" text-sm font-pf-medium">{account.followers}</span>
                  <span className=" text-sm text-gray-500">/{account.limitFollowers}</span>
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
              <span className={classNames('  text-2xl font-bold !font-dingpro-medium ', getColorClass(datas.rate1))}>
                {datas.rate1 > 0 ? `+${datas.rate1}` : datas.rate1}
              </span>
              <span className="tips">
                <FormattedMessage id="mt.shouyilv" />
                &nbsp;
                <span className={classNames('font-medium !font-dingpro-medium', getColorClass(datas.rate2))}>
                  {datas.rate2 > 0 ? `+${datas.rate2}` : datas.rate2}%
                </span>
              </span>
            </div>

            <OrderTakerChart datas={datas} />
          </div>
          <div className=" grid grid-cols-3 gap-y-2">
            <div className="flex flex-col ">
              <span className="count !font-dingpro-medium ">{formatNum(datas.rate3)}</span>
              <span className="tips">
                <FormattedMessage id="mt.quanbuyingkui" />
                &nbsp;USD
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="count !font-dingpro-medium ">{formatNum(datas.rate4)}</span>
              <span className="tips">
                <FormattedMessage id="mt.leijijiaoyibishu" />
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="count !font-dingpro-medium ">{formatNum(datas.rate5)}</span>
              <span className="tips">
                <FormattedMessage id="mt.leijigensuirenshu" />
              </span>
            </div>

            <div className="flex flex-row gap-1 items-end col-span-3">
              <span className="tips">
                <FormattedMessage id="mt.jinqishenglv" values={{ range: jinqi }} />
              </span>
              <span className={classNames('count !font-dingpro-medium ', getColorClass(datas.rate6))}>
                {datas.rate6 > 0 ? `+${datas.rate6}` : datas.rate6}%
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      <Space direction="vertical" size={8} className="border-t mt-4 pt-1 border-gray-150">
        <Space>
          {tags.map((tag, idx) => (
            // <Tag key={idx} color="green">
            //   <FormattedMessage id={`mt.${tag}`} />
            // </Tag>
            <Tags size="small" color="green" format={{ id: `mt.${tag}` }} key={idx} />
          ))}
        </Space>
        <Button
          height={42}
          type="primary"
          style={{
            // background: takerState === 'yimanyuan' ? '#f49b1e' : '',
            width: '100%',
            borderRadius: 8
          }}
          className={takerState}
          disabled={takerState === 'wufagendan'}
          onClick={handleOnOpen}
        >
          <div className=" flex items-center font-semibold gap-1 text-base">
            {takerState === 'yimanyuan' && <Iconfont name="fire" width={15} color="white" height={20} hoverColor={colorTextPrimary} />}
            <FormattedMessage id={`mt.${takerState}`} />
          </div>
        </Button>
      </Space>
    </div>
  )
}
