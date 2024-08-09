import { useIntl } from '@umijs/max'
import { Segmented } from 'antd'
import { useState } from 'react'

import Footer from '@/components/Admin/Footer'
import Hidden from '@/components/Base/Hidden'

import Ended from './Ended'
import Historical from './Historical'
import InProgress from './InProgress'

export default function CopyTrading() {
  const intl = useIntl()

  // 帶單員
  // const [takers, setTakers] = useState<IOrder[]>(defaultTakers)

  const [segment, setSegment] = useState('jingxingzhong')

  const options = [
    {
      label: intl.formatMessage({ id: 'mt.jinxingzhong' }),
      value: 'jingxingzhong',
      component: <InProgress />
    },
    {
      label: intl.formatMessage({ id: 'mt.yijieshu' }),
      value: 'yijieshu',
      component: <Ended />
    },
    {
      label: intl.formatMessage({ id: 'mt.lishicangwei' }),
      value: 'lishicangwei',
      component: <Historical />
    }
  ]

  return (
    <>
      <div className=" mb-3.5">
        <Segmented<string> options={options.map(({ component, ...option }) => option)} value={segment} onChange={setSegment} />
      </div>
      {options.map((item, idx) => (
        <Hidden show={item.value === segment} key={idx}>
          {item.component}
        </Hidden>
      ))}
      <Footer />
    </>
  )
}
