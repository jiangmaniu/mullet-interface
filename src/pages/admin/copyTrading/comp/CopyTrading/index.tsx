import './index.less'

import { useIntl } from '@umijs/max'
import { Segmented } from 'antd'
import { memo, useState } from 'react'

import Footer from '@/components/Admin/Footer'
import Hidden from '@/components/Base/Hidden'

import Ended from './Ended'
import Historical from './Historical'
import InProgress from './InProgress'

const SegmentItem = memo(({ segment, value, label }: { segment: string; value: string; label: string }) => {
  return (
    <div
      style={{
        width: segment === value ? 90 : '100%',
        minWidth: 60,
        fontSize: 16
        // transition: 'width 15s',
        // animation: segment === value ? ' expand 15s linear 1 normal' : ' shrink 15s linear 1 normal'
      }}
    >
      {label}
    </div>
  )
})

export default function CopyTrading() {
  const intl = useIntl()

  // 帶單員
  // const [takers, setTakers] = useState<IOrder[]>(defaultTakers)

  const [segment, setSegment] = useState('jinxingzhong')

  const options = [
    {
      label: <SegmentItem segment={segment} value="jinxingzhong" label={intl.formatMessage({ id: 'mt.jinxingzhong' })} />,
      value: 'jinxingzhong',
      component: <InProgress />
    },
    {
      label: <SegmentItem segment={segment} value="yijieshu" label={intl.formatMessage({ id: 'mt.yijieshu' })} />,
      value: 'yijieshu',
      component: <Ended />
    },
    {
      label: <SegmentItem segment={segment} value="lishicangwei" label={intl.formatMessage({ id: 'mt.lishicangwei' })} />,
      value: 'lishicangwei',
      component: <Historical />
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="mb-3.5 ">
        <Segmented<string>
          className="dynamic"
          options={options.map(({ component, ...option }) => option)}
          value={segment}
          onChange={setSegment}
        />
      </div>
      {options.map((item, idx) => (
        <Hidden show={item.value === segment} key={idx}>
          {item.component}
        </Hidden>
      ))}
      <Footer />
    </div>
  )
}
