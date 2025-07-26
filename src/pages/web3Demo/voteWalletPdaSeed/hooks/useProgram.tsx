'use client'

import { AnchorProvider, Program } from '@coral-xyz/anchor'

import { PublicKey } from '@solana/web3.js'

import useConnection from '@/hooks/web3/useConnection'
import { PrivyWalletAdapterForAnchor } from '@/utils/privy'
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth'
import { useEffect, useMemo, useState } from 'react'
import Idl from '../idl/vote.json'
import { Voting } from '../idl/voting'

interface UseProgramReturn {
  program: Program<Voting>
  votingAccountAddress: PublicKey
  publicKey: PublicKey
}

/**
 * A hook that provides access to the Solana program, counter address,
 * connected wallet, and connection.
 * This hook handles the basic setup for the program.
 */
export function useProgram(): UseProgramReturn {
  const { user, authenticated } = usePrivy()
  const { wallets } = useSolanaWallets()
  const { connection } = useConnection()
  const [program, setProgram] = useState<Partial<Program<Voting>>>()
  // 获取钱包实例
  const walletInstance = useMemo(() => wallets.find((item) => item.address === user?.wallet?.address), [wallets, user?.wallet?.address])

  // 从 Privy 用户信息中获取公钥
  const publicKey = user?.wallet?.address ? new PublicKey(user.wallet.address) : null

  useEffect(() => {
    let program
    // Program initialization - conditionally create with provider if wallet connected
    if (authenticated && user?.wallet?.address && walletInstance) {
      // 创建 Privy 钱包适配器
      const privyWalletAdapter = new PrivyWalletAdapterForAnchor(walletInstance)

      // Create a provider with the wallet for transaction signing
      const provider = new AnchorProvider(connection, privyWalletAdapter, {
        // confirmed：交易被大多数节点确认（推荐平衡选择）。
        commitment: 'confirmed'
      })
      program = new Program<Voting>(Idl, provider)
    } else {
      // Create program with just connection for read-only operations
      program = new Program<Voting>(Idl, { connection })
    }
    setProgram(program)
  }, [authenticated, user?.wallet?.address, connection, walletInstance])

  // Get the counter account address
  const votingAccountAddress = PublicKey.findProgramAddressSync(
    // 这是一个 种子（seed），用于区分同一程序下的不同账户（例如可以有多个计数器，用不同种子命名）。
    [Buffer.from('voting_account')],
    // 程序的 ID（来自 Anchor 生成的 IDL 文件），确保地址与当前程序绑定
    // 这是程序的 入口地址（Program ID），也就是智能合约（程序）本身在链上的地址
    // 由部署时生成，固定不变
    // 不能用于存储数据（程序本身是无状态的）
    // 程序ID	new PublicKey(Idl.address)	调用程序（无状态）
    // 数据账户（PDA）	findProgramAddressSync(seed, programId)	存储程序状态（如计数器）
    new PublicKey(Idl.address)
  )[0] // 返回一个数组 [PDA, bump]，这里取 [0] 获取 PDA 地址，bump 是用于避免地址冲突的随机数

  return {
    program: program as Program<Voting>,
    votingAccountAddress,
    publicKey: publicKey as PublicKey
  }
}
