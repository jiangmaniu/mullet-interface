import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
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
  /**交易品种名称 */
  symbol?: string
  /**是否展示休市图标 */
  showMarketCloseIcon?: boolean
  /**休市中图标样式 */
  closeIconStyle?: React.CSSProperties
}

/**
 * 品种图标组件
 * @param param0
 * @returns
 */
function SymbolIcon({ src, width = 26, height = 26, style, className, symbol, showMarketCloseIcon, closeIconStyle }: IProps) {
  const { trade } = useStores()
  const isMarketOpen = trade.isMarketOpen(symbol)

  return (
    <div
      className={cn('flex items-center justify-center border border-gray-90 rounded-full relative', className)}
      style={{ width, height, ...style }}
    >
      <img width={width} height={height} alt="" src={getSymbolIcon(src)} className="rounded-full" />
      {!isMarketOpen && showMarketCloseIcon && (
        <div className="absolute bottom-[-6px] right-[-3px] z-[1]">
          <img src="/img/xiushi-icon.svg" width={14} height={14} style={closeIconStyle} />
        </div>
      )}
    </div>
  )
}

export default observer(SymbolIcon)
