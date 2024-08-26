/* eslint-disable react/no-unknown-property */
import './style.less'

import { FormattedMessage } from '@umijs/max'
import { Statistic, StatisticProps } from 'antd'
import { FormatConfig } from 'antd/es/statistic/utils'
import { useEffect, useRef } from 'react'
import CountUp from 'react-countup'

type IProps = {
  datas?: Record<string, any>
  time?: string
}

// const formatter: StatisticProps['formatter'] = (value, props) => (
//   <CountUp {...props} end={value as number} decimals={2} separator="," duration={0.3} />
// )
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

/**
 * 帶單表現
 */
export const Performance = ({ time, datas }: IProps) => {
  const delay = 0.15

  useEffect(() => {
    console.log('Daidanbiaoxian time:', time)
  }, [time])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 给 containerRef.current 添加类名 daidanbiaoxian
          if (containerRef.current) {
            containerRef.current.classList.add('daidanbiaoxian')
            console.log('添加样式 daidanbiaoxian')

            // 停止观察元素（可选）
            containerRef.current && observer.unobserve(containerRef.current)
          }
        }
      })
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-4" ref={containerRef}>
      <div className="h-8 overflow-hidden relative">
        <span className="absolute bottom-0 l-0">
          <FormattedMessage id="mt.shenglv" />
        </span>
        <span className=" absolute -bottom-1 left-8">
          <Statistic
            title={<></>}
            value={datas?.winRate}
            formatter={(val) => formatter(val, { suffix: '%' } as FormatConfig)}
            valueRender={(val) => <span className="text-xl font-medium text-black !font-dingpro-medium">{val}</span>}
          />
        </span>
      </div>

      <div className="w-full overflow-hidden rounded">
        <div
          className="flex flex-row items-center gap-1"
          style={{
            transform: 'translateX(-2rem)'
          }}
        >
          <div
            className="bg-green flex-shrink-0 h-3 lv rounded"
            style={{
              width: `calc(${Math.round((datas?.winRate / 100) * 100)}% + 2rem) `
            }}
          ></div>
          <div
            className="h-3 bg-red flex-shrink-0 hon rounded"
            style={{
              width: `calc(${100 - Math.round((datas?.winRate / 100) * 100)}% + 2rem)`
            }}
          ></div>
        </div>
      </div>

      {/* data-duration: 控制淡出動畫執行時間 */}
      <div className="flex flex-col gap-5 w-full fade-list">
        {/* 總收益率 */}
        <div className="flex flex-row w-full justify-between items-center">
          <span className=" text-sm text-gray-600">
            <FormattedMessage id="mt.zongshouyilv" />
          </span>
          <span>
            <Statistic
              title={<></>}
              value={datas?.earningRateTotal}
              formatter={(val) => formatter(val, { suffix: '%', delay: 1 * delay } as FormatConfig)}
              valueStyle={{
                fontSize: '1rem',
                lineHeight: '1.25rem',
                fontWeight: 500,
                color: 'rgb(17 14 35 / var(--tw-text-opacity))'
              }}
            />
          </span>
        </div>

        {/* 帶單盈虧 */}
        <div className="flex flex-row w-full justify-between items-center">
          <span className=" text-sm text-gray-600">
            <FormattedMessage id="mt.daidanyingkui" />
            (USDT)
          </span>
          <span>
            <Statistic
              title={<></>}
              value={datas?.leadProfit}
              formatter={(val) => formatter(val, { prefix: '+', delay: 2 * delay } as FormatConfig)}
              valueStyle={{
                fontSize: '1rem',
                lineHeight: '1.25rem',
                fontWeight: 500,
                color: 'var(--color-green-700)'
              }}
            />
          </span>
        </div>

        {/* 跟單用戶盈虧 */}
        <div className="flex flex-row w-full justify-between items-center">
          <span className=" text-sm text-gray-600">
            <FormattedMessage id="mt.gendanyonghuyingkui" />
          </span>
          <span>
            <Statistic
              title={<></>}
              value={datas?.followerProfit}
              formatter={(val) => formatter(val, { prefix: '+', delay: 3 * delay } as FormatConfig)}
              valueStyle={{
                fontSize: '1rem',
                lineHeight: '1.25rem',
                fontWeight: 500,
                color: 'var(--color-green-700)'
              }}
            />
          </span>
        </div>

        {/*回撤率 */}
        <div className="flex flex-row w-full justify-between items-center">
          <span className=" text-sm text-gray-600">
            <FormattedMessage id="mt.huichelv" />
          </span>
          <span>
            <Statistic
              title={<></>}
              value={datas?.retracementRate}
              formatter={(val) => formatter(val, { suffix: '%', delay: 4 * delay } as FormatConfig)}
              valueStyle={{
                fontSize: '1rem',
                lineHeight: '1.25rem',
                fontWeight: 500,
                color: 'rgb(17 14 35 / var(--tw-text-opacity))'
              }}
            />
          </span>
        </div>

        {/* 平均每筆收益率 */}
        <div className="flex flex-row w-full justify-between items-center">
          <span className=" text-sm text-gray-600">
            <FormattedMessage id="mt.pingjunmeibishouyilv" />
          </span>
          <span>
            <Statistic
              title={<></>}
              value={datas?.averageProfitRate}
              formatter={(val) => formatter(val, { suffix: '%', delay: 5 * delay } as FormatConfig)}
              valueStyle={{
                fontSize: '1rem',
                lineHeight: '1.25rem',
                fontWeight: 500,
                color: 'var(--color-green-700)'
              }}
            />
          </span>
        </div>
      </div>
    </div>
  )
}
