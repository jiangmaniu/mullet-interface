import { FormattedMessage } from '@umijs/max'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { tradeFollowProfitStatistics, tradeFollowStatistics, tradeFollowSymbolStatistics } from '@/services/api/tradeFollow/lead'

export const useOverview = ({ id }: { id: string | undefined }) => {
  // 时间區間
  const timeRangeOptions = [
    {
      value: '14',
      label: <FormattedMessage id="mt.liangzhou" />
    },
    {
      value: '30',
      label: <FormattedMessage id="mt.yiyue" />
    }
  ]

  // 使用 dayjs 获取今天
  const endDatetime = dayjs()

  const [dateRange1, setDateRange1] = useState('14')
  const { data: statistics, run: getStatistics } = useRequest(tradeFollowStatistics, {
    manual: true
  })

  useEffect(() => {
    getStatistics({
      leadId: String(id),
      // startDatetime = endDatetime 日期减去 dateRange1 天
      startDatetime: endDatetime.subtract(Number(dateRange1), 'day').format('YYYY-MM-DD 00:00:00'),
      endDatetime: endDatetime.format('YYYY-MM-DD 23:59:59')
    })
  }, [dateRange1])

  const [dateRange2, setDateRange2] = useState('14')
  const { data: profitStatistics, run: getProfitStatistics } = useRequest(tradeFollowProfitStatistics, {
    manual: true
  })

  useEffect(() => {
    getProfitStatistics({
      leadId: String(id),
      // startDatetime = endDatetime 日期减去 dateRange2 天
      startDatetime: endDatetime.subtract(Number(dateRange2), 'day').format('YYYY-MM-DD 00:00:00'),
      endDatetime: endDatetime.format('YYYY-MM-DD 23:59:59')
    })
  }, [dateRange2])

  // 交易偏好
  const [dateRange3, setDateRange3] = useState('14')
  /**
   * [{
      profit: 12334,
      rate: 0,
      symbol: 'BTCUSDT 永续',
      tradeCount: 735
    },
    {
      profit: -1234,
      rate: 0,
      symbol: 'ETHUSDT 永续',
      tradeCount: 1548
    }」
   */
  const { data: symbolStatistics, run: getSymbolStatistics } = useRequest(tradeFollowSymbolStatistics, {
    manual: true
  })

  useEffect(() => {
    getSymbolStatistics({
      id: String(id),
      // startDatetime = endDatetime 日期减去 dateRange3 天
      startDatetime: endDatetime.subtract(Number(dateRange3), 'day').format('YYYY-MM-DD 00:00:00'),
      endDatetime: endDatetime.format('YYYY-MM-DD 23:59:59')
    })
  }, [dateRange3])

  return {
    statistics: statistics?.data ?? [],
    profitStatistics: profitStatistics?.data || { earningRates: [], profitAmounts: [] },
    symbolStatistics: symbolStatistics?.data || [],
    dateRange1,
    setDateRange1,
    dateRange2,
    setDateRange2,
    dateRange3,
    setDateRange3,
    timeRangeOptions
  }
}
