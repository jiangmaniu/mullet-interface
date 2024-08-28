import { useMemo } from 'react'

import { useEnv } from '@/context/envProvider'
import { colorTextPrimary, colorTextSecondary } from '@/theme/theme.config'
import { formatNum } from '@/utils'

type Item = {
  value?: number | string | React.ReactNode
  label?: string | React.ReactNode
  valueStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
  /**@name 自定义渲染value和label区域 */
  renderItem?: () => React.ReactNode
  style?: React.CSSProperties
  /**@name 文本对齐方式 */
  textAlign?: 'left' | 'center' | 'right'
  /**@name 是否格式化数据 */
  isFormatValue?: boolean
}
interface IProps {
  left?: Item
  center?: Item
  right?: Item
  /**@name 外层元素样式 */
  style?: React.CSSProperties
  /**@name 自定义渲染 */
  renderItem?: () => React.ReactNode
  /**@name value和label样式调换 */
  isReverseValueLabelColor?: boolean
}
export default function ListItem({ left, center, right, renderItem, style, isReverseValueLabelColor }: IProps) {
  const { isMobile, isIpad } = useEnv()
  const getItem = (item: Item, key?: string) => {
    if (item.renderItem) {
      return item.renderItem()
    }

    if (key === 'center') {
      item.style = {
        // 居中对齐
        textAlign: 'center',
        ...item.style
      }
    }
    if (key === 'right') {
      item.style = {
        // 右对齐
        textAlign: 'right',
        ...item.style
      }
    }

    return (
      <>
        {item.label && (
          <span
            className="text-sub text-sm pt-[3px] truncate w-full"
            style={{
              color: isReverseValueLabelColor ? colorTextPrimary : colorTextSecondary,
              fontSize: isMobile ? 12 : 14,
              ...item.labelStyle,
              ...item.style
            }}
          >
            {item.label}
          </span>
        )}
        <span
          className="text-main text-sm pt-[3px] truncate w-full"
          style={{
            color: isReverseValueLabelColor ? colorTextSecondary : colorTextPrimary,
            fontSize: isMobile ? 12 : 14,
            ...item.valueStyle,
            ...item.style
          }}
        >
          {item.isFormatValue ? formatNum(item.value, { precision: 2 }) : item.value || '--'}
        </span>
      </>
    )
  }
  const renderCardItem = useMemo(() => {
    // 左边布局
    if (left && !center && !right) {
      return (
        <div className="flex flex-col w-full" style={left.style}>
          {getItem(left, 'left')}
        </div>
      )
    }
    // 右边布局
    if (!left && !center && right) {
      return (
        <div className="flex flex-col items-end w-full" style={right.style}>
          {getItem(right, 'right')}
        </div>
      )
    }
    // 三栏布局
    if (center && right && left) {
      return (
        <>
          <div className="flex flex-col justify-center w-[33.33%]" style={left.style}>
            {getItem(left, 'left')}
          </div>
          <div className="flex flex-col items-center justify-center w-[33.33%]" style={center.style}>
            {getItem(center, 'center')}
          </div>
          <div className="flex flex-col items-end w-[33.33%]" style={right.style}>
            {getItem(right, 'right')}
          </div>
        </>
      )
    }
    // 左右两栏布局
    if (!center && right && left) {
      return (
        <>
          <div className="flex flex-col justify-center" style={left.style}>
            {getItem(left, 'left')}
          </div>
          <div className="flex flex-col items-end overflow-hidden" style={right.style}>
            {getItem(right, 'right')}
          </div>
        </>
      )
    }
  }, [left, right, center])

  if (renderItem) {
    return (
      <div className="pt-[10px] flex" style={style}>
        {renderItem?.()}
      </div>
    )
  }
  return (
    <div className="pt-[10px] flex justify-between items-center" style={style}>
      {renderCardItem}
    </div>
  )
}
