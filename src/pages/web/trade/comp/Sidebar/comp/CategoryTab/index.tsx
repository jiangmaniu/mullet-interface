import { Tabs } from 'antd-mobile'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import { useStores } from '@/context/mobxProvider'

import styles from './styles.less'

type IProps = {
  onChange?: (key: any) => void
  activeKey?: any
}

function CategoryTabs({ onChange, activeKey }: IProps) {
  const [current, setCurrent] = useState('0')
  const { trade } = useStores()

  const symbolCategory = trade.symbolCategory

  useEffect(() => {
    setCurrent(activeKey || '0')
  }, [activeKey])

  useEffect(() => {
    trade.getSymbolCategory()
  }, [])

  console.log('symbolCategory', symbolCategory)

  return (
    <div className={styles.tabs}>
      <Tabs
        onChange={(key) => {
          onChange?.(key)
          setCurrent(key)

          // 请求分类下的品种
          trade.getSymbolList({ classify: key })
        }}
        activeKey={current}
        // @ts-ignore
        style={{ '--title-font-size': '14px', '--active-line-height': '0px', '--adm-color-border': '#fff', paddingLeft: 4 }}
      >
        {symbolCategory.map((v, index) => (
          <Tabs.Tab title={v.label} key={v.key} style={{ padding: '5px 9px' }} />
        ))}
      </Tabs>
    </div>
  )
}

export default observer(CategoryTabs)
