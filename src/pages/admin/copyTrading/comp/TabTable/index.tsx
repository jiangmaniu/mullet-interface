import { useIntl } from '@umijs/max'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'

import TabTableHistory from './History'
import TabTableOrders from './Orders'
import TabTableUsers from './Users'

const onChange = (key: string) => {
  console.log(key)
}

const TabTable = () => {
  const intl = useIntl()

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: intl.formatMessage({ id: 'mt.dangqiandaidan' }),
      children: <TabTableOrders />
    },
    {
      key: '2',
      label: intl.formatMessage({ id: 'mt.lishidaidan' }),
      children: <TabTableHistory />
    },
    {
      key: '3',
      label: intl.formatMessage({ id: 'mt.gendanyonghu' }),
      children: <TabTableUsers />
    }
  ]

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
}

export default TabTable
