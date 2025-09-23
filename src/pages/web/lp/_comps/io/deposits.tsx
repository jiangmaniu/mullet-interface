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
import { vaultAccountAddress } from '@/libs/web3/constans/address'
import { BNumber } from '@/utils/b-number'
import { BN } from '@coral-xyz/anchor'
import { zodResolver } from '@hookform/resolvers/zod'
import { getAssociatedTokenAddress, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function VaultDetailDeposits() {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const usdcMintAddress = currentAccountInfo.mintAddress

  const userWallet = useUserWallet()

  const { data: balance } = useATATokenBalance({
    ownerAddress: userWallet?.address,
    mintAddress: usdcMintAddress
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
          return BNumber.from(val).lte(balance)
        },
        {
          message: `最大存入${BNumber.toFormatNumber(balance)} USDC`
        }
      )
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: '' }
  })

  const price = useLpPoolPrice(usdcMintAddress)
  const usdcAmount = BNumber.from(form.watch('amount'))
  const LpMintAmount = usdcAmount?.div(price)

  const { getSignProgram } = useLpSwapProgram()
  const onSubmitDeposit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!userWallet?.address) {
        throw new Error('请先连接钱包')
      }

      const amountBigInt = BNumber.from(data.amount).multipliedBy(10 ** 6)

      const userWalletPublicKey = new PublicKey(userWallet?.address)
      const usdcMintPublicKey = new PublicKey(usdcMintAddress)
      const purchaseUsdcAccount = await getAssociatedTokenAddress(usdcMintPublicKey, userWalletPublicKey, false, TOKEN_PROGRAM_ID)

      const vaultAccountPublicKey = new PublicKey(vaultAccountAddress)
      const lpVault = getAssociatedTokenAddressSync(
        usdcMintPublicKey, // 代币 mint 地址
        vaultAccountPublicKey, // 所有者地址
        true, // allowOwnerOffCurve (设为 true 来允许离线曲线地址)
        TOKEN_PROGRAM_ID
      )

      const program = getSignProgram()
      const tx = await program.methods
        .purchaseMxlp(new BN(amountBigInt.toString()))
        .accounts({
          usdcMint: usdcMintPublicKey,
          lpVault: lpVault,
          purchaseUsdcAccount: purchaseUsdcAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .rpc()
      console.log(tx)
      debugger
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message)
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitDeposit)}>
          <div className="flex text-[12px] justify-between">
            <div className="text-[#9FA0B0]">您的金额</div>
            <div className=" text-white">{BNumber.toFormatNumber(balance)} USDC</div>
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
                        placeholder="金额"
                        RightContent={'USDC'}
                        max={BNumber.from(balance)?.toString()}
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
              <div className=" text-white">{BNumber.toFormatNumber(LpMintAmount, { volScale: 2 })} MTLP</div>
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
              立即存款
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-[30px] items-start  gap-2.5 flex">
        <Icons.lucide.Info className="text-[#FF8F34] size-4" />

        <div className="text-[12px] flex-1 text-[#9E9E9E] leading-normal">
          <div>存入 USDC 以换取 MTLP，MTLP 是代表您在流动性池中的资产所有权的代币。</div>
          <div>作为所有交易的对手方，质押者从平台上的每笔交易中赚取费用。MTLP 实时累积这些费用。</div>
        </div>
      </div>
    </div>
  )
}
