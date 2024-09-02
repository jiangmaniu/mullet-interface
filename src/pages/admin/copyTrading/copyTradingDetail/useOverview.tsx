import { getIntl } from '@umijs/max'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { tradeFollowProfitStatistics, tradeFollowStatistics, tradeFollowSymbolStatistics } from '@/services/api/tradeFollow/lead'
import { message } from '@/utils/message'

export const useOverview = ({ id }: { id: string | undefined }) => {
  // 使用 dayjs 获取今天
  const endDatetime = dayjs()

  const [dateRange1, setDateRange1] = useState('14')
  const [statistics, setStatistics] = useState<TradeFollowLead.TradeFollowLeadStatisticsItem>({
    averageProfitRate: 0,
    earningRateTotal: 0,
    followerProfit: 0,
    leadProfit: 0,
    retracementRate: 0,
    winRate: 0
  })

  const [dateRange2, setDateRange2] = useState('14')

  const [profitStatistics, setProfitStatistics] = useState<TradeFollowLead.TradeFollowLeadProfitStatisticsItem>({
    earningRates: [
      {
        date: '05.01',
        earningRate: 1
      },
      {
        date: '05.02',
        earningRate: 2
      },
      {
        date: '05.03',
        earningRate: 3
      },
      {
        date: '05.04',
        earningRate: 4
      },
      {
        date: '05.05',
        earningRate: 5
      },
      {
        date: '05.06',
        earningRate: 6
      }
    ],
    profitAmounts: [
      {
        date: '05.01',
        profitAmount: 6
      },
      {
        date: '05.02',
        profitAmount: 5
      },
      {
        date: '05.03',
        profitAmount: 4
      },
      {
        date: '05.04',
        profitAmount: 4
      },
      {
        date: '05.05',
        profitAmount: 2
      },
      {
        date: '05.06',
        profitAmount: 1
      }
    ]
  })

  //   { value: 735, name: 'BTCUSDT 永续', meta: { profit: 1234 }, itemStyle: { color: '#45A48A' } },
  //   { value: 1548, name: 'ETHUSDT 永续', meta: { profit: -1234 }, itemStyle: { color: '#183EFC' } }
  // 交易偏好
  const [dateRange3, setDateRange3] = useState('14')
  const [symbolStatistics, setSymbolStatistics] = useState<TradeFollowLead.TradeFollowLeadSymbolStatisticsItem[]>([
    {
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
    }
  ])
  useEffect(() => {
    // 带单表现
    tradeFollowStatistics({
      leadId: String(id),
      // startDatetime = endDatetime 日期减去 dateRange1 天
      startDatetime: endDatetime.subtract(Number(dateRange1), 'day').format('YYYY-MM-DD 00:00:00'),
      endDatetime: endDatetime.format('YYYY-MM-DD 23:59:59')
    })
      .then((res) => {
        // form.setFieldsValue(formDefault) // 重置
        if (res.success) {
          if (!res.data) {
            message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
            return
          }

          setStatistics(res.data)
          // message.info(getIntl().formatMessage({ id: 'common.opSuccess' }))
        }
      })
      .catch((error) => {
        message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
      })
  }, [id, dateRange1])

  useEffect(() => {
    // 累计盈亏
    tradeFollowProfitStatistics({
      leadId: String(id),
      // startDatetime = endDatetime 日期减去 dateRange2 天
      startDatetime: endDatetime.subtract(Number(dateRange2), 'day').format('YYYY-MM-DD 00:00:00'),
      endDatetime: endDatetime.format('YYYY-MM-DD 23:59:59')
    })
      .then((res) => {
        // form.setFieldsValue(formDefault) // 重置
        if (res.success) {
          setProfitStatistics(res.data as TradeFollowLead.TradeFollowLeadProfitStatisticsItem)
          // message.info(getIntl().formatMessage({ id: 'common.opSuccess' }))
        }
      })
      .catch((error) => {
        message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
      })
  }, [id, dateRange2])

  useEffect(() => {
    // 交易偏好
    tradeFollowSymbolStatistics({
      id: String(id),
      // startDatetime = endDatetime 日期减去 dateRange3 天
      startDatetime: endDatetime.subtract(Number(dateRange3), 'day').format('YYYY-MM-DD 00:00:00'),
      endDatetime: endDatetime.format('YYYY-MM-DD 23:59:59')
    })
      .then((res) => {
        // form.setFieldsValue(formDefault) // 重置
        if (res.success) {
          // message.info(getIntl().formatMessage({ id: 'common.opSuccess' }))
          setSymbolStatistics(res.data as TradeFollowLead.TradeFollowLeadSymbolStatisticsItem[])
        }
      })
      .catch((error) => {
        message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
      })
  }, [id, dateRange3])

  return {
    statistics,
    profitStatistics,
    symbolStatistics,
    dateRange1,
    setDateRange1
  }
}
