import { NumberInput } from '@/components/input/number-input'
import { useNiceModal } from '@/components/providers/nice-modal-provider/hooks'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { useMainAccount } from '@/hooks/user/use-main-account'
import { getTradeCoreApiInstance } from '@/services/api/trade-core/instance'
import { create } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { omit } from 'lodash-es'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

export const CreateVaultModal = create((props: React.ComponentProps<typeof Modal>) => {
  const mainAccount = useMainAccount()
  const modal = useNiceModal()

  const formSchema = z.object({
    name: z.string(),
    amount: z.string(),
    remark: z.string()
    // .refine(
    //   (val) => {
    //     return BNumber.from(val).gte(MIN_DEPOSIT_AMOUNT)
    //   },
    //   {
    //     message: `最低每笔存入${MIN_DEPOSIT_AMOUNT}USDC`
    //   }
    // )
    // .refine(
    //   (val) => {
    //     return BNumber.from(val).lte(mainAccount?.money)
    //   },
    //   {
    //     message: `最大存入${mainAccount?.money}USDC`
    //   }
    // )
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', amount: '', remark: '' }
  })

  const handleSubmitCreateVault = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log('data', data)
      const tradeCareApi = getTradeCoreApiInstance()

      const rs = await tradeCareApi.followManage.postFollowManageCreatePool({
        followPoolName: data.name,
        initialMoney: Number(data.amount),
        mainAccountId: mainAccount?.id,
        redeemCloseOrder: true,
        remark: data.remark
      })

      if (rs.data.success) {
        toast.success('创建金库成功')
        props?.onOpenChange?.(false)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Modal {...props} {...{ open: props.open ?? modal.visible, onOpenChange: props.onOpenChange ?? modal.setVisible }}>
      <ModalContent aria-describedby={undefined} className="gap-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitCreateVault)}>
            <ModalHeader>
              <ModalTitle className="">创建金库</ModalTitle>
            </ModalHeader>

            <div className="">
              <div className="text-[12px] text-[#9FA0B0]">你选择分发的金额将按每个存款用户比例发放到对应交易账户中。</div>

              <div className="mt-5">
                <FormField
                  control={form.control}
                  name={'name'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex-1 space-y-2">
                          <Input placeholder="请创建您的金库名称" {...field} />

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
                  name={'remark'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex-1 space-y-2">
                          <Textarea placeholder="请输入您的金库描述" {...field} />

                          <FormMessage />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="mt-2.5 text-[12px] text-[#9FA0B0]">描述为250个字符以内</div>
              </div>

              <div className="mt-5">
                <FormField
                  control={form.control}
                  name={'amount'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex-1 space-y-2">
                          <NumberInput
                            placeholder="存款金额"
                            // min={MIN_DEPOSIT_AMOUNT}
                            // max={mainAccount?.money}
                            onValueChange={(...args: any[]) => {
                              console.log(args)
                              const [{ value }] = args
                              field.onChange(value)
                            }}
                            {...omit(field, 'onChange')}
                          />

                          <FormMessage />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-2.5 text-[12px] flex justify-between">
                <div className="text-[#9FA0B0]">交易账户可用余额</div>
                <div className="text-white">56321.52 USDC</div>
              </div>

              <div className="mt-5 text-[12px] text-[#9FA0B0]">
                <div>首次创建金库您存入至少100USDC。</div>
                <div>作为创建者，您必须在金库中保持超过5%的流动性。</div>
                <div>金库创建费用为100USDC，金库关闭时不会退还。</div>
                <div>创建者通过管理金库将会获得10%的利润分享。</div>
              </div>

              <Button block type="submit" className="mt-5" loading={form.formState.isSubmitting}>
                确定
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  )
})
