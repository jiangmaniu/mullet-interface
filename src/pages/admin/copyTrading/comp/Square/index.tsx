import { useIntl, useModel } from '@umijs/max'
import { Pagination, Space } from 'antd'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'

import SelectRounded from '@/components/Base/SelectRounded'
import { DEFAULT_PAGE_SIZE } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { IOrderTakerState } from '@/models/takers'
import { getTradeFollowLeadPlaza } from '@/services/api/tradeFollow/lead'
import { push } from '@/utils/navigator'

import NoAccountModal from '../NoAccountModal'
import TradingSettingModal from '../TradingSettingModal'
import { defaultTags, defaultTakers, defaultTimeRange } from './mock'
import { OrderTaker } from './OrderTaker'

function Square({ active }: { active: boolean }) {
  const intl = useIntl()
  // 只做默认显示，不参与运算
  const accountType = intl.formatMessage({ id: 'mt.zhanghuleixing' })
  const tag = intl.formatMessage({ id: 'mt.biaoqian' })
  const rateOfReturnNear = intl.formatMessage({ id: 'mt.jinqishouyilv' }, { range: intl.formatMessage({ id: 'mt.liangzhou' }) })

  const { trade } = useStores()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const ableList = useMemo(() => currentUser?.accountList?.filter((item) => item.status === 'ENABLE') || [], [currentUser])
  // const ableList = [] // test

  const handleChange = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value
    })
  }

  const [state, setState] = useState({
    zhanghuleixing: undefined,
    biaoqian: undefined,
    jinqi: defaultTimeRange[0].count
  })

  // 账户类型/交易账户组
  const accountTypes = useMemo(() => {
    const temp = [] as string[]

    return currentUser?.accountList?.reduce((acc, item) => {
      if (item.groupName && !temp.includes(item.groupName)) {
        temp.push(item.groupName)

        acc.push({
          label: item.groupName,
          value: item.groupName
        })
      }
      return acc
    }, [] as any[])
  }, [currentUser])

  // 标签
  const [tags, setTags] = useState(defaultTags)

  // 时间區間
  const [timeRange, setTimeRange] = useState(defaultTimeRange)
  // 使用 dayjs 获取今天
  const today = dayjs()

  // 帶單員
  const [takers, setTakers] = useState<TradeFollowLead.LeadPlazaItem[]>(defaultTakers as unknown as TradeFollowLead.LeadPlazaItem[])

  // 无账号提示弹窗
  const [openTips, setOpenTips] = useState(false)
  const onOpenChangeTips = (val: boolean) => setOpenTips(val)

  // 跟单设置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const [info, setInfo] = useState<Record<string, any>>({})
  const onOpenChangeSetting = (val: boolean) => setOpenSetting(val)

  const onClick = (id: string, state: string) => {
    push(`/copy-trading/detail/${id}?state=${state}`)
  }

  // 分页
  const [total, setTotal] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    if (active && trade.currentAccountInfo && trade.currentAccountInfo.id) {
      console.log('state', state)
      setLoading(true)
      getTradeFollowLeadPlaza({
        tradeAccountId: trade.currentAccountInfo.id,
        startDate: today.subtract(state.jinqi, 'day').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
        groupName: state.zhanghuleixing,
        size,
        current
      })
        .then((res) => {
          console.log('getTradeFollowLeadPlaza', res)

          // @ts-ignore
          if (res.success) {
            if (res.data?.records && res.data.records.length > 0) {
              setTakers(res.data.records)
              setTotal(res.data.total)
            }
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [active, state, trade.currentAccountInfo, size, current])

  const onFollow = (takerState: IOrderTakerState, info: Record<string, any>) => {
    setInfo(info)

    // if (takerState === 1 || takerState === 3) {
    if (ableList.length === 0) {
      setOpenTips(true)
      return
    }
    setOpenSetting(true)
    //   // } else if (takerState === 'wufagendan') {
    //   //   message.info(intl.formatMessage({ id: 'mt.wufagendan' }))
    // } else if (takerState === 2) {
    //   message.info(intl.formatMessage({ id: 'mt.yimanyuan' }))
    // }
  }

  const [loading, setLoading] = useState(false)

  return (
    <Space direction="vertical" size={24} className="w-full">
      <Space size={12}>
        <SelectRounded defaultValue={accountType} onChange={(i) => handleChange('zhanghuleixing', i)} options={accountTypes} />
        <SelectRounded defaultValue={tag} onChange={(i) => handleChange('biaoqian', i)} options={tags} />
        <SelectRounded defaultValue={rateOfReturnNear} onChange={(i) => handleChange('jinqi', i)} options={timeRange} />
      </Space>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-5">
        {takers.map((item, idx) => (
          <OrderTaker key={idx} item={item} state={state} onClick={onClick} onFollow={onFollow} />
        ))}
      </div>

      <div className="flex items-end justify-end ">
        <Pagination
          current={current}
          onChange={setCurrent}
          total={total}
          pageSize={size}
          onShowSizeChange={setSize}
          pageSizeOptions={['10', '20', '50']}
        />
      </div>
      {/* <QA /> */}
      <NoAccountModal open={openTips} onOpenChange={onOpenChangeTips} />

      <TradingSettingModal
        leadId={info.leadId}
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={() => {
          onOpenChangeSetting(false)
        }}
      />
    </Space>
  )
}

export default observer(Square)
