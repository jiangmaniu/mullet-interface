import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { gray, yellow } from '@/theme/theme.config'

import Iconfont, { IconProps } from '../../Base/Iconfont'

type IProps = {
  symbol: string
} & Omit<IconProps, 'name'>

// 收藏图标
function FavoriteIcon({ symbol, ...res }: IProps) {
  const { trade } = useStores()
  const { isDark } = useTheme()
  const isActive = trade.favoriteList.some((item) => item.symbol === symbol)
  const color = isDark ? gray['670'] : gray['200']
  const activeColor = isDark ? yellow['400'] : yellow['490']

  return (
    <div className="h-[30px] w-[30px] cursor-pointer">
      <Iconfont name="shoucang" width={30} height={30} color={isActive ? activeColor : color} {...res} />
    </div>
  )
}

export default observer(FavoriteIcon)
