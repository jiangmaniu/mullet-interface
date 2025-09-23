import { NumberInput } from '@/components/input/number-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import SliderTooltip from '@/components/ui/slider-tooltip'
import { BNumber } from '@/utils/b-number'
import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { zodResolver } from '@hookform/resolvers/zod'
import { omit } from 'lodash-es'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function VaultDetailWithdrawals() {
  const formSchema = z.object({
    amountPercent: z.string()
    // .refine(
    //   (val) => {
    //     return BNumber.from(val).lt(MIN_DEPOSIT_AMOUNT)
    //   },
    //   {
    //     message: `最低每笔存入${MIN_DEPOSIT_AMOUNT}USDC`
    //   }
    // )
    // .refine(
    //   (val) => {
    //     return BNumber.from(val).gt(mainAccount?.money)
    //   },
    //   {
    //     message: `最大存入${mainAccount?.money}USDC`
    //   }
    // )
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { amountPercent: '' }
  })

  const vaultNetValue = 11100

  const amountPercent = form.watch('amountPercent')
  const estimatedWithdrawalAmount = BNumber.from(amountPercent).div(100).multipliedBy(vaultNetValue)

  const onSubmitWithdrawals = async (data: z.infer<typeof formSchema>) => {
    console.log('data', data)

    await new Promise((resolve) => setTimeout(resolve, 10000))
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitWithdrawals)}>
          <div className="flex text-[12px] justify-between">
            <div className="text-[#9FA0B0]">您的金库净值</div>
            <div className=" text-white">≈{BNumber.toFormatNumber(vaultNetValue, { unit: 'USDC' })}</div>
          </div>

          <div className="mt-4">
            <FormField
              control={form.control}
              name={'amountPercent'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex-1 space-y-2">
                      <NumberInput
                        placeholder="金额"
                        min={0}
                        max={100}
                        decimalScale={0}
                        onValueChange={({ value }) => {
                          field.onChange(value)
                        }}
                        RightContent={'%'}
                        {...omit(field, 'onChange')}
                      />

                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <FormField
              control={form.control}
              name={'amountPercent'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex-1 space-y-2">
                      <SliderTooltip
                        min={0}
                        step={1}
                        max={100}
                        {...field}
                        showTooltip={true}
                        tooltipFormat={([value]) => {
                          return <div className="text-white">{value}%</div>
                        }}
                        interval={100 / 5}
                        value={[BNumber.from(field.value).toNumber()]}
                        onValueChange={(val) => {
                          field.onChange(val[0])
                        }}
                      />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex text-[12px] mt-[14px] justify-between">
            <div className="text-[#9FA0B0]">预计提取金额</div>
            <div className=" text-white">≈{BNumber.toFormatNumber(estimatedWithdrawalAmount, { unit: 'USDC' })}</div>
          </div>

          <div className="mt-[30px]">
            <Button block type="submit">
              立即取现
            </Button>
          </div>
        </form>
      </Form>
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
