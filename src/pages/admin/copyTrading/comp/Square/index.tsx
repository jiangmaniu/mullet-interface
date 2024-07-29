import { useIntl, useModel } from '@umijs/max'
import { Space } from 'antd'
import { useMemo, useState } from 'react'

import QA from '@/components/Admin/QA'
import SelectRounded from '@/components/Base/SelectRounded'
import { IOrderTaker } from '@/models/takers'
import { push } from '@/utils/navigator'

import NoAccountModal from '../NoAccountModal'
import { defaultAccountTypes, defaultTags, defaultTakers, defaultTimeRange } from './mock'
import { OrderTaker } from './OrderTaker'

export default function Square() {
  const intl = useIntl()
  // 只做默认显示，不参与运算
  const accountType = intl.formatMessage({ id: 'mt.zhanghuleixing' })
  const tag = intl.formatMessage({ id: 'mt.biaoqian' })
  const rateOfReturnNear = intl.formatMessage({ id: 'mt.jinqishouyilv' }, { range: intl.formatMessage({ id: 'mt.liangzhou' }) })

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []

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
    jinqi: defaultTimeRange[0].value
  })

  // 账户类型
  const [accountTypes, setAccountTypes] = useState(defaultAccountTypes)

  // 标签
  const [tags, setTags] = useState(defaultTags)

  // 时间區間
  const [timeRange, setTimeRange] = useState(defaultTimeRange)

  // 帶單員
  const [takers, setTakers] = useState<IOrderTaker[]>(defaultTakers)

  const [open, setOpen] = useState(false)

  const onOpenChange = (val: boolean) => setOpen(val)
  const onClick = (id: string, state: string) => {
    if (ableList.length === 0) {
      setOpen(true)
      return
    }
    push(`/copy-trading/detail/${id}?state=${state}`)
  }

  return (
    <Space direction="vertical" size={24} className="w-full">
      <Space>
        <SelectRounded defaultValue={accountType} onChange={(i) => handleChange('zhanghuleixing', i.value)} options={accountTypes} />
        <SelectRounded defaultValue={tag} onChange={(i) => handleChange('biaoqian', i.value)} options={tags} />
        <SelectRounded defaultValue={rateOfReturnNear} onChange={(i) => handleChange('jinqi', i.value)} options={timeRange} />
      </Space>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-5">
        {takers.map((item, idx) => (
          <OrderTaker key={idx} item={item} state={state} onClick={onClick} />
        ))}
      </div>
      <QA />
      <NoAccountModal open={open} onOpenChange={onOpenChange} />
    </Space>
  )
}
