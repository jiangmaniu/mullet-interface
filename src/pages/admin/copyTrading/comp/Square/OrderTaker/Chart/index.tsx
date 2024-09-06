import { useIntl } from '@umijs/max'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'

import { green, red } from '@/theme/theme.config'
import { colorToRGBA } from '@/utils/color'

type IProps = {
  datas: Record<string, any>
}

const OrderTakerChart = ({ datas }: IProps) => {
  const intl = useIntl()

  const color = datas.winRate > 0 ? green['700'] : red['600']
  const data = datas.rate7
  const xData = datas.xData

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
        data: xData
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
          color,
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colorToRGBA(color, 0.2)
            },
            {
              offset: 1,
              color: colorToRGBA(color, 0)
            }
          ])
        },
        smooth: true,
        showSymbol: false,
        emphasis: {
          focus: 'series'
        },

        data
      }
    ]
  }

  return <ReactECharts option={option} style={{ height: 72, width: '100%' }} />
}

export default OrderTakerChart
