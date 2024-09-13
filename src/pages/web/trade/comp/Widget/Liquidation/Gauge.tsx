import ReactECharts from 'echarts-for-react'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'umi'

import { useStores } from '@/context/mobxProvider'
import { getCurrentQuote } from '@/utils/wsUtil'

// https://git.hust.cc/echarts-for-react/
function Gauge() {
  const intl = useIntl()
  const instance = useRef<any>(null)
  const { trade } = useStores()
  const quoteInfo = getCurrentQuote() // 保留，取值触发更新
  const [options, setOptions] = useState<any>({})
  const positionList = trade.positionList.filter((item) => item.id === trade.currentLiquidationSelectBgaId) // 当前已选的持仓item

  const marginRateInfo = trade.getMarginRateInfo() // 计算当前单的浮动盈亏等信息
  const marginRate = marginRateInfo.marginRate

  const colors = ['#FF2222', '#FFE322', '#45A48A', '#45A48A']

  useEffect(() => {
    const echarts = instance.current?.echarts
    setOptions({
      tooltip: {
        show: false,
        formatter: function (v: any) {
          console.log('v', v)
          return `${v.value}%`
        }
      },
      series: [
        {
          type: 'gauge',
          splitNumber: 100,
          radius: '100%',
          startAngle: 220,
          endAngle: -38,
          min: 0,
          max: 100,
          center: ['50%', '65%'],
          pointer: {
            show: true,
            width: 7,
            length: '60%',
            // @ts-ignore
            borderColor: '#000',
            borderWidth: '10',
            itemStyle: {
              color: 'auto'
            }
          },
          // axisLine: {
          //   show: true,
          //   lineStyle: {
          //     width: 12,
          //     color: [
          //       [0.25, colorList[0]],
          //       [0.5, colorList[1]],
          //       [0.75, colorList[2]],
          //       [1, colorList[3]]
          //     ],
          //     borderColor: '#000',
          //     borderWidth: '10'
          //   }
          // },
          // 轴线
          axisLine: {
            show: true,
            lineStyle: {
              width: 10,
              color: [
                [
                  0.4,
                  new echarts.graphic.LinearGradient(
                    // 右下左上，渐变色从正下方开始，下面的以此类推
                    0,
                    1,
                    0,
                    0,
                    [
                      { offset: 0, color: colors[0] },
                      { offset: 0.85, color: colors[1] }
                    ]
                  )
                ],
                [
                  0.6,
                  new echarts.graphic.LinearGradient(0, 1, 1, 0, [
                    { offset: 0, color: colors[1] },
                    { offset: 1, color: colors[2] }
                  ])
                ],
                [
                  0.7,
                  new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                    { offset: 0.0, color: colors[2] },
                    { offset: 1, color: colors[3] }
                  ])
                ],
                [
                  1,
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.3, color: colors[3] },
                    { offset: 1, color: colors[3] }
                  ])
                ]
              ]
            }
          },

          axisLabel: {
            show: false,
            color: '#666',
            distance: -44,
            fontSize: 12
            // formatter: function (v: any) {
            //   return textMap[v]
            // }
          }, //刻度标签。
          axisTick: {
            show: 0
          }, //刻度样式
          splitLine: {
            show: 0,

            lineStyle: {
              color: '#fff',
              width: 2
            }
          }, //分隔线样式
          detail: {
            show: 0
          },
          title: {
            show: false
          },
          data: [
            {
              name: '',
              //0 - 100
              value: marginRate >= 100 ? 100 : marginRate
            }
          ]
        }
      ],

      grid: {
        containLabel: true,
        top: '50%'
      }
    })
  }, [marginRate])

  return <ReactECharts option={options} ref={instance} style={{ width: 100, height: 100 }} />
}

export default observer(Gauge)
