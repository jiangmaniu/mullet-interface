import { useGetSignatureInfo } from '@/hooks/web3/useGetSignatureInfo'
import { push } from '@/utils/navigator'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useParams } from '@umijs/max'
import dayjs from 'dayjs'
import { useEffect } from 'react'

// 交易详情
export default function TxDetail() {
  const { signature } = useParams<{ signature: string }>()
  const { signatureInfo, loading, error, fetchSignatureInfo } = useGetSignatureInfo({ signature: signature || '' })

  useEffect(() => {
    fetchSignatureInfo()
  }, [signature, fetchSignatureInfo])

  console.log('signatureInfo', signatureInfo)

  return (
    <div className="p-8">
      <div className="text-2xl font-bold mb-3">交易详情</div>
      <div className="text-sm text-gray-500 mb-3">
        <div className="flex flex-col gap-2 text-primary">
          <div>signature: {signature}</div>
          <div>blockTime: {dayjs(signatureInfo.blockTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div>
            slot: <a onClick={() => push(`/explorer-test/block/${signatureInfo.slot}`)}>{signatureInfo.slot}</a>
          </div>
          <div>recentBlockhash: {signatureInfo.transaction?.message?.recentBlockhash}</div>
          <div>fee: {signatureInfo.meta?.fee / LAMPORTS_PER_SOL} SOL</div>
          <div>computeUnitsConsumed: {signatureInfo.meta?.computeUnitsConsumed}</div>
          <div>costUnits: {signatureInfo.meta?.costUnits}</div>
          <div>status: {signatureInfo.meta?.err ? 'Failed' : 'Success'}</div>
          <div>accountKeys:</div>
          <ul className="ml-4 list-disc">
            {signatureInfo.transaction?.message?.accountKeys?.map((key: any, idx: number) => (
              <li key={idx}>{typeof key === 'string' ? key : key?.toBase58 ? key.toBase58() : String(key)}</li>
            ))}
          </ul>
          <div>logMessages:</div>
          <ul className="ml-4 list-disc">
            {signatureInfo.meta?.logMessages?.map((msg: string, idx: number) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
