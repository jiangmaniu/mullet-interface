import { useEmotionCss } from '@ant-design/use-emotion-css'
import classNames from 'classnames'

export type IconProps = {
  width?: number
  height?: number
  /**字体图标的名字 */
  name: string
  /**图标颜色 */
  color?: string
  /**鼠标hover的颜色 */
  hoverColor?: string
  hoverStyle?: React.CSSProperties
  onClick?: (event: any) => void
  className?: string
  style?: React.CSSProperties
}
function Iconfont({ name, width = 24, height = 24, color, hoverColor, hoverStyle, className, style, ...res }: IconProps) {
  const hoverClassName = useEmotionCss(({ token }) => {
    if (!hoverColor || !color) {
      return {
        '&:hover': {
          fill: `${hoverColor || !color} !important`,
          ...hoverStyle
        }
      }
    }
  })
  return (
    <svg
      className={classNames(`w-[1rem] h-[1rem] overflow-hidden align-[-0.15em]`, hoverClassName, className)}
      style={{ width, height, fill: color, ...style }}
      {...res}
    >
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
  )
}

export default Iconfont
