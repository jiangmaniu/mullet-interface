import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useState } from 'react'
import { CreateVaultModal } from './create-vault-modal'

export function VaultOverview() {
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

  const [createVaultModalOpen, setCreateVaultModalOpen] = useState(false)

  return (
    <div className={cn([contentClassName, 'bg-[#0A0C27] py-[35px] px-[30px] flex justify-between'])}>
      <div className="flex flex-col gap-1.5">
        <div className={cn([totalValueClassName, ''])}>$18,229,265.84</div>
        <div className={cn([totalValueLabelClassName, ''])}>总锁定价值</div>
      </div>

      <div>
        <Button onClick={() => setCreateVaultModalOpen(true)}>创建金库</Button>
        <CreateVaultModal open={createVaultModalOpen} onOpenChange={setCreateVaultModalOpen} />
      </div>
    </div>
  )
}
