import './style.less'

import { FormattedMessage } from '@umijs/max'
import { Statistic, StatisticProps } from 'antd'
import classNames from 'classnames'
import CountUp from 'react-countup'

import { getColorClass } from '@/utils'

type IProps = {
  datas?: Record<string, number>
  gap?: 'gap-24' | 'gap-18'
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

  return <CountUp {...props} end={value as number} decimals={2} separator="," duration={duration} />
}
const TakeDatas = ({ datas, gap = 'gap-24' }: IProps) => {
  const usColor3 = getColorClass(datas?.rate3 ?? 0)

  return (
    <div className={classNames('flex items-center flex-wrap gap-y-4', gap)}>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.rate1}
          formatter={(val) => formatter(datas?.rate1 ?? 0)}
          valueRender={(val) => <span className="text-xl font-medium !font-dingpro-medium">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.leijigendanrenshu" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.rate2}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className="text-xl font-medium !font-dingpro-medium">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.ruzhutianshu" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.rate3}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className={`text-xl font-medium !font-dingpro-medium ${usColor3}`}>{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.yonghuyingkui" />
          (USDT)
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        {/* <span className="text-xl font-medium">{formatNum(datas?.rate4)}</span> */}
        <Statistic
          title={<></>}
          value={datas?.rate4}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className="text-xl font-medium !font-dingpro-medium">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.fenrunbili" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        {/* <span className="text-xl font-medium">{formatNum(datas?.rate5)}</span> */}
        <Statistic
          title={<></>}
          value={datas?.rate5}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className="text-xl font-medium !font-dingpro-medium">{val}</span>}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.zichanyaoqiu" />
        </span>
      </div>
      <div className="flex flex-col gap-1 item">
        <Statistic
          title={<></>}
          value={datas?.rate6}
          formatter={(val) => formatter(val)}
          valueRender={(val) => <span className="text-xl font-medium !font-dingpro-medium">{val}</span>}
        />
        {/* <span className="text-xl font-medium">{formatNum(datas?.rate6)}</span> */}
        <span className="text-sm text-gray-600 whitespace-nowrap ">
          <FormattedMessage id="mt.zongzichan" />
        </span>
      </div>
    </div>
  )
}

export default TakeDatas
