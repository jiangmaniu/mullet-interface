import './index.less'

import { useIntl } from '@umijs/max'
import { Segmented } from 'antd'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'

type IProps = {
  earningRates?: {
    date: string | undefined
    value: number | undefined
    // earningRate: number
  }[]
  profitAmounts?: {
    date: string | undefined
    value: number | undefined
    // profitAmount: number
  }[]
}

/**
 * 累計盈虧
 */
const Cumulative = (props: IProps) => {
  const intl = useIntl()

  const [segment, setSegment] = useState<'earningRates' | 'profitAmounts'>('earningRates')

  const xAxis = useMemo(() => {
    return props?.[segment]?.map((item) => item.date)
  }, [props.earningRates, segment])

  const data = useMemo(() => {
    return props?.[segment]?.map((item) => item.value)
  }, [props.earningRates, segment])

  const option = useMemo(
    () => ({
      // title: {
      //   text: '堆叠区域图'
      // },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [intl.formatMessage({ id: 'mt.shouyilv' }), intl.formatMessage({ id: 'mt.yingkuie' })]
      },

      grid: {
        left: '2%',
        right: '2%',
        bottom: '2%',
        top: '2%',

        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f0f0f0' // 设置辅助线颜色为浅灰色
            }
          }
        }
      ],
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          lineStyle: {
            color: '#183EFC',
            width: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(24, 62, 252, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(24, 62, 252, 0)'
              }
            ])
          },
          showSymbol: false,
          emphasis: {
            // focus: 'series'
          },

          data
        }
      ]
    }),
    [data, xAxis, intl]
  ) as echarts.EChartOption

  return (
    <div className="leijiyingkui flex flex-col items-start gap-4">
      <Segmented<'earningRates' | 'profitAmounts'>
        options={[
          {
            value: 'earningRates',
            label: intl.formatMessage({ id: 'mt.shouyilv' })
          },
          {
            value: 'profitAmounts',
            label: intl.formatMessage({ id: 'mt.yingkuie' })
          }
        ]}
        value={segment}
        onChange={(value) => {
          setSegment(value)
        }}
      />
      <ReactECharts option={option} style={{ height: 230, width: '100%' }} />
    </div>
  )
}

export default Cumulative
