import classNames from 'classnames'

import { getSymbolIcon } from '@/utils/business'

type IProps = {
  /**图片地址 */
  src: any
  /**图片宽度 */
  width?: number
  /**图片高度*/
  height?: number
  style?: React.CSSProperties
  className?: string
}

/**
 * 品种图标组件
 * @param param0
 * @returns
 */
export default function SymbolIcon({ src, width = 26, height = 26, style, className }: IProps) {
  return (
    <img
      width={width}
      height={height}
      alt=""
      src={getSymbolIcon(src)}
      className={classNames('rounded-full border border-gray-90', className)}
      style={style}
    />
  )
}
