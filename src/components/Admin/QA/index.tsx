import { FormattedMessage } from '@umijs/max'
import type { CollapseProps } from 'antd'
import { Collapse, theme } from 'antd'
import React, { useCallback, useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { colorWhite } from '@/theme/theme.config'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const defaultItems: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>
    // style: panelStyle
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>
    // style: panelStyle
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>
    // style: panelStyle
  }
]

const QA: React.FC = () => {
  const { token } = theme.useToken()

  const getStyle = (isActive: boolean) => ({
    // margin: 0,
    margin: ' 1.125rem 1.5rem',
    background: isActive ? colorWhite : colorWhite,
    borderRadius: 12,
    border: 'none'
  })

  const [activeKey, setActiveKey] = useState(['1'])

  const getItems = useCallback(
    () =>
      defaultItems.map((item: any) => ({
        ...item,
        style: getStyle(activeKey.includes(item.key))
      })),
    [activeKey]
  )

  const items = getItems()

  return (
    <div className="flex flex-col gap-9">
      <span className=" text-3xl font-medium self-center m-auto">
        {' '}
        <FormattedMessage id="mt.changjianwenti" />
      </span>

      <Collapse
        bordered={false}
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as string[])}
        defaultActiveKey={['1']}
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <Iconfont name="shouqi1" width={38} color="black" height={38} />
          ) : (
            <Iconfont name="a-" width={38} color="black" height={38} />
          )
        }
        style={{ background: token.colorWhite }}
        items={items}
      />
    </div>
  )
}

export default QA
