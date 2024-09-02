import { FormattedMessage, useModel } from '@umijs/max'
import { Pagination } from 'antd'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { DEFAULT_PAGE_SIZE } from '@/constants'
import { useStores } from '@/context/mobxProvider'
import { IOrderTaker } from '@/models/takers'
import { getTradeFollowLeadManagements } from '@/services/api/tradeFollow/lead'
import { colorTextPrimary } from '@/theme/theme.config'
import { push } from '@/utils/navigator'

import TakeSettingModal from '../TakeSettingModal'
import { defaultTakers } from './mock'
import { TakeItem } from './TakeItem'

export default function Take({ active }: { active: boolean }) {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const currentAccountList = accountList.filter((item) => !item.isSimulate)

  const [state, setState] = useState({})

  // 帶單員
  const [takers, setTakers] = useState<IOrderTaker[]>(defaultTakers)

  // 分页
  const [total, setTotal] = useState(0)
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE)
  const [current, setCurrent] = useState(1)

  // 跟单设置弹窗
  const [openSetting, setOpenSetting] = useState(false)
  const onOpenChangeSetting = (val: boolean) => setOpenSetting(val)

  const onClick = (id: string) => {
    console.log(id)
    setOpenSetting(true)
  }

  useEffect(() => {
    currentAccountInfo?.clientId &&
      active &&
      getTradeFollowLeadManagements({ clientId: String(currentAccountInfo?.clientId), current, size })
        .then((res) => {
          if (res.success) {
            // setTakers(res.data)
            if (res.data?.records?.length && res.data.records?.length > 0) {
              setTakers(res.data.records as IOrderTaker[])
              setTotal(res.data.total)
            }
            // message.info(getIntl().formatMessage({ id: 'mt.caozuochenggong' }))
          }
        })
        .catch((err) => {
          console.log(err)
        })
  }, [active, currentAccountInfo, current, size])

  const onTake = (id: string) => {
    const item = currentAccountList.find((item) => item.id === id)
    console.log(id)

    if (item) {
      trade.setCurrentAccountInfo(item)
      trade.jumpTrade()
      // 切换账户重置
      trade.setCurrentLiquidationSelectBgaId('CROSS_MARGIN')
    }
  }

  return (
    <div className="flex flex-col w-full gap-6">
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
        info={{}}
      />
    </div>
  )
}
