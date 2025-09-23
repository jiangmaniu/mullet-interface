import { NumberInput } from '@/components/input/number-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/components/ui/toast'
import { useStores } from '@/context/mobxProvider'
import { useLpPoolPrice } from '@/hooks/lp/use-lp-price'
import { useUserWallet } from '@/hooks/user/use-wallet-user'
import { useATATokenBalance } from '@/hooks/web3-query/use-ata-balance'
import { useLpSwapProgram } from '@/hooks/web3/use-anchor-program'
import { poolProgramAddress } from '@/libs/web3/constans/address'
import { PoolSeed } from '@/libs/web3/constans/enum'
import { BNumber } from '@/utils/b-number'
import { BN } from '@coral-xyz/anchor'
import { zodResolver } from '@hookform/resolvers/zod'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function VaultDetailWithdrawals() {
  const userWallet = useUserWallet()
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const usdcMintAddress = currentAccountInfo.mintAddress

  const [lpMintAddress] = PublicKey.findProgramAddressSync([Buffer.from(PoolSeed.LPMint)], new PublicKey(poolProgramAddress))

  const { data: lpBalance } = useATATokenBalance({
    ownerAddress: userWallet?.address,
    mintAddress: lpMintAddress.toString()
  })

  const formSchema = z.object({
    amount: z
      .string()
      // .refine(
      //   (val) => {
      //     return BNumber.from(val).gte(MIN_DEPOSIT_AMOUNT)
      //   },
      //   {
      //     message: `最低每笔存入${MIN_DEPOSIT_AMOUNT}USDC`
      //   }
      // )
      .refine(
        (val) => {
          return BNumber.from(val).lte(lpBalance)
        },
        {
          message: `最大取现${BNumber.toFormatNumber(lpBalance)} MTLP`
        }
      )
  })

  const { getSignProgram } = useLpSwapProgram()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: '' }
  })

  const price = useLpPoolPrice(usdcMintAddress)
  const lpAmount = BNumber.from(form.watch('amount'))
  const usdcAmount = lpAmount?.multipliedBy(price)

  const onSubmitWithdrawals = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!userWallet?.address) {
        throw new Error('请先连接钱包')
      }

      const amountBigInt = BNumber.from(data.amount).multipliedBy(10 ** 6)
      const program = getSignProgram()

      const userWalletPublicKey = new PublicKey(userWallet?.address)

      const redeemMxlpAccount = await getAssociatedTokenAddress(lpMintAddress, userWalletPublicKey, false, TOKEN_PROGRAM_ID)

      const tx = await program.methods
        .redeemMxlp(new BN(amountBigInt.toString()))
        .accounts({
          redeemMxlpAccount: redeemMxlpAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .rpc()
      console.log(tx)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitWithdrawals)}>
          <div className="flex text-[12px] justify-between">
            <div className="text-[#9FA0B0]">您的份额</div>
            <div className=" text-white">{BNumber.toFormatNumber(lpBalance, { volScale: 2 })} MTLP</div>
          </div>

          <div className="mt-3.5">
            <FormField
              control={form.control}
              name={'amount'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex-1 space-y-2">
                      <NumberInput
                        allowNegative={false}
                        placeholder="取现份额"
                        RightContent={'MTLP'}
                        max={BNumber.from(lpBalance)?.toString()}
                        decimalScale={2}
                        onValueChange={({ value }) => {
                          field.onChange(value)
                        }}
                        {...field}
                      />

                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-3.5">
            <div className="flex text-[12px] justify-between">
              <div className="text-[#9FA0B0]">您将获得</div>
              <div className=" text-white">{BNumber.toFormatNumber(usdcAmount, { volScale: 2 })} USDC</div>
            </div>
          </div>

          <div className="mt-3.5">
            <div className="flex text-[12px] justify-between">
              <div className="text-[#9FA0B0]">MTLP/USDC</div>
              <div className=" text-white">1 MTLP = {BNumber.toFormatNumber(price, { volScale: 2 })} USDC</div>
            </div>
          </div>

          <div className="mt-[30px]">
            <Button block type="submit" loading={form.formState.isSubmitting}>
              立即取现
            </Button>
          </div>
        </form>
      </Form>
      {/* <div className="mt-[30px] items-start gap-2.5 flex">
        <Icons.lucide.Info className="text-[#FF8F34] size-4" />

        <div className="text-[#9E9E9E] text-[12px]">
          <div>
            您的存款可以在 <span className="text-[#FF8F34]">2025/9/17 00:52:17</span> 之后提取。
          </div>
          <div>操作取款后会将资金划转到您的交易账户。</div>
        </div>
      </div> */}

      <div className="mt-[30px] items-start gap-2.5 flex">
        <Icons.lucide.Info className="text-[#FF8F34] size-4" />

        <div className="text-[#9E9E9E] flex-1 text-[12px]">
          <div>申请取款后MTLP会暂时储存到合约中，并将会1~3天内自动发放到您的取款地址中。 </div>
        </div>
      </div>
    </div>
  )
}
