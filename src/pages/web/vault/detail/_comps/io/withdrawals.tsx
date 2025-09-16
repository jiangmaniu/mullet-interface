import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'

export default function VaultDetailWithdrawals() {
  return (
    <div>
      <div className="flex text-[12px] justify-between">
        <div className="text-[#9FA0B0]">您的金库净值</div>
        <div className=" text-white">≈0.00 USDC</div>
      </div>

      <div className="mt-4">
        <AmountInputPanel />
      </div>

      <div className="flex text-[12px] mt-[14px] justify-between">
        <div className="text-[#9FA0B0]">预计提取金额</div>
        <div className=" text-white">≈0.00 USDC</div>
      </div>

      <div className="mt-[30px]">
        <Button block>立即取现</Button>
      </div>

      <div className="mt-[30px] items-start gap-2.5 flex">
        <Icons.lucide.Info className="text-[#FF8F34] size-4" />

        <div className="text-[#9E9E9E] text-[12px]">
          <div>
            您的存款可以在 <span className="text-[#FF8F34]">2025/9/17 00:52:17</span> 之后提取。
          </div>
          <div>操作取款后会将资金划转到您的交易账户。</div>
        </div>
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
