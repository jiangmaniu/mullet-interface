'use client'

import { AnchorProvider, Program } from '@coral-xyz/anchor'

import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'

import { useEffect, useState } from 'react'
import { Counter } from '../../../anchor-idl/idl'
import Idl from '../../../anchor-idl/idl.json'

interface UseProgramReturn {
  program: Program<Counter>
  counterAddress: PublicKey
  publicKey: PublicKey | null
  connected: boolean
  connection: Connection
}

/**
 * A hook that provides access to the Solana program, counter address,
 * connected wallet, and connection.
 * This hook handles the basic setup for the program.
 */
export function useProgram(): UseProgramReturn {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const [program, setProgram] = useState<Partial<Program<Counter>>>()

  useEffect(() => {
    let program
    // Program initialization - conditionally create with provider if wallet connected
    if (wallet) {
      // Create a provider with the wallet for transaction signing
      const provider = new AnchorProvider(connection, wallet, {
        // confirmed：交易被大多数节点确认（推荐平衡选择）。
        commitment: 'confirmed'
      })
      program = new Program<Counter>(Idl, provider)
    } else {
      // Create program with just connection for read-only operations
      program = new Program<Counter>(Idl, { connection })
    }
    setProgram(program)
  }, [wallet])

  // Get the counter account address
  const counterAddress = PublicKey.findProgramAddressSync(
    // 这是一个 种子（seed），用于区分同一程序下的不同账户（例如可以有多个计数器，用不同种子命名）。
    [Buffer.from('counter')],
    // 程序的 ID（来自 Anchor 生成的 IDL 文件），确保地址与当前程序绑定
    // 这是程序的 入口地址（Program ID），也就是智能合约（程序）本身在链上的地址
    // 由部署时生成，固定不变
    // 不能用于存储数据（程序本身是无状态的）
    // 程序ID	new PublicKey(Idl.address)	调用程序（无状态）
    // 数据账户（PDA）	findProgramAddressSync(seed, programId)	存储程序状态（如计数器）
    new PublicKey(Idl.address)
  )[0] // 返回一个数组 [PDA, bump]，这里取 [0] 获取 PDA 地址，bump 是用于避免地址冲突的随机数

  // Fund connected wallet with devnet SOL
  // useEffect(() => {
  //   const airdropDevnetSol = async () => {
  //     if (!publicKey) return;

  //     try {
  //       const balance = await connection.getBalance(publicKey);
  //       const solBalance = balance / LAMPORTS_PER_SOL;

  //       console.log(`Current balance: ${solBalance} SOL`);

  //       if (solBalance < 1) {
  //         await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   airdropDevnetSol();
  // }, [publicKey]);

  return {
    program: program as Program<Counter>,
    counterAddress,
    publicKey,
    connected,
    connection
  }
}
