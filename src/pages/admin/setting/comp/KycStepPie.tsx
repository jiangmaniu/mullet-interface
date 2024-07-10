import ReactECharts from 'echarts-for-react'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'umi'

// https://git.hust.cc/echarts-for-react/
function KycStepPie({ step }: { step: number }) {
  const intl = useIntl()
  const instance = useRef<any>(null)
  const [options, setOptions] = useState<any>({})

  useEffect(() => {
    let stepZero = ['#E2E2E2', '#E2E2E2', '#E2E2E2']
    let stepOne = ['#E2E2E2', '#E2E2E2', '#45A48A']
    let stepTwo = ['#45A48A', '#E2E2E2', '#45A48A']
    let stepThree = ['#45A48A', '#45A48A', '#45A48A']

    let color = stepZero
    if (step === 1) {
      color = stepOne
    } else if (step === 2) {
      color = stepThree
    }
    console.log('step', step)
    setOptions({
      tooltip: {
        show: false
      },
      legend: {
        show: false
      },
      color,
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
            { value: 100, name: '' }
            // { value: 100, name: '' }
          ]
        }
      ]
    })
  }, [step])

  return <ReactECharts option={options} style={{ width: 80, height: 80, pointerEvents: 'none' }} />
}

export default KycStepPie
