import { getSymbolIcon } from '@/utils/business'
import { cn } from '@/utils/cn'

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
    <div
      className={cn('flex items-center justify-center border border-gray-90 rounded-full', className)}
      style={{ width, height, ...style }}
    >
      <img width={width} height={height} alt="" src={getSymbolIcon(src)} className="rounded-full" />
    </div>
  )
}
