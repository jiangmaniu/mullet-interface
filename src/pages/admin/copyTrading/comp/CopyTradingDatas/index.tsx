import './style.less'

import { FormattedMessage } from '@umijs/max'
import { Statistic, StatisticProps } from 'antd'
import classNames from 'classnames'
import CountUp from 'react-countup'

import { CURRENCY } from '@/constants'
import { getColorClass } from '@/utils'

type IProps = {
  datas?: Record<string, number>
  gap?: 'gap-24' | 'gap-21' | 'gap-18' | 'gap-16'
}

const formatter: StatisticProps['formatter'] = (value, props) => {
  /** 基础间隔 */
  const baseDuration = 0.5
  /** 增长基数 */
  const power = 1.2

  // 计算 value 是 n 位数
  const n = Math.floor(Math.log10(value as number))
  // 不同位数的 duration 值成指数增长
  const duration = baseDuration * Math.pow(power, n)

  const decimals = props?.precision || 2

  return <CountUp {...props} end={value as number} decimals={decimals} separator="," duration={duration} />
}
const TakeDatas = ({ datas, gap = 'gap-24' }: IProps) => {
  return (
    <div className={classNames('flex items-center justify-between flex-wrap gap-y-4', gap)}>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.followerNumber}
          formatter={(val) => formatter(datas?.followerNumber ?? 0, { precision: 0 })}
          valueRender={(val) => <span className="text-xl ">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.leijigendanrenshu" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.createDayTotal}
          formatter={(val) => formatter(val, { precision: 0 })}
          valueRender={(val) => <span className="text-xl ">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.ruzhutianshu" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.profitTotal}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className={`text-xl  ${getColorClass(datas?.profitTotal ?? 0)}`}>{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.daidanyingkui" />({CURRENCY})
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        {/* <span className="text-xl ">{formatNum(datas?.rate4)}</span> */}
        <Statistic
          title={<></>}
          value={datas?.profitSharingRatio}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className="text-xl ">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.fenrunbili" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        {/* <span className="text-xl ">{formatNum(datas?.rate5)}</span> */}
        <Statistic
          title={<></>}
          value={datas?.assetRequirement}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className="text-xl ">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.zichanyaoqiu" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.remainingGuaranteedAmount}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className="text-xl ">{val}</span>}
        />
        {/* <span className="text-xl ">{formatNum(datas?.rate6)}</span> */}
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.zongzichan" />
        </span>
      </div>
    </div>
  )
}

export default TakeDatas
