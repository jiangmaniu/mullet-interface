import './style.less'

import { useIntl } from '@umijs/max'
import { Space } from 'antd'
import { useState } from 'react'

import QA from '@/components/Admin/QA'
import SelectRounded from '@/components/Base/SelectRounded'

import { defaultAccountTypes, defaultTags, defaultTakers, defaultTimeRange } from './mock'
import { IOrderTaker, OrderTaker } from './OrderTaker'

export default function Square() {
  const intl = useIntl()
  // 只做默认显示，不参与运算
  const accountType = intl.formatMessage({ id: 'mt.zhanghuleixing' })
  const tag = intl.formatMessage({ id: 'mt.biaoqian' })
  const rateOfReturnNear = intl.formatMessage({ id: 'mt.jinqishouyilv' }, { range: intl.formatMessage({ id: 'mt.liangzhou' }) })

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

  return (
    <Space direction="vertical" size={24} className="w-full">
      <Space>
        <SelectRounded defaultValue={accountType} onChange={(i) => handleChange('zhanghuleixing', i.value)} options={accountTypes} />
        <SelectRounded defaultValue={tag} onChange={(i) => handleChange('biaoqian', i.value)} options={tags} />
        <SelectRounded defaultValue={rateOfReturnNear} onChange={(i) => handleChange('jinqi', i.value)} options={timeRange} />
      </Space>
      <div className="grid xl:grid-cols-3 grid-cols-2 w-full gap-5">
        {takers.map((item, idx) => (
          <OrderTaker key={idx} taker={item} state={state} />
        ))}
      </div>
      <QA />
    </Space>
  )
}
