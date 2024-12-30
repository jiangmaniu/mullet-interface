import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useIntl } from '@umijs/max'
import { Tabs } from 'antd-mobile'
import { observer } from 'mobx-react'
import { useEffect, useState, useTransition } from 'react'

import { useStores } from '@/context/mobxProvider'

type IProps = {
  onChange?: (key: any) => void
  activeKey?: any
}

function CategoryTabs({ onChange, activeKey }: IProps) {
  const [current, setCurrent] = useState('0')
  const { trade } = useStores()
  const [isPending, startTransition] = useTransition() // 切换内容，不阻塞渲染，提高整体响应性
  const intl = useIntl()

  const symbolCategory = trade.symbolCategory

  useEffect(() => {
    setCurrent(activeKey || '0')
  }, [activeKey])

  useEffect(() => {
    trade.getSymbolCategory()
  }, [])

  useEffect(() => {
    // 切换账户时，重置当前tab
    setCurrent('0')
  }, [trade.currentAccountInfo.id])

  const className = useEmotionCss(({ token }) => {
    return {
      '&': {
        marginTop: 8,
        '.adm-tabs-header': {
          borderBottom: 'none'
        },
        '.adm-tabs-tab': {
          padding: '2px 5px !important',
          color: 'var(--color-text-secondary)',
          borderRadius: '4px',
          '&:hover': {
            color: 'var(--color-text-primary)'
          }
        },
        '.adm-tabs-tab-active': {
          color: 'var(--color-text-primary)',
          background: 'var(--tabs-active-bg)'
        },
        '.adm-tabs-tab-list': {
          // paddingLeft: '9px !important',
          '.adm-tabs-tab-wrapper': {
            paddingRight: '0px !important',
            paddingLeft: '0px !important'
          }
        }
      }
    }
  })

  return (
    <div className={className}>
      <Tabs
        onChange={(key) => {
          startTransition(() => {
            onChange?.(key)
            setCurrent(key)

            // 请求分类下的品种
            trade.getSymbolList({ classify: key })
          })
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
