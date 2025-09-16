import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'

export default function VaultDetailDeposits() {
  return (
    <div>
      <div className="flex text-[12px] justify-between">
        <div className="text-[#9FA0B0]">您的交易账户余额</div>
        <div className=" text-white">0.00 USDC</div>
      </div>

      <div className="mt-4">
        <AmountInputPanel />
      </div>

      <div className="mt-[30px]">
        <Button block>立即存款</Button>
      </div>

      <div className="mt-[30px] items-center  gap-2.5 flex">
        <Icons.lucide.Info className="text-[#FF8F34] size-4" />

        <span className="text-[12px] text-[#9E9E9E] leading-normal">最低每笔存入5USDC，每次存款后锁定期为1天。</span>
      </div>
    </div>
  )
}
function AmountInputPanel() {
  const searchInputContainerClassName = useEmotionCss(() => {
    return {
      height: '34px',
      'border-radius': '8px',
      opacity: '1',
      background: '#0A0C27',
      'box-sizing': 'border-box',
      border: '1px solid #3B3D52'
    }
  })

  const searchInputClassName = useEmotionCss(() => {
    return {
      'font-family': 'HarmonyOS Sans SC',
      'font-size': '14px',
      'font-weight': 'normal',
      'line-height': 'normal',
      'letter-spacing': '0em',
      'font-variation-settings': 'opsz auto',
      'font-feature-settings': 'kern on',
      color: '#FFFFFF'
    }
  })

  return (
    <div className={cn([searchInputContainerClassName, 'flex gap-1.5 w-full items-center p-2.5'])}>
      <input className={cn([searchInputClassName, 'flex-1 bg-transparent outline-none placeholder:text-[#767783]'])} placeholder="金额" />

      <div className="text-white text-[14px]">USDC</div>
    </div>
  )
}
