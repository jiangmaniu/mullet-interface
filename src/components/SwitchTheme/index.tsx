import { observer } from 'mobx-react'

import { useTheme } from '@/context/themeProvider'
import { cn } from '@/utils/cn'
import { STORAGE_SET_TRADE_THEME } from '@/utils/storage'

import Iconfont from '../Base/Iconfont'

// 主题切换
function SwitchTheme() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'py-[5px] px-[5px] w-[48px] rounded-[18px] cursor-pointer flex items-center mr-5',
        isDark ? 'bg-gray-700 justify-end' : 'bg-gray-150 justify-start border border-gray-200'
      )}
      onClick={() => {
        const themeMode = isDark ? 'light' : 'dark'
        setTheme(themeMode)
        // 设置交易页面主题，因为交易页面主题不是全局的，所以需要单独设置
        STORAGE_SET_TRADE_THEME(themeMode)
      }}
    >
      <div className={cn('w-[17px] h-[17px] rounded-full p-1 flex items-center justify-center', isDark ? 'bg-gray-secondary' : 'bg-white')}>
        <Iconfont name={isDark ? 'yueliang' : 'rijianmoshi-'} width={14} height={14} color={isDark ? '#fff' : '#6B6B6B'} />
      </div>
    </div>
  )
}

export default observer(SwitchTheme)
