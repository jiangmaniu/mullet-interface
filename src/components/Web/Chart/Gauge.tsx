// @ts-nocheck
import { useIntl } from '@umijs/max'
import * as echarts from 'echarts'
import { useEffect } from 'react'

export default function Gauage() {
  const intl = useIntl()
  // https://echarts.apache.org/handbook/zh/get-started

  const initChart = () => {
    let chart = echarts.init(document.getElementById('liquidation'))

    //数据
    let data = {
      name: '',
      //0 - 100
      value: 10
    }

    //文本
    let textMap: any = {
      12: intl.formatMessage({ id: 'mt.wu' }),
      38: intl.formatMessage({ id: 'mt.di' }),
      63: intl.formatMessage({ id: 'mt.zhong' }),
      88: intl.formatMessage({ id: 'mt.gao' })
    }

    //颜色区间
    let colorList = [
      {
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: '#7BB2FF' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#4186FF' // 100% 处的颜色
          }
        ]
      },
      {
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: '#00D0BF' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#05C399' // 100% 处的颜色
          }
        ]
      },
      {
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: '#FFD18C' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#FEAD5A' // 100% 处的颜色
          }
        ]
      },
      {
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: '#fc6b84' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#e43c59' // 100% 处的颜色
          }
        ]
      }
    ]

    // @ts-ignore
    chart.setOption({
      tooltip: {},
      series: [
        {
          type: 'gauge',
          splitNumber: 100,
          radius: '69%',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
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
          axisLine: {
            show: true,
            lineStyle: {
              width: 10,
              color: [
                [0.25, colorList[0]],
                [0.5, colorList[1]],
                [0.75, colorList[2]],
                [1, colorList[3]]
              ],
              borderColor: '#000',
              borderWidth: '10'
            }
          },
          axisLabel: {
            show: true,
            color: '#666',
            distance: -44,
            fontSize: 12,
            formatter: function (v) {
              return textMap[v]
            }
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
          data: [data]
        }
      ]
    })
  }

  useEffect(() => {
    initChart()
  }, [])

  return (
    <>
      <div id="liquidation" style={{ height: 160, width: 160 }}></div>
    </>
  )
}
