import { useMemo } from "react"
import { useLpTokenManage } from "../web3-query/use-lp-manage"
import { useATATokenBalance } from "../web3-query/use-ata-balance"
import { PoolSeed } from "@/libs/web3/constans/enum"
import { usePDATokenBalance } from "../web3-query/use-pda-balance"
import { calculateLpPoolPrice } from "@/libs/web3/helpers/calculation-formula"
import { vaultAccountAddress, poolProgramAddress } from "@/libs/web3/constans/address"

export const useLpPoolPrice = (usdcAddress: string) => {
  const { data: vaultUsdcBalance } = useATATokenBalance({
    ownerAddress: vaultAccountAddress,
    mintAddress: usdcAddress
  })

  const { data: liquidityPoolBalance } = usePDATokenBalance({
    programAddress: poolProgramAddress,
    seed: PoolSeed.USDC,
    mintAddress: usdcAddress
  })

  const { data: lpTokenManage } = useLpTokenManage({
    programAddress: poolProgramAddress,
    seed: PoolSeed.LPManage
  })

  const lpPrice = useMemo(() => {
    return calculateLpPoolPrice({
      totalMinted: lpTokenManage?.totalMinted,
      totalBurned: lpTokenManage?.totalBurned,
      vaultAmount: vaultUsdcBalance,
      liquidityPoolAmount: liquidityPoolBalance
    })
  }, [lpTokenManage, liquidityPoolBalance, vaultUsdcBalance])

  return lpPrice?.toString()
}
