import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { STORAGE_SET_TRADE_THEME } from '@/utils/storage'

import Iconfont from '../Base/Iconfont'

// 主题切换
function SwitchTheme() {
  const { kline } = useStores()
  const { setMode, theme } = useTheme()
  const { isDark } = theme
  const [loading, setLoading] = useState(true) // 延迟加载，避免主题色切换闪烁

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  if (loading) return

  const handleSwitchTheme = () => {
    const themeMode = isDark ? 'light' : 'dark'
    setMode(themeMode)
    // 设置交易页面主题，因为交易页面主题不是全局的，所以需要单独设置
    STORAGE_SET_TRADE_THEME(themeMode)

    // 重置tradingview实例
    kline.destroyed()
  }

  return (
    <>
      {isDark && (
        <div
          className="py-[4px] px-[5px] w-[62px] rounded-[18px] cursor-pointer flex justify-between items-center mr-5 bg-gray-700"
          onClick={handleSwitchTheme}
        >
          <div className="w-5 h-5 rounded-full p-1 flex items-center justify-center bg-[#7F53FE]">
            <Iconfont name={'yueliang'} width={14} height={14} color={'#fff'} />
          </div>
          <div className="size-[22px] rounded-full p-1 flex items-center justify-center bg-gray-secondary">
            <Iconfont name={'rijianmoshi-'} width={14} height={14} color={'#6B6B6B'} />
          </div>
        </div>
      )}

      {!isDark && (
        <div
          className="py-[4px] px-[5px] w-[62px] rounded-[18px] cursor-pointer flex justify-between items-center mr-5 bg-gray-50 border border-gray-150"
          onClick={handleSwitchTheme}
        >
          <div className="w-6 h-6 rounded-full p-1 flex items-center justify-center">
            <Iconfont name={'yueliang'} width={14} height={14} color={'#E3E3E3'} />
          </div>
          <div className="size-[22px] rounded-full p-1 flex items-center justify-center bg-[#FEA353]">
            <Iconfont name={'rijianmoshi-'} width={16} height={16} color={'#fff'} />
          </div>
        </div>
      )}
    </>
  )
}

export default observer(SwitchTheme)
