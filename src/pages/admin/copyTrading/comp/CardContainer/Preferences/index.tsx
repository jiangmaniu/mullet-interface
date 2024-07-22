import { useIntl } from '@umijs/max'
import * as echarts from 'echarts'
import { useEffect, useMemo, useRef, useState } from 'react'

import { formatNum } from '@/utils'

type IProps = {
  time?: string
}

/**
 * 交易偏好
 */
const Preferences = ({ time }: IProps) => {
  const intl = useIntl()

  const jiaoyidui = intl.formatMessage({ id: 'mt.jiaoyidui' })
  const jiaoyicishu = intl.formatMessage({ id: 'mt.jiaoyicishu' })
  const jiaoyiyingkui = intl.formatMessage({ id: 'mt.jiaoyiyingkui' })

  useEffect(() => {
    console.log('Leijiyingkui time:', time)
  }, [time])

  const [data, setData] = useState<any[]>([
    { value: 735, name: 'BTCUSDT 永续', meta: { yingkui: 1234 }, itemStyle: { color: '#45A48A' } },
    { value: 1548, name: 'ETHUSDT 永续', meta: { yingkui: -1234 }, itemStyle: { color: '#183EFC' } }
  ])

  const option = useMemo(
    () =>
      ({
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   top: '5%',
        //   left: 'center'
        // },
        graphic: [
          {
            type: 'group',
            left: 'center',
            bottom: 70,
            children: [
              {
                type: 'text',
                style: {
                  text: `${jiaoyidui}                   ${jiaoyicishu}                   ${jiaoyiyingkui}`,
                  font: '400 12px Arial',
                  fill: '#6a7073'
                },
                position: [0, 0]
              }
            ]
          }
        ],

        legend: {
          orient: 'vertical',
          left: 'center',
          bottom: 0,
          symbolKeepAspect: true,
          formatter: function (name) {
            let target
            let index
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                target = data[i]
                index = i
                break
              }
            }

            if (target) {
              const arr = [
                '{name|' + name + '}',
                '{value|' + target.value + '}',
                target.meta.yingkui > 0
                  ? '{amount1|+' + formatNum(target.meta.yingkui || 0) + ' USDT}'
                  : '{amount2|' + formatNum(target.meta.yingkui || 0) + ' USDT}'
              ]

              return arr.join('')
            }
            return name
          },
          icon: 'circle',
          itemStyle: {
            borderWidth: 0
          },
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 15,
          textStyle: {
            rich: {
              title: {
                width: 100,
                align: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                padding: [0, 0, 5, 0],
                color: '#666'
              },
              name: {
                width: 100,
                color: '#110e23',
                fontWeight: 500,
                align: 'left',
                fontSize: 14,
                height: 20,
                lineHeight: 20
              },
              value: {
                width: 100,
                color: '#110e23',
                fontWeight: 500,
                align: 'center',
                fontSize: 14,
                height: 20,
                lineHeight: 20
              },
              amount1: {
                width: 100,
                color: '#45a48a',
                fontWeight: 500,
                align: 'right',
                fontSize: 14,
                height: 20,
                lineHeight: 20
              },
              amount2: {
                width: 100,
                color: '#c54747',
                fontWeight: 500,
                fontSize: 14,
                align: 'right',
                height: 20,
                lineHeight: 20
              }
            }
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            top: 0,
            radius: ['50%', '65%'],
            center: ['50%', '35%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              color: function (params: any) {
                // 预定义颜色数组
                const colors = ['#45A48A', '#183EFC', '#da70d6', '#32cd32', '#6495ed']
                return colors[params.dataIndex]
              },

              borderColor: '#fff',
              borderWidth: 6
            },
            data
          }
        ]
      } as echarts.EChartOption),
    [data]
  )

  const chartRef = useRef(null)

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current)

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
    <div className="jiaoyipianhao flex flex-col items-start gap-4">
      <div ref={chartRef} style={{ height: 280, width: '100%' }} />
    </div>
  )
}

export default Preferences
