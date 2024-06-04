import { Line } from '@ant-design/charts'
import { getIntl } from '@umijs/max'

import { useEnv } from '@/context/envProvider'
import { colorPrimary } from '@/theme/theme.config'
import { formatTime } from '@/utils'

const LineChat = () => {
  const { breakPoint, isMobile } = useEnv()
  // const { homeInfo, queryHomeInfo } = useModel('home')

  // const { data, loading, run } = useRequest(getHomeCommissionList, { manual: true })
  // const listData = data?.result?.content?.Data?.commissions || []
  const listData = [
    {
      date: '2024-04-23',
      value: 1003.74
    },
    {
      date: '2024-04-22',
      value: 4.7
    },
    {
      date: '2024-04-19',
      value: 0.07
    },
    {
      date: '2024-04-18',
      value: 2.05
    },
    {
      date: '2024-04-17',
      value: 2.21
    },
    {
      date: '2024-04-16',
      value: 12.42
    },
    {
      date: '2024-04-15',
      value: 0.5
    },
    {
      date: '2024-04-12',
      value: 123
    },
    {
      date: '2024-03-30',
      value: 0.5
    },
    {
      date: '2024-03-28',
      value: 6.67
    },
    {
      date: '2024-03-26',
      value: 0.14
    },
    {
      date: '2024-03-20',
      value: 1
    },
    {
      date: '2024-03-19',
      value: 0.5
    },
    {
      date: '2024-03-17',
      value: 2
    },
    {
      date: '2024-03-15',
      value: 2
    }
  ]

  // useEffect(() => {
  //   queryHomeInfo?.()
  //   run?.({ pageSize: 15, pageNo: 0 })
  // }, [])

  const list = listData
    .map((v) => ({
      ...v,
      day: formatTime(v.date, 'YYYY.MM.DD'),
      value: v.value
    }))
    .reverse()

  // 计算滑块开始位置，尽可能首次加载展示首屏数据，避免数据太多看不全
  const getSliderStart = () => {
    const len = list.length
    let result = 0
    if (len > 20) {
      result = 0.5
    } else if (len > 40) {
      result = 0.6
    } else if (len > 100) {
      result = 0.7
    } else if (len > 200) {
      result = 0.8
    }

    return result
  }

  const config = {
    data: list,
    height: breakPoint === 'xs' ? 200 : breakPoint === 'xl' ? 240 : 325,
    xField: 'day',
    yField: 'value',
    label: {},
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: colorPrimary,
        lineWidth: 1
      }
    },
    tooltip: {
      showMarkers: false,
      formatter: (d: any) => {
        return { name: getIntl().formatMessage({ id: 'admin.yongjin' }), value: d.value }
      }
    },
    // padding: [40, 0, 40, 40],
    padding: 'auto',
    // 是否为平滑曲线
    smooth: false,
    // 设置折线的单一色，如果有多条折线则数组表示
    color: '#6A7073',
    xAxis: {
      line: { style: { stroke: '' } },
      label: {
        style: {
          stroke: '#6A7073',
          fontSize: 12,
          fontWeight: 300
        }
      },
      tickCount: isMobile ? 5 : 12, // x轴刻度一行展示12个
      grid: {
        line: {
          style: {
            stroke: '#efefef',
            lineDash: [4, 5]
          }
        }
      }
    },
    yAxis: {
      // min: 0,
      // max: 100,  // min 和 max 设置Y轴最大值和最小值，然后自动分配
      line: { style: { stroke: '' } }, // 配上这条数据才会显示y轴 stroke等同css color
      // label 配置y轴文字的样式
      label: {
        // formatter 对y轴文字进一步处理
        //formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        style: {
          stroke: '#6A7073',
          fontSize: 12,
          fontWeight: 300
        }
      },
      // grid 配置水平线的样式 下面配置为虚线如果要为实线，不用配置
      grid: {
        line: {
          style: {
            stroke: '#efefef',
            lineDash: [4, 5]
          }
        }
      }
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red'
        }
      }
    }
  }

  if (list?.length > 20) {
    // @ts-ignore
    config.slider = {
      start: getSliderStart(), // 滑块开始位置
      end: 1, // 结束位置
      height: 10,
      handlerStyle: {
        // 手柄
        height: 12
      }
    }
  }

  return (
    <>
      {/* <Loading loading={loading} isEmpty={list.length === 0}> */}
      {/* @ts-ignore */}
      <Line {...config} />
      {/* </Loading> */}
    </>
  )
}

export default LineChat
