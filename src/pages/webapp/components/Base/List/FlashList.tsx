import { useIntl } from '@umijs/max'
import { SpinLoading } from 'antd-mobile'
import { observer } from 'mobx-react'
import VirtualList, { ListProps } from 'rc-virtual-list'
import React, { useMemo } from 'react'

import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'

import type { Iprops as EmptyProps } from './Empty'
import Empty from './Empty'
import End from './End'
import More from './More'

/**参考app flashList组件适配 */
type IProps<T = any> = Omit<ListProps<T>, 'children' | 'itemKey'> & {
  /**渲染item */
  renderItem: (item: T) => React.ReactNode
  /**估算的 item 高度 */
  estimatedItemSize?: number
  /** Trigger when render list item changed 需要设置height才会生效*/
  onViewableItemsChanged?: (visibleList: T[], fullList: T[]) => void
  ListHeaderComponent?: React.ReactNode
  hasMore?: boolean
  showMoreText?: boolean
  refreshing?: boolean
  /**结合showEmpty使用 */
  emptyConfig?: EmptyProps
  /**暂无数据组件 */
  ListEmptyComponent?: React.ReactNode
  /**底部组件 */
  ListFooterComponent?: React.ReactNode
  itemKey?: string
  /**容器外层样式 同 style */
  contentContainerStyle?: React.CSSProperties
}

// 虚拟滚动列表
function FlashList<T>({
  ListHeaderComponent,
  onViewableItemsChanged,
  estimatedItemSize,
  renderItem,
  itemKey,
  height = 0,
  onScroll,
  refreshing,
  emptyConfig,
  ListEmptyComponent,
  ListFooterComponent,
  showMoreText,
  hasMore,
  style,
  contentContainerStyle,
  ...res
}: IProps<T>) {
  const { cn, theme } = useTheme()
  const { isDark } = theme
  const intl = useIntl()
  const showEmpty = res?.data?.length === 0

  const renderListFooterComponent = useMemo(() => {
    if (!showMoreText) return null
    if (res?.data?.length) {
      return hasMore ? <More /> : res?.data?.length > 3 ? <End /> : null
    }
    return null
  }, [res?.data?.length, showMoreText, hasMore])

  const _onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (onScroll) {
      onScroll(e)
    } else {
      // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
      if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - height) <= 1) {
        // appendData();
        console.log('_onScroll')
      }
    }
  }

  if (refreshing) {
    return (
      <div className="flex items-center justify-center my-[100px]">
        <SpinLoading />
      </div>
    )
  }

  if (!res?.data?.length) {
    if (showEmpty && !ListEmptyComponent) {
      return (
        <div style={{ flex: 1, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty text={intl.formatMessage({ id: 'common.NO Data' })} {...emptyConfig} />
        </div>
      )
    }

    if (ListEmptyComponent) return ListEmptyComponent
  }

  return (
    <div>
      {ListHeaderComponent}
      <VirtualList
        styles={{
          verticalScrollBarThumb: {
            width: 6,
            borderRadius: 4,
            background: isDark ? gray[578] : 'rgba(0, 0, 0, 0.05)'
          },
          verticalScrollBar: {
            background: `${isDark ? gray[675] : 'transparent'}`
          }
        }}
        itemHeight={estimatedItemSize || 41}
        itemKey={itemKey || 'id'}
        onScroll={_onScroll}
        height={height}
        onVisibleChange={onViewableItemsChanged}
        extraRender={(info) => <>{ListFooterComponent ? ListFooterComponent : renderListFooterComponent}</>}
        style={{ ...contentContainerStyle, ...style }}
        {...res}
      >
        {(item: T) => renderItem(item)}
      </VirtualList>
    </div>
  )
}

export default observer(FlashList)
