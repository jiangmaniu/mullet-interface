import { PageLoading } from '@ant-design/pro-components'
import { FormattedMessage, useModel } from '@umijs/max'
import { useRequest } from 'ahooks'
import { Pagination } from 'antd'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { DEFAULT_PAGE_SIZE } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { IOrderTaker } from '@/models/takers'
import { getTradeFollowLeadDetail, getTradeFollowLeadManagements } from '@/services/api/tradeFollow/lead'
import { colorTextPrimary } from '@/theme/theme.config'
import { push } from '@/utils/navigator'

import TakeSettingModal from '../TakeSettingModal'
import { TakeItem } from './TakeItem'

export default function Take({ active }: { active: boolean }) {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const currentAccountList = accountList.filter((item) => !item.isSimulate)
  const [loading, setLoading] = useState(false)

  const [state, setState] = useState({})

  // 帶單員
  const [takers, setTakers] = useState<IOrderTaker[]>([])

  // 分页
  const [total, setTotal] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [current, setCurrent] = useState(1)

  // 跟单设置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const onOpenChangeSetting = (val: boolean) => setOpenSetting(val)

  const [curr, setCurr] = useState<TradeFollowLead.LeadDetailItem | null>(null)
  const onClick = (id: string) => {
    //  读取详情
    setLoading(true)
    getTradeFollowLeadDetail({
      leadId: String(id)
    })
      .then((res) => {
        // @ts-ignore
        if (res.success) {
          setCurr({ ...res.data, leadId: id })
          setOpenSetting(true)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const { run } = useRequest(getTradeFollowLeadManagements, {
    manual: true,
    onBefore: () => {
      setLoading(true)
    },
    onSuccess(data, params) {
      if (data?.data) {
        if (data.data.records) {
          setTakers(data.data.records as IOrderTaker[])
          setTotal(data.data.total)
        }
      }
    },
    onFinally: () => {
      setLoading(false)
    }
  })

  useEffect(() => {
    if (currentAccountInfo?.clientId && active) {
      run({ clientId: String(currentAccountInfo?.clientId), current, size })
    }
  }, [active, currentAccountInfo, current, size])

  const onTake = (id: string) => {
    const item = currentAccountList.find((item) => item.id === id)

    if (item) {
      trade.setCurrentAccountInfo(item)
      trade.jumpTrade()
      // 切换账户重置
      trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')
    }
  }

  return (
    <div className="flex flex-col w-full gap-6">
      {loading && (
        <div className=" flex justify-center items-center h-full w-full absolute top-0 left-0">
          <PageLoading />
        </div>
      )}
      {takers.length > 0 ? (
        <>
          {takers.map((item: IOrderTaker, idx: number) => (
            <TakeItem key={idx} item={item} state={state} onClick={onClick} onTake={onTake} />
          ))}
          <div className="self-end">
            <Pagination
              current={current}
              onChange={setCurrent}
              total={total}
              pageSize={size}
              onShowSizeChange={setSize}
              pageSizeOptions={['10', '20', '50']}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-col h-[36rem] gap-[3rem]">
          <Empty src="/img/empty-daidan.png" description={<FormattedMessage id="common.zanwujilu" />} />
          <Button
            height={44}
            type="primary"
            style={{
              width: 197,
              borderRadius: 8
            }}
            onClick={() => {
              push('/copy-trading/apply')
            }}
          >
            <div className="flex items-center text-base font-pf-bold">
              <Iconfont name="daidan" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.shenqingchengweidaidanyuan" />
            </div>
          </Button>
        </div>
      )}

      <TakeSettingModal
        open={openSetting}
        onOpenChange={onOpenChangeSetting}
        onConfirm={() => {
          onOpenChangeSetting(false)
        }}
        info={curr}
      />
    </div>
  )
}
