import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import DateRangePickerSheetModal from '@/pages/webapp/components/Base/DatePickerSheetModal/DateRangePickerSheetModal'
import Empty from '@/pages/webapp/components/Base/List/Empty'
import More from '@/pages/webapp/components/Base/List/More'
import { ModalRef } from '@/pages/webapp/components/Base/SheetModal'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getWithdrawalOrderList } from '@/services/api/wallet'
import { formatNum } from '@/utils'
import { FormattedMessage, useModel } from '@umijs/max'
import { PullToRefresh } from 'antd-mobile'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import VirtualList from 'rc-virtual-list'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { statusMap } from '..'
import WithdrawDetailModal from './WithdrawDetailModal'

/**
 * 资金流水
 */
function WithdrawList() {
  const i18n = useI18n()
  const { cn } = useTheme()

  const [data, setData] = useState<Wallet.withdrawalOrderListItem[]>([])
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)

  const getDatas = useCallback(() => {
    getWithdrawalOrderList({
      current: current,
      size: size,
      tradeAccountId: stores.trade.currentAccountInfo?.id,
      startTime,
      endTime
    }).then((res) => {
      if (res.success && res.data?.records) {
        setData(data.concat(res.data.records))
        setTotal(Number(res.data.total))
      }
    })
  }, [current, size, stores.trade.currentAccountInfo?.id, startTime, endTime])

  // 加载更多
  const onEndReached = useCallback(() => {
    if (data.length < total) {
      setCurrent(current + 1)
      getDatas()
    }
  }, [data.length, total])

  const onRefresh = async () => {
    setData([])
    setTotal(0)
    setCurrent(1)
    getDatas()
  }

  useEffect(() => {
    if ((startTime && endTime) || (!startTime && !endTime)) {
      onRefresh()
    }
  }, [startTime, endTime])

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const { theme } = useTheme()

  const renderItem = ({ item }: { item: Wallet.withdrawalOrderListItem }) => {
    return (
      <div className="flex flex-col gap-[6px] mb-5" onClick={() => onSelectItem(item)}>
        <div className=" text-xs font-medium text-gray-900 flex flex-row items-center gap-1">
          <Iconfont name="shijian" size={14} color={theme.colors.textColor.primary} />
          <span className="text-gray-900">{item.createTime}</span>
        </div>
        <div className="flex items-center bg-white flex-wrap gap-y-4 justify-betwee p-3 rounded-lg">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flew-row items-center gap-3 text-start min-w-[180px] flex-shrink-0">
              <div className=" bg-gray-50 w-10 h-10 rounded-full bg-secondary border border-gray-130 flex items-center justify-center">
                <Iconfont name="chujin" color="gray" width={18} height={18} />
              </div>
              <div className="w-[100px]">
                <div className="text-primary font-bold flex items-center">
                  <FormattedMessage id="mt.chujin" />
                  <span className=" text-xs font-normal" style={{ color: statusMap[item.status ?? 'FAIL']?.color }}>
                    &nbsp;·&nbsp;{statusMap[item.status ?? 'FAIL']?.text || '[status]'}
                  </span>
                </div>
                <div className="text-weak text-xs overflow-visible text-nowrap">
                  <FormattedMessage id="mt.danhao" />:{item.orderNo}
                </div>
              </div>
            </div>
            <div className="text-end min-w-[180px] text-base  md:text-xl font-bold flex-1">
              {formatNum(item.baseOrderAmount)} {item.baseCurrency}
            </div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <div className=" flex flex-row gap-2.5 items-center justify-center pl-[2px] ">
              <div className="flex text-sm flex-row items-center gap-1 overflow-hidden  ">
                <div className="flex h-4 min-w-[34px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white ">
                  {accountList.find((v) => v.id === item.tradeAccountId)?.synopsis?.abbr}
                </div>
                <span className=" text-nowrap text-ellipsis overflow-hidden">
                  {/* {accountList.find((v) => v.id === item.tradeAccountId)?.synopsis?.name} */}
                  &nbsp;#{accountList.find((v) => v.id === item.tradeAccountId)?.id}
                </span>
              </div>

              <Iconfont name="go" width={16} color="black" height={16} />
              <div className="text-end text-sm font-medium flex-1 flex flex-row items-center justify-start flex-shrink gap-1">
                <div>
                  {item.type === 'bank' ? (
                    <span>{item.bank}</span>
                  ) : (
                    <div className="flex flex-row items-center gap-1">
                      <img src={`${getEnv().imgDomain}${item.channelIcon}`} className="w-[22px] h-[22px] bg-gray-100 rounded-full" />
                      <span> {item.address || '[channelRevealName]'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onSelectItem = (item: Wallet.withdrawalOrderListItem) => {
    setItem(item)
    withdrawDetailModalRef.current?.show()
  }

  const datas = useMemo(() => {
    return data.map((item, index) => ({ item, index }))
  }, [data])

  const dateRangePickerRef = useRef<ModalRef>(null)
  const onDateRangeConfirm = (startDate: Date, endDate: Date) => {
    setStartTime(dayjs(startDate).format('YYYY-MM-DD 00:00:00'))
    setEndTime(dayjs(endDate).format('YYYY-MM-DD 23:59:59'))
  }

  const [item, setItem] = useState<Wallet.withdrawalOrderListItem | undefined>(undefined)
  const withdrawDetailModalRef = useRef<ModalRef>(null)

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <View bgColor="secondary" className={cn('flex-1 min-h-[90vh]')}>
        <View className={cn('flex flex-row justify-between items-center pt-[14px] px-[14px] pb-2 border-b border-gray-70')}>
          <View onPress={() => dateRangePickerRef.current?.show()}>
            {startTime && endTime ? (
              <div
                className="flex flex-row items-center gap-[5px]"
                onClick={() => {
                  // 清空日期
                  setStartTime(undefined)
                  setEndTime(undefined)
                }}
              >
                <Iconfont name="riqi" size={28} />
                <Text size="sm" color="primary">
                  {startTime ? dayjs(startTime).format('YYYY.MM.DD') : i18n.t('pages.position.Start Date')}
                </Text>
                -
                <Text size="sm" color="primary">
                  {endTime ? dayjs(endTime).format('YYYY.MM.DD') : i18n.t('pages.position.End Date')}
                </Text>
                <Iconfont name="down" size={28} />
              </div>
            ) : (
              <div className="flex flex-row items-center gap-[5px]">
                <Iconfont name="riqi" size={28} />
                <Text size="sm" color="primary">
                  {i18n.t('mt.xuanzeshijianfanwei')}
                </Text>
                <Iconfont name="down" size={28} />
              </div>
            )}
          </View>
        </View>
        <div className="px-[14px] pt-5">
          {datas.length > 0 ? (
            <View className={cn('pt-2')}>
              <VirtualList itemKey="index" data={datas} extraRender={() => <View>{data.length < total ? <More /> : <></>}</View>}>
                {renderItem}
              </VirtualList>
            </View>
          ) : (
            <View className={cn('flex flex-col items-center justify-center h-80')}>
              <Empty />
            </View>
          )}
        </div>
        <DateRangePickerSheetModal ref={dateRangePickerRef} onConfirm={onDateRangeConfirm} />
        <WithdrawDetailModal ref={withdrawDetailModalRef} item={item} />
      </View>
    </PullToRefresh>
  )
}

export default observer(WithdrawList)
