import { useIntl } from '@umijs/max'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import React from 'react'

const OrderTakerChart: React.FC = () => {
  const intl = useIntl()

  const option = {
    // title: {
    //   text: '堆叠区域图'
    // },
    tooltip: {
      trigger: 'axis'
    },
    // legend: {
    //   data: ['邮件营销']
    // },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '2%',
      containLabel: false
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        show: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [
      {
        type: 'value',
        show: false
      }
    ],
    series: [
      {
        name: intl.formatMessage({ id: 'mt.yingkui' }),
        type: 'line',
        stack: '总量',
        lineStyle: {
          color: '#45A48A',
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(69, 164, 138, 0.20)'
            },
            {
              offset: 1,
              color: 'rgba(69, 164, 138, 0)'
            }
          ])
        },
        smooth: true,
        showSymbol: false,
        emphasis: {
          focus: 'series'
        },

        data: [190, 332, 181, 164, 390, 630, 700]
      }
    ]
  }

  return <ReactECharts option={option} style={{ height: 72, width: '100%' }} />
}

export default OrderTakerChart
