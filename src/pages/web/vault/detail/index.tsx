import { GeneralTooltip } from '@/components/tooltip'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { formatAddress } from '@/utils/web3'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import VaultDetailCharts from './_comps/charts'
import VaultDetailInfo from './_comps/info'
import VaultDetailIOPanel from './_comps/io'
import VaultDetailRecords from './_comps/records'

export default function VaultDetail() {
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <VaultDetailTitle />

      <div className="flex flex-col gap-2.5">
        <VaultDetailOverview />
        <div className="flex gap-2.5">
          <div className="flex-1 flex items-stretch flex-col gap-2.5">
            <div>
              <VaultDetailInfo />
            </div>
            <div>
              <VaultDetailCharts />
            </div>
          </div>

          <div className="max-w-[480px] w-full">
            <VaultDetailIOPanel />
          </div>
        </div>

        <div>
          <VaultDetailRecords />
        </div>
      </div>
    </div>
  )
}

function VaultDetailTitle() {
  const titleClassName = useEmotionCss(() => ({
    fontFamily: 'HarmonyOS Sans SC',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: 'normal',
    letterSpacing: '0em',
    fontVariationSettings: '"opsz" auto',
    fontFeatureSettings: '"kern" on',
    color: '#FFFFFF'
  }))
  const addressClassName = useEmotionCss(() => ({
    fontFamily: 'HarmonyOS Sans SC',
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 'normal',
    letterSpacing: '0em',
    fontVariationSettings: '"opsz" auto',
    fontFeatureSettings: '"kern" on',
    color: '#9FA0B0'
  }))
  return (
    <div className="py-5">
      <div className={titleClassName}>Party Risk</div>

      <div className="flex gap-2.5 items-center">
        <div className={addressClassName}>{formatAddress('0x0291...3f43')}</div>
        <Button variant="ghost" size="icon">
          <Icons.lucide.Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function VaultDetailOverview() {
  const contentClassName = useEmotionCss(() => ({
    fontFamily: 'HarmonyOS Sans SC',
    fontSize: '24px',
    fontWeight: 'normal',
    lineHeight: 'normal',
    letterSpacing: '0em',
    fontVariationSettings: '"opsz" auto',
    fontFeatureSettings: '"kern" on',
    color: '#FFFFFF'
  }))

  const labelClassName = useEmotionCss(() => ({
    fontFamily: 'HarmonyOS Sans SC',
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 'normal',
    letterSpacing: '0em',
    fontVariationSettings: '"opsz" auto',
    fontFeatureSettings: '"kern" on',
    color: '#9FA0B0'
  }))

  return (
    <div className={'bg-[#0A0C27] rounded-[10px] py-2.5 flex'}>
      {[
        {
          label: '总锁仓量',
          content: '$18,229,265.84'
        },

        {
          label: '过去一个月表现',
          content: 'APR 15.78%'
        },
        {
          label: '你的余额',
          content: '--',
          tooltip: '回报率是根据不同周期的平均值计算的，并不代表真实的未来收益。 30 day 14.05%'
        },
        {
          label: '您总赚取金额',
          content: '--',
          tooltip: '回报率是根据不同周期的平均值计算的，并不代表真实的未来收益。 30 day 14.05%'
        }
      ].map((item) => (
        <div className="flex flex-1 flex-col gap-1.5 py-[25px] px-[30px]">
          <div className={contentClassName}>{item.content}</div>
          <div className="flex items-center gap-3">
            <div className={labelClassName}>{item.label}</div>
            {item.tooltip && (
              <GeneralTooltip content={item.tooltip}>
                <Icons.lucide.Info className="w-4 h-4 text-[#9FA0B0]" />
              </GeneralTooltip>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
