import { FormattedMessage } from '@umijs/max'
import { Tabs } from 'antd-mobile'
import { useEffect, useState } from 'react'

import styles from './styles.less'

type IProps = {
  onChange?: (key: any) => void
  activeKey?: any
}

export default function CategoryTabs({ onChange, activeKey }: IProps) {
  const [current, setCurrent] = useState('0')

  const categoryItems = [
    { key: 0, label: <FormattedMessage id="mt.quanbu" /> },
    { key: 1, label: <FormattedMessage id="mt.shuzihuobi" /> },
    { key: 2, label: <FormattedMessage id="mt.shangpin" /> },
    { key: 3, label: <FormattedMessage id="mt.waihui" /> },
    { key: 4, label: <FormattedMessage id="mt.zhishu" /> }
  ]

  useEffect(() => {
    setCurrent(activeKey || '0')
  }, [activeKey])

  return (
    <div className={styles.tabs}>
      <Tabs
        onChange={(key) => {
          onChange?.(key)
          setCurrent(key)
        }}
        activeKey={current}
        // @ts-ignore
        style={{ '--title-font-size': '14px', '--active-line-height': '0px', '--adm-color-border': '#fff', paddingLeft: 4 }}
      >
        {categoryItems.map((v, index) => (
          <Tabs.Tab title={v.label} key={index} style={{ padding: '5px 9px' }} />
        ))}
      </Tabs>
    </div>
  )
}
