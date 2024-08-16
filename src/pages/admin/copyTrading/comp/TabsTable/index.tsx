import { useIntl } from '@umijs/max'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'

// const onChange = (key: string) => {
//   console.log(key)
// }

type IProps = {
  items: TabsProps['items']
  onChange?: TabsProps['onChange']
}

const TabsTable = ({ items, onChange }: IProps) => {
  const intl = useIntl()

  return <Tabs items={items} onChange={onChange} />
}

export default TabsTable
