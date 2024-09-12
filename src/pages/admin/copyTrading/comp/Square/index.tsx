import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { useRequest } from 'ahooks'
import { Pagination, Space } from 'antd'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import SelectRounded from '@/components/Base/SelectRounded'
import { useStores } from '@/context/mobxProvider'
import { useUpdateFollowStatus } from '@/hooks/useUpdateFollowStatus'
import { IOrderTakerState } from '@/models/takers'
import { getTradeFollowLeadPlaza } from '@/services/api/tradeFollow/lead'
import { colorTextPrimary } from '@/theme/theme.config'
import { message } from '@/utils/message'
import { push } from '@/utils/navigator'

import NoAccountModal from '../NoAccountModal'
import TradingSettingModal from '../TradingSettingModal'
import { defaultTags, defaultTimeRange } from './mock'
import { OrderTaker } from './OrderTaker'

function Square({ active }: { active: boolean }) {
  const intl = useIntl()

  const updateFollowStatus = useUpdateFollowStatus()

  // 只做默认显示，不参与运算
  const accountType = intl.formatMessage({ id: 'mt.zhanghuleixing' })
  const tag = intl.formatMessage({ id: 'mt.biaoqian' })
  const rateOfReturnNear = intl.formatMessage({ id: 'mt.jinqishouyilv' }, { range: intl.formatMessage({ id: 'mt.liangzhou' }) })

  const { trade } = useStores()
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const enableList = useMemo(() => currentUser?.accountList?.filter((item) => item.status === 'ENABLE') || [], [currentUser])
  // const enableList = [] // test

  // // 過濾只留下相同賬戶組
  // const accountList = useMemo(
  //   () =>
  //     (initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || []).filter((item) => {
  //       return item.groupName === lead?.groupName
  //     }),
  //   [initialState, lead?.groupName]
  // )

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

    return currentUser?.accountList?.reduce(
      (acc, item) => {
        if (item.groupName && !temp.includes(item.groupName)) {
          temp.push(item.groupName)

          acc.push({
            label: item.groupName,
            value: item.groupName
          })
        }
        return acc
      },
      [
        {
          label: intl.formatMessage({ id: 'common.quanbu' }),
          value: ''
        }
      ] as any[]
    )
  }, [currentUser])

  // 标签
  const [tags, setTags] = useState(defaultTags)

  // 时间區間
  const [timeRange, setTimeRange] = useState(defaultTimeRange)
  // 使用 dayjs 获取今天
  const today = dayjs()

  // 帶單員
  // const [takers, setTakers] = useState<TradeFollowLead.LeadPlazaItem[]>(defaultTakers as unknown as TradeFollowLead.LeadPlazaItem[])
  const [takers, setTakers] = useState<TradeFollowLead.LeadPlazaItem[]>([])

  // 无账号提示弹窗
  const [openTips, setOpenTips] = useState(false)
  const onOpenChangeTips = (val: boolean) => setOpenTips(val)

  // 跟单设置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const [info, setInfo] = useState<TradeFollowLead.LeadPlazaItem | null>(null)
  const onOpenChangeSetting = (val: boolean) => {
    setOpenSetting(val)
    getList()
  }

  const onClick = (id: string, state: string, followerId?: string) => {
    let _url = `/copy-trading/detail`
    if (state === '0') {
      _url = `/copy-trading/take-detail`
    }
    _url += `/${id}?state=${state}`
    if (followerId) _url += `&followerId=${followerId}`
    push(_url)
  }

  // 分页
  const [total, setTotal] = useState(0)
  // const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [size, setSize] = useState(9)
  const [current, setCurrent] = useState(1)

  const { run } = useRequest(getTradeFollowLeadPlaza, {
    manual: true,
    onBefore: () => {
      setLoading(true)
    },
    onSuccess(data, params) {
      setTakers(data?.data?.records || [])
      setTotal(data?.data?.total || 0)
    },
    onFinally() {
      setLoading(false)
    }
  })

  const getList = () => {
    if (active && trade.currentAccountInfo && trade.currentAccountInfo.id) {
      run({
        tradeAccountId: trade.currentAccountInfo.id,
        startDate: today.subtract(state.jinqi, 'day').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
        groupName: state.zhanghuleixing,
        size,
        current
      })
    }
  }

  useEffect(() => {
    getList()
  }, [active, state, trade.currentAccountInfo, size, current])

  const onFollow = (takerState: IOrderTakerState, info: Record<string, any>, ableList: User.AccountItem[]) => {
    setInfo(info)

    if (takerState === 1) {
      if (ableList.length === 0) {
        setOpenTips(true)
        return
      }

      setOpenSetting(true)
    } else if (takerState === 3) {
      setOpenSetting(true)
    } else {
      message.info(intl.formatMessage({ id: 'mt.yimanyuan' }))
    }
    // }
  }

  const [loading, setLoading] = useState(false)

  const onConfirm = (res: Record<string, any>) => {
    onOpenChangeSetting(false)

    // 刷新账号列表的跟单状态
    updateFollowStatus(true)
    push(`/copy-trading/detail/${res.leadId}?followerId=${res.followerId}`)
  }

  return (
    <Space direction="vertical" size={24} className="w-full">
      {trade.currentAccountInfo.id ? (
        <>
          <Space size={12}>
            <SelectRounded
              defaultValue={accountType}
              onChange={(i) => handleChange('zhanghuleixing', i)}
              options={accountTypes}
              optionRender={(item) => <div className="w-full text-center">{item.label}</div>}
            />
            <SelectRounded defaultValue={tag} onChange={(i) => handleChange('biaoqian', i)} options={tags} />
            <SelectRounded defaultValue={rateOfReturnNear} onChange={(i) => handleChange('jinqi', i)} options={timeRange} />
          </Space>
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-5">
            {takers.length > 0 ? (
              takers.map((item, idx) => (
                <OrderTaker accountList={enableList} key={idx} item={item} state={state} onClick={onClick} onFollow={onFollow} />
              ))
            ) : (
              <div className="flex items-center justify-center flex-col h-[36rem] gap-[3rem] col-span-3">
                <Empty src="/img/empty-gendanguanli.png" description={<FormattedMessage id="common.zanwujilu" />} />
              </div>
            )}
          </div>

          {total > size && (
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
          )}
        </>
      ) : (
        <div className="flex items-center justify-center flex-col h-[36rem] gap-[3rem]">
          <Empty src="/img/empty-daidan.png" description={<FormattedMessage id="common.zanwuzhanghao" />} />
          <Button
            height={44}
            type="primary"
            style={{
              width: 197,
              borderRadius: 8
            }}
            onClick={() => {
              push('/account/type')
            }}
          >
            <div className="flex items-center text-base font-pf-bold">
              <Iconfont name="daidan" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="common.chuangjianzhanghao" />
            </div>
          </Button>
        </div>
      )}

      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0">
          <PageLoading />
        </div>
      )}

      {/* <QA /> */}
      <NoAccountModal
        open={openTips}
        onOpenChange={onOpenChangeTips}
        params={{
          groupCode: info?.groupCode || ''
        }}
      />

      <TradingSettingModal
        leadId={info?.leadId}
        followerId={info?.followerId}
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={onConfirm}
      />
    </Space>
  )
}

export default observer(Square)
