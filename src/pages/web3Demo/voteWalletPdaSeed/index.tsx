// @ts-nocheck
// pda + 种子 方式 投票demo

import { usePrivy } from '@privy-io/react-auth'
import { SystemProgram } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { useProgram } from './hooks/useProgram'

const VotingDemo = () => {
  const { login, logout, authenticated, user } = usePrivy()
  const { program, votingAccountAddress, publicKey } = useProgram()

  const [voteResults, setVoteResults] = useState({
    eth: 0,
    btc: 0,
    sol: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState('')

  // 货币配置
  const currencies = [
    {
      name: 'Bitcoin',
      symbol: 'btc',
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: '₿'
    },
    {
      name: 'Ethereum',
      symbol: 'eth',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: 'Ξ'
    },
    {
      name: 'Solana',
      symbol: 'sol',
      color: 'bg-purple-500 hover:bg-purple-600',
      icon: '◎'
    }
  ]

  // 获取投票结果
  const fetchResults = async () => {
    if (!program) return

    try {
      setIsLoading(true)
      // 获取投票账户数据
      const accountData = await program.account.votingAccount.fetch(votingAccountAddress)
      console.log('accountData.btc:', Number(accountData.btc))
      console.log('accountData.eth:', Number(accountData.eth))
      console.log('accountData.sol:', Number(accountData.sol))
      setVoteResults({
        eth: Number(accountData.eth),
        btc: Number(accountData.btc),
        sol: Number(accountData.sol)
      })
      setIsInitialized(true)
    } catch (err) {
      console.log('Account not initialized yet')
      setIsInitialized(false)
      // 如果账户不存在，设置默认值
      setVoteResults({ eth: 0, btc: 0, sol: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  // 初始化投票账户
  const initializeVoting = async () => {
    if (!program || !publicKey) return

    try {
      setIsLoading(true)
      setError('')

      await program.methods
        .initialize()
        .accounts({
          // @ts-ignore
          votingAccount: votingAccountAddress,
          user: publicKey,
          systemProgram: SystemProgram.programId
        })
        .rpc()

      setIsInitialized(true)
      await fetchResults()
    } catch (err: any) {
      console.error('Initialize error:', err)
      setError('初始化失败: ' + (err.message || '未知错误'))
    } finally {
      setIsLoading(false)
    }
  }

  // 投票功能
  const handleVote = async (currency: any) => {
    if (!program || !publicKey) {
      setError('请先连接钱包')
      return
    }

    if (!isInitialized) {
      setError('请先初始化投票系统')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await program.methods
        .vote(String(currency).toLocaleUpperCase())
        .accounts({
          // @ts-ignore
          votingAccount: votingAccountAddress,
          user: publicKey
        })
        .rpc()

      console.log('等待交易确认...')
      // 等待交易确认（15秒可能不够，建议增加）
      await new Promise((resolve) => setTimeout(resolve, 15000)) // 增加等待时间

      // 投票成功后刷新结果
      await fetchResults()
    } catch (err: any) {
      console.error('Vote error:', err)
      if (err.code === 6000) {
        setError('无效的货币类型')
      } else {
        setError('投票失败: ' + (err.message || '未知错误'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 组件加载时获取结果
  useEffect(() => {
    if (authenticated && program) {
      fetchResults()
    }
  }, [authenticated, program])

  // 计算总票数和百分比
  const totalVotes = Number(voteResults.eth + voteResults.btc + voteResults.sol)

  const getPercentage = (votes: any) => {
    if (totalVotes === 0) return 0
    return ((Number(votes) / totalVotes) * 100).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🗳️ 加密货币投票系统</h1>
          <p className="text-gray-600">基于 Solana 区块链的去中心化投票平台</p>
        </div>

        {/* 钱包连接 */}
        <div className="flex justify-center mb-8">
          {!authenticated ? (
            <button
              onClick={login}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              🔗 连接钱包
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm text-gray-600">已连接: </span>
                <span className="font-mono text-sm">
                  {user?.wallet?.address?.slice(0, 8)}...{user?.wallet?.address?.slice(-8)}
                </span>
              </div>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                断开连接
              </button>
            </div>
          )}
        </div>

        {authenticated && (
          <div className="max-w-4xl mx-auto">
            {/* 错误信息 */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

            {/* 初始化按钮 */}
            {!isInitialized && (
              <div className="text-center mb-8">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  投票系统尚未初始化，请先初始化系统
                </div>
                <button
                  onClick={initializeVoting}
                  disabled={isLoading}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '初始化中...' : '🚀 初始化投票系统'}
                </button>
              </div>
            )}

            {/* 投票结果展示 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 当前投票结果</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currencies.map((currency) => {
                  const votes = Number(voteResults[currency.symbol])
                  const percentage = getPercentage(voteResults[currency.symbol])

                  return (
                    <div key={currency.symbol} className="text-center">
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-3xl mb-2">{currency.icon}</div>
                        <h3 className="font-semibold text-lg text-gray-800">{currency.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mt-2">{votes.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{percentage}%</div>
                      </div>

                      {/* 进度条 */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            currency.symbol === 'btc' ? 'bg-orange-500' : currency.symbol === 'eth' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  总票数: <span className="font-semibold">{totalVotes.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* 投票按钮 */}
            {isInitialized && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🗳️ 为你支持的货币投票</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currencies.map((currency) => (
                    <button
                      key={currency.symbol}
                      onClick={() => handleVote(currency.symbol)}
                      disabled={isLoading}
                      className={`${currency.color} text-white p-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105`}
                    >
                      <div className="text-3xl mb-2">{currency.icon}</div>
                      <div className="text-lg">{isLoading ? '处理中...' : `投票给 ${currency.name}`}</div>
                    </button>
                  ))}
                </div>

                <div className="text-center mt-6 text-sm text-gray-500">💡 每次投票都会与Solana区块链交互，需要消耗少量SOL作为交易费用</div>
              </div>
            )}

            {/* 刷新按钮 */}
            <div className="text-center mt-6">
              <button
                onClick={fetchResults}
                disabled={isLoading}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '刷新中...' : '🔄 刷新结果'}
              </button>
            </div>
          </div>
        )}

        {!authenticated && (
          <div className="text-center text-gray-600 mt-8">
            <p>请连接钱包以开始使用投票系统</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VotingDemo
