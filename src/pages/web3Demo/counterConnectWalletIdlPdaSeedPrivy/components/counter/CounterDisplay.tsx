'use client'

import { useEffect, useState } from 'react'

import useConnection from '@/hooks/web3/useConnection'
import { useProgram } from './hooks/useProgram'
/**
 * CounterDisplay component that displays the current counter value
 * and handles its own data fetching logic.
 */
export function CounterDisplay() {
  // Get program information from the hook
  const { program, counterAddress, publicKey } = useProgram()
  const { connection } = useConnection()

  console.log('当前切换的钱包地址', publicKey?.toBase58())

  // Local state
  const [counterValue, setCounterValue] = useState<number | null>(null)
  const [isFetchingCounter, setIsFetchingCounter] = useState(true)

  // Fetch counter account to get the count value
  const fetchCounterValue = async () => {
    if (!connection || !program) return

    try {
      setIsFetchingCounter(true)
      // Fetch the counter account
      const counterAccount = await program.account.counter.fetch(counterAddress)
      console.log('fetchCounterValue', Number(counterAccount.count))
      setCounterValue(Number(counterAccount.count))
    } catch (err) {
      console.error('Error fetching counter value:', err)
      setCounterValue(null)
    } finally {
      setIsFetchingCounter(false)
    }
  }

  // Initial fetch and on connection change
  useEffect(() => {
    if (connection) {
      fetchCounterValue()
    }
  }, [connection, program])

  // Set up WebSocket subscription to listen for account changes
  useEffect(() => {
    if (!connection) return

    try {
      // Subscribe to account changes
      // 订阅程序账户变化
      const subscriptionId = connection.onAccountChange(
        counterAddress,
        (accountInfo) => {
          console.log('accountInfo:', accountInfo)
          const decoded = program.coder.accounts.decode('counter', accountInfo.data)
          console.log('Decoded counter value:', decoded)
          console.log('===counter value:', Number(decoded.count))
          setCounterValue(Number(decoded.count))
        },
        {
          commitment: 'confirmed',
          encoding: 'base64'
        }
      )

      // Clean up subscription when component unmounts
      return () => {
        console.log('Unsubscribing from counter account')
        connection.removeAccountChangeListener(subscriptionId)
      }
    } catch (err) {
      console.error('Error setting up account subscription:', err)
      return () => {}
    }
  }, [connection, counterAddress, program])

  return (
    <div className="text-center w-full px-5 text-white">
      <p className="text-sm text-muted-foreground mb-2">Current Count:</p>
      <div className="h-14 flex items-center justify-center">
        {isFetchingCounter ? (
          <div className="h-7 w-7 rounded-full border-3 border-purple-400/30 border-t-purple-400 animate-spin" />
        ) : (
          <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">{counterValue}</p>
        )}
      </div>
    </div>
  )
}
