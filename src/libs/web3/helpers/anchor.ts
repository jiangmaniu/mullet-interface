import { Address, address, createSolanaRpc, getProgramDerivedAddress } from '@solana/kit'
import { Buffer } from 'buffer'
import { Wallet, TransactionFn } from '@coral-xyz/anchor'
import { PublicKey, Transaction } from '@solana/web3.js'

export type AnchorAccountLayoutFieldType = 'u64' | 'u32' | 'u16' | 'u8' | 'bool' | 'publicKey'
export type AnchorAccountLayoutField = { name: string; type: AnchorAccountLayoutFieldType }
export type AnchorAccountLayout = AnchorAccountLayoutField[]

type FetchAnchorAccountParams = {
  rpcClient: RpcClient
  programIdStr: string
  seeds: (Buffer | Uint8Array)[]
  layout: AnchorAccountLayout
}

export async function fetchAnchorAccount<T extends Record<string, any> = Record<string, any>>({
  rpcClient,
  programIdStr,
  seeds,
  layout
}: FetchAnchorAccountParams): Promise<{
  pda: Address<string>
  data: T
}> {
  const rpc = rpcClient
  const programId = address(programIdStr)

  // 计算 PDA
  const [pda] = await getProgramDerivedAddress({
    seeds,
    programAddress: programId
  })

  // 获取账户数据
  const accountInfo = await rpc.getAccountInfo(pda).send()
  if (!accountInfo?.value?.data) {
    throw new Error(`Account not found at PDA: ${pda.toString()}`)
  }

  const data = Buffer.from(accountInfo.value.data, 'base64')

  // 跳过 Anchor discriminator (8 字节)
  let offset = 8

  //  按 layout 解码
  const decoded: Record<string, any> = {}
  for (const field of layout) {
    switch (field.type) {
      case 'u64':
        decoded[field.name] = data.readBigUInt64LE(offset).toString()
        offset += 8
        break
      case 'u32':
        decoded[field.name] = data.readUInt32LE(offset)
        offset += 4
        break
      case 'u8':
        decoded[field.name] = data.readUInt8(offset)
        offset += 1
        break
      case 'bool':
        decoded[field.name] = data.readUInt8(offset) !== 0
        offset += 1
        break
      case 'publicKey':
        // 将 Buffer 转为 base58 字符串后再传给 address
        decoded[field.name] = address(data.slice(offset, offset + 32).toString('base64'))
        offset += 32
        break
      default:
        throw new Error(`Unknown type: ${field.type}`)
    }
  }

  return { pda, data: decoded as T }
}

// function createAnchorWallet(privyWallet): Wallet {
//   return {
//     publicKey: privyWallet?.publicKey || null,
//     signTransaction: async (tx: Transaction) => {
//       return await privyWallet.signTransaction(tx);
//     },
//     signAllTransactions: async (txs: Transaction[]) => {
//       return await privyWallet.signAllTransactions(txs);
//     },
//   };
// }
