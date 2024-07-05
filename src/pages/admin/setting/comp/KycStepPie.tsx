import ReactECharts from 'echarts-for-react'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'umi'

// https://git.hust.cc/echarts-for-react/
function KycStepPie() {
  const intl = useIntl()
  const instance = useRef<any>(null)
  const [options, setOptions] = useState<any>({})

  useEffect(() => {
    setOptions({
      tooltip: {
        show: false
      },
      legend: {
        show: false
      },
      color: ['#45A48A', '#E2E2E2', '#45A48A'],
      series: [
        {
          type: 'pie',
          radius: ['44%', '70%'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 5
          },
          label: {
            show: false
          },
          data: [
            { value: 100, name: '' },
            { value: 100, name: '' },
            { value: 100, name: '' }
          ]
        }
      ]
    })
  }, [])

  return <ReactECharts option={options} style={{ width: 80, height: 80, pointerEvents: 'none' }} />
}

export default KycStepPie
