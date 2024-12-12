import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Empty as EmptyComp } from 'antd'

import { useTheme } from '@/context/themeProvider'
import { cn } from '@/utils/cn'

type IProps = {
  /**文字 */
  description?: React.ReactNode
  src?: string
  className?: string
}
export default function Empty({ src, description, className }: IProps) {
  const { theme } = useTheme()
  const { isDark } = theme
  const innerClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-empty-image img': {
        opacity: isDark ? 0.3 : 1
      }
    }
  })
  return (
    <div className={cn(innerClassName, className)}>
      <EmptyComp image={src ?? '/img/empty-icon.png'} description={description ?? <FormattedMessage id="common.noData" />} />
    </div>
  )
}
