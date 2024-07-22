import './style.less'

import { useIntl } from '@umijs/max'
import { Segmented } from 'antd'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'

type IProps = {
  xAxis?: string[]
  shouyilvs?: number[]
  yingkuies?: number[]
  time?: string
}

/**
 * 累計盈虧
 */
const Cumulative = ({
  time,
  shouyilvs = [1, 2, 3, 4, 5, 6],
  yingkuies = [6, 5, 4, 3, 2, 1],
  xAxis = ['5.01', '5.02', '5.03', '5.04', '5.05', '5.06']
}: IProps) => {
  const intl = useIntl()

  useEffect(() => {
    console.log('Leijiyingkui time:', time)
  }, [time])

  const shouyilv = intl.formatMessage({ id: 'mt.shouyilv' })
  const yingkuie = intl.formatMessage({ id: 'mt.yingkuie' })

  const [data, setData] = useState<number[]>(shouyilvs)

  const onChange = (value: string) => {
    if (value === shouyilv) {
      setData(shouyilvs ?? [])
    } else if (value === yingkuie) {
      setData(yingkuies ?? [])
    }
  }

  const option = {
    // title: {
    //   text: '堆叠区域图'
    // },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [shouyilv, yingkuie]
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },

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
              color: 'rgba(24, 62, 252, 1)'
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
  } as echarts.EChartOption

  const chartRef = useRef(null)

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current, null, { width: 'auto' })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chartInstance.setOption(option)
          chartInstance.resize()
          // 动画开始
          chartInstance.on('finished', () => {
            console.log('动画完成')
          })

          // 停止观察元素（可选）
          chartRef.current && observer.unobserve(chartRef.current)
        }
      })
    })

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => {
      if (chartRef.current) {
        chartInstance.dispose()
        observer.unobserve(chartRef.current)
      }
    }
  }, [])

  return (
    <div className="leijiyingkui flex flex-col items-start gap-4">
      <Segmented<string> options={[shouyilv, yingkuie]} onChange={onChange} />
      <div ref={chartRef} style={{ height: 230, width: '100%' }} />
    </div>
  )
}

export default Cumulative
