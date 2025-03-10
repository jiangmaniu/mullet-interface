import { PAYMENT_ORDER_TIMEOUT } from '@/constants'
import { FormattedMessage } from '@umijs/max'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/utils/cn'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const Timer = ({
  paymentInfo,
  handleTimeout,
  address
}: {
  paymentInfo: Wallet.GenerateDepositOrderDetailResult
  handleTimeout: () => void
  address: string
}) => {
  const [duration, setDuration] = useState(-1)

  const createDate = useMemo(() => {
    try {
      return dayjs(paymentInfo?.createTime)
    } catch (error) {
      return dayjs()
    }
  }, [paymentInfo?.createTime])

  const canncelOrderTime = paymentInfo?.canncelOrderTime

  const getDuration = useCallback(() => {
    if (!canncelOrderTime || !Number.isFinite(Number(canncelOrderTime))) return PAYMENT_ORDER_TIMEOUT - dayjs().diff(createDate)
    return Number(canncelOrderTime) * 60 * 1000 - dayjs().diff(createDate)
  }, [createDate, canncelOrderTime])

  const timer = useRef<NodeJS.Timeout | null>(null)
  const setTimer = () => {
    timer.current = setInterval(() => {
      const duration = getDuration()
      setDuration(duration)
      if (duration <= 0) {
        handleTimeout()
        setDuration(-1)
        clearInterval(timer.current as NodeJS.Timeout)
        timer.current = null
      }
    }, 1000)
  }

  useEffect(() => {
    if (createDate && canncelOrderTime) {
      setTimer()
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current as NodeJS.Timeout)
        timer.current = null
      }
    }
  }, [createDate, canncelOrderTime])

  return (
    <div className={cn('text-secondary text-xs')}>
      <FormattedMessage
        id="mt.shengyufukuanshijian"
        values={{
          time: <span className={cn(duration > 0 ? 'text-success' : 'text-error')}>{dayjs.duration(duration).format('mm:ss')}</span>
        }}
      />
    </div>
  )
}
