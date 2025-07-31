import { useGetBlockInfo } from '@/hooks/web3/useGetBlockInfo'
import { push } from '@/utils/navigator'
import { useParams } from '@umijs/max'
import dayjs from 'dayjs'
import { useEffect } from 'react'

// 交易历史签名列表展示
export default function BlockDetail() {
  const { block } = useParams<{ block: string }>()
  const { blockInfo, loading, error, fetchBlockInfo } = useGetBlockInfo({ block: block || '' })

  useEffect(() => {
    fetchBlockInfo()
  }, [block, fetchBlockInfo])

  console.log('blockInfo', blockInfo)

  return (
    <div className="p-8">
      <div className="text-2xl font-bold mb-3">区块详情</div>
      <div className="flex flex-col gap-2 text-primary">
        <span>区块号：{block}</span>
        <div>区块时间：{blockInfo.blockTime ? dayjs(blockInfo.blockTime * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
        <div>
          区块哈希：<a onClick={() => push(`/explorer-test/block/${blockInfo.blockhash}`)}>{blockInfo.blockhash || '-'}</a>
        </div>
        <div>
          父区块号：<a onClick={() => push(`/explorer-test/block/${blockInfo.previousBlockhash}`)}>{blockInfo.previousBlockhash || '-'}</a>
        </div>
        <div>
          区块奖励：
          {Array.isArray(blockInfo.rewards) && blockInfo.rewards.length > 0 ? (
            <ul className="ml-2">
              {blockInfo.rewards.map((reward: any, idx: number) => (
                <li key={idx}>
                  地址: {reward.pubkey}，类型: {reward.rewardType}，奖励: {reward.lamports} lamports
                </li>
              ))}
            </ul>
          ) : (
            <span>无</span>
          )}
        </div>
        <div>交易数量：{Array.isArray(blockInfo.transactions) ? blockInfo.transactions.length : 0}</div>
      </div>
    </div>
  )
}
