import { observer } from 'mobx-react'

import Iconfont from '@/components/Base/Iconfont'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'

import { yellow } from '../../theme/colors'

type IProps = {
  symbol?: string
}

// 收藏品种
function SymbolFavoriteIcon({ symbol }: IProps) {
  const { trade } = useStores()
  const { theme } = useTheme()
  const isDark = theme.isDark
  const { activeSymbolName } = trade
  const symbolName = symbol || activeSymbolName
  const isActive = trade.favoriteList.some((item) => item.symbol === symbolName)
  const color = isDark ? '#D8D8D8' : '#D8D8D8'
  const activeColor = isDark ? yellow['400'] : yellow['490']

  return (
    <div
      onClick={() => {
        trade.toggleSymbolFavorite(symbolName)
      }}
    >
      <Iconfont name="jiaoyi-shoucang" size={28} color={isActive ? activeColor : color} />
    </div>
  )
}

export default observer(SymbolFavoriteIcon)
