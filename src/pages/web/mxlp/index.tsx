import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'

export default function MXLPPage() {
  const bgClassName = useEmotionCss(() => {
    return {
      'font-family': 'HarmonyOS Sans SC',
      'font-size': '24px',
      'font-weight': 'bold',
      'line-height': 'normal',
      'letter-spacing': '0em',
      'font-variation-settings': 'opsz auto',
      'font-feature-settings': 'kern on',
      color: '#FFFFFF'
    }
  })

  return (
    <div className={'mx-auto max-w-[1200px] w-full'}>
      <div className={cn([bgClassName, 'py-5'])}>金库</div>

      <div>
        <TotalValuePanel />
      </div>

      <div></div>
    </div>
  )
}

function TotalValuePanel() {
  const contentClassName = useEmotionCss(() => {
    return {
      width: '1200px',
      height: '120px',
      'border-radius': '10px',
      opacity: '1'
    }
  })

  const totalValueClassName = useEmotionCss(() => {
    return {
      'font-family': 'HarmonyOS Sans SC',
      'font-size': '24px',
      'font-weight': 'normal',
      'line-height': 'normal',
      'letter-spacing': '0em',
      'font-variation-settings': 'opsz auto',
      'font-feature-settings': 'kern on',
      color: '#FFFFFF'
    }
  })

  const totalValueLabelClassName = useEmotionCss(() => {
    return {
      'font-family': 'HarmonyOS Sans SC',
      'font-size': '14px',
      'font-weight': 'normal',
      'line-height': 'normal',
      'letter-spacing': '0em',
      'font-variation-settings': 'opsz auto',
      'font-feature-settings': 'kern on',
      color: '#9FA0B0'
    }
  })
  return (
    <div className={cn([contentClassName, 'bg-[#0A0C27] py-[35px] px-[30px] flex justify-between'])}>
      <div className="flex flex-col gap-1.5">
        <div className={cn([totalValueClassName, ''])}>$18,229,265.84</div>
        <div className={cn([totalValueLabelClassName, ''])}>总锁定价值</div>
      </div>
    </div>
  )
}
