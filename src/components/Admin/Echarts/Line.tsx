import * as echarts from 'echarts'
import { useEffect } from 'react'

export default function Line() {
  // https://echarts.apache.org/handbook/zh/get-started
  const initChart = () => {
    let chart = echarts.init(document.getElementById('chart'))
    // @ts-ignore
    chart.setOption({
      color: ['#66CCC2', '#ff6d00'],
      backgroundColor: '#fafafa',
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        show: true,
        top: 15
      },
      dataZoom: [
        //给x轴设置滚动条
        {
          type: 'slider',
          show: true, // @TODO 根据根据数据动态控制现实隐藏滚动条
          startValue: 0, //默认为0
          endValue: 5,
          xAxisIndex: [0],
          minSpan: 5,
          zoomLock: true, //是否锁定区域大小（true,只能平移不能缩放）
          preventDefaultMouseMove: false,
          handleSize: 0, //滑动条的 左右2个滑动条的大小
          height: 8, //组件高度
          left: 10, //左边的距离
          right: 10, //右边的距离
          bottom: 10, //下边的距离
          handleColor: '#ddd', //h滑动图标的颜色
          handleStyle: {
            borderColor: '#cacaca',
            borderWidth: '1',
            shadowBlur: 2,
            background: '#ddd',
            shadowColor: '#ddd'
          },
          fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            {
              //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
              //给第一个设置0，第四个设置1，就是垂直渐变
              offset: 0,
              color: '#1eb5e5'
            },
            {
              offset: 1,
              color: '#5ccbb1'
            }
          ]),
          backgroundColor: '#ddd', //两边未选中的滑动条区域的颜色
          showDataShadow: false, //是否显示数据阴影 默认auto
          showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
          handleIcon:
            'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
          filterMode: 'filter'
        },
        //下面这个属性是里面拖到
        {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0, //默认为1
          zoomLock: true,
          endValue: 5
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          //刻度
          show: false
        },
        axisLabel: {
          interval: 0, // x轴刻度配置，0:表示全部显示不间隔，auto:表示自动根据刻度个数和宽度自动设置间隔个数
          margin: 10,
          color: '#999',
          textStyle: {
            fontSize: 14
          }
        },
        axisLine: {
          lineStyle: {
            color: '#eee'
          }
        },
        data: Array.from({ length: 14 }, (k, v) => v + 1 + '号')
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          name: '我的',
          type: 'line',
          stack: 'Total',
          data: [120, 110, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '同行',
          type: 'line',
          stack: 'Total',
          data: [109, 132, 231, 135, 70, 290, 240, 120, 162, 191, 234, 190, 30, 340]
        }
      ]
    })
  }

  useEffect(() => {
    initChart()
  }, [])
  return (
    <>
      <div id="chart" style={{ height: 600, width: 800 }}></div>
    </>
  )
}
