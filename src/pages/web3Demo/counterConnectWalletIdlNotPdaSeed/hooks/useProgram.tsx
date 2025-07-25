'use client'

import { AnchorProvider, Program } from '@coral-xyz/anchor'

import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, Connection, PublicKey } from '@solana/web3.js'

import { useEffect, useState } from 'react'
import { Counter } from '../idl/counter'
import Idl from '../idl/counter.json'

interface UseProgramReturn {
  program: Program<Counter>
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

  return {
    program: program as Program<Counter>,
    publicKey,
    connected,
    connection
  }
}

// The programId is imported from the program IDL.
export const COUNTER_PROGRAM_ID = new PublicKey(Idl.address)

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getCounterProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      // 写死测试环境的programId 调试
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return COUNTER_PROGRAM_ID
  }
}
