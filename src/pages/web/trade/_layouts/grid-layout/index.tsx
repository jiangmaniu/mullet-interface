'use client'

import { useEffect, useRef, useState } from 'react'
import { Responsive, ResponsiveLayouts, useContainerWidth } from 'react-grid-layout'

import {
  FIXED_HEIGHTS_ACCOUNT,
  FIXED_HEIGHTS_ACTION,
  FIXED_HEIGHTS_MARGIN_RATE,
  FIXED_HEIGHTS_ORDERBOOKS,
  FIXED_HEIGHTS_OVERVIEW,
  FIXED_HEIGHTS_POSITION,
  FIXED_HEIGHTS_TAB,
  FIXED_HEIGHTS_TRADINGVIEW
} from './height-config'
import { TradeLayoutKey, TradeLayoutSlots } from './types'

// import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './styles.css'
import { cn } from '@/libs/ui/lib/utils'

// 可关闭的模块配置
const CLOSABLE_MODULES: Set<string> = new Set([
  TradeLayoutKey.Orderbooks,
  TradeLayoutKey.MarginRate,
  TradeLayoutKey.Tradingview,
  TradeLayoutKey.Account
])

interface TradeLayoutProps {
  slots: TradeLayoutSlots
}

// 本地存储 key
const LAYOUT_CACHE_KEY = 'trade-layout-cache-v1'
const HIDDEN_MODULES_CACHE_KEY = 'trade-hidden-modules-v1'
const LAYOUT_RESET_EVENT = 'trade-layout-reset'

// 生成默认布局配置
const getInitialLayout = (): ResponsiveLayouts => {
  const smTradingviewHeight = FIXED_HEIGHTS_ACTION.lg - 250
  const xsTradingviewHeight = 350

  return {
    lg: [
      { i: TradeLayoutKey.Tabs, x: 0, y: 0, w: 100, h: FIXED_HEIGHTS_TAB.lg },
      { i: TradeLayoutKey.Overview, x: 0, y: FIXED_HEIGHTS_TAB.lg, w: 100, h: FIXED_HEIGHTS_OVERVIEW.lg },
      {
        i: TradeLayoutKey.Tradingview,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg,
        w: 60,
        h: FIXED_HEIGHTS_ACTION.lg + FIXED_HEIGHTS_ACCOUNT.lg
      },
      {
        i: TradeLayoutKey.Position,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + FIXED_HEIGHTS_TRADINGVIEW.lg,
        w: 80,
        h: FIXED_HEIGHTS_POSITION.lg
      },
      {
        i: TradeLayoutKey.Orderbooks,
        x: 60,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg,
        w: 20,
        h: FIXED_HEIGHTS_ACTION.lg + FIXED_HEIGHTS_ACCOUNT.lg
      },
      {
        i: TradeLayoutKey.Account,
        x: 100,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg,
        w: 20,
        h: FIXED_HEIGHTS_ACCOUNT.lg
      },
      {
        i: TradeLayoutKey.Action,
        x: 100,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + FIXED_HEIGHTS_ACCOUNT.lg,
        w: 20,
        h: FIXED_HEIGHTS_ACTION.lg
      },
      {
        i: TradeLayoutKey.MarginRate,
        x: 100,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + FIXED_HEIGHTS_ACCOUNT.lg + FIXED_HEIGHTS_ACTION.lg,
        w: 20,
        h: FIXED_HEIGHTS_MARGIN_RATE.lg
      }
    ],
    md: [
      { i: TradeLayoutKey.Tabs, x: 0, y: 0, w: 80, h: FIXED_HEIGHTS_TAB.lg },
      { i: TradeLayoutKey.Overview, x: 0, y: FIXED_HEIGHTS_TAB.lg, w: 80, h: FIXED_HEIGHTS_OVERVIEW.lg },
      {
        i: TradeLayoutKey.Tradingview,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg,
        w: 60,
        h: FIXED_HEIGHTS_ACTION.lg + FIXED_HEIGHTS_ACCOUNT.lg
      },
      {
        i: TradeLayoutKey.Position,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + FIXED_HEIGHTS_TRADINGVIEW.lg,
        w: 80,
        h: FIXED_HEIGHTS_POSITION.lg
      },
      {
        i: TradeLayoutKey.Orderbooks,
        x: 60,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg,
        w: 20,
        h: FIXED_HEIGHTS_ACTION.lg + FIXED_HEIGHTS_ACCOUNT.lg
      },
      { i: TradeLayoutKey.Account, x: 80, y: 0, w: 20, h: FIXED_HEIGHTS_ACCOUNT.lg },
      {
        i: TradeLayoutKey.Action,
        x: 80,
        y: FIXED_HEIGHTS_ACCOUNT.lg,
        w: 20,
        h: FIXED_HEIGHTS_ACTION.lg + FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg
      },
      {
        i: TradeLayoutKey.MarginRate,
        x: 80,
        y: FIXED_HEIGHTS_ACCOUNT.lg + FIXED_HEIGHTS_ACTION.lg,
        w: 20,
        h: FIXED_HEIGHTS_MARGIN_RATE.lg
      }
    ],
    sm: [
      { i: TradeLayoutKey.Tabs, x: 0, y: 0, w: 100, h: FIXED_HEIGHTS_TAB.lg },
      { i: TradeLayoutKey.Overview, x: 0, y: FIXED_HEIGHTS_TAB.lg, w: 100, h: FIXED_HEIGHTS_OVERVIEW.lg },
      {
        i: TradeLayoutKey.Tradingview,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg,
        w: 75,
        h: smTradingviewHeight
      },
      {
        i: TradeLayoutKey.Position,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + FIXED_HEIGHTS_TRADINGVIEW.lg,
        w: 100,
        h: FIXED_HEIGHTS_POSITION.lg
      },
      {
        i: TradeLayoutKey.Orderbooks,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + smTradingviewHeight,
        w: 25,
        h: 250
      },
      {
        i: TradeLayoutKey.Account,
        x: 50,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_TAB.lg + smTradingviewHeight,
        w: 25,
        h: 250
      },
      { i: TradeLayoutKey.Action, x: 75, y: FIXED_HEIGHTS_ACCOUNT.lg, w: 25, h: FIXED_HEIGHTS_ACTION.lg },
      {
        i: TradeLayoutKey.MarginRate,
        x: 25,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + smTradingviewHeight,
        w: 25,
        h: 250
      }
    ],
    xs: [
      { i: TradeLayoutKey.Tabs, x: 0, y: 0, w: 100, h: FIXED_HEIGHTS_TAB.lg },
      { i: TradeLayoutKey.Overview, x: 0, y: FIXED_HEIGHTS_TAB.lg, w: 100, h: FIXED_HEIGHTS_OVERVIEW.lg },
      {
        i: TradeLayoutKey.Tradingview,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg,
        w: 100,
        h: xsTradingviewHeight
      },
      {
        i: TradeLayoutKey.Orderbooks,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + smTradingviewHeight,
        w: 30,
        h: 650
      },
      {
        i: TradeLayoutKey.Position,
        x: 0,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + FIXED_HEIGHTS_TRADINGVIEW.lg + 500,
        w: 100,
        h: FIXED_HEIGHTS_POSITION.lg
      },
      {
        i: TradeLayoutKey.Account,
        x: 30,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_TAB.lg + smTradingviewHeight,
        w: 30,
        h: 250
      },
      {
        i: TradeLayoutKey.Action,
        x: 60,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_TAB.lg + smTradingviewHeight,
        w: 40,
        h: 650
      },
      {
        i: TradeLayoutKey.MarginRate,
        x: 30,
        y: FIXED_HEIGHTS_TAB.lg + FIXED_HEIGHTS_OVERVIEW.lg + smTradingviewHeight + 250,
        w: 30,
        h: 650 - 250
      }
    ]
  }
}

// 重置布局缓存并触发组件更新
export const resetLayoutCache = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(LAYOUT_CACHE_KEY)
    localStorage.removeItem(HIDDEN_MODULES_CACHE_KEY)
    // 触发自定义事件通知组件重置
    window.dispatchEvent(new CustomEvent(LAYOUT_RESET_EVENT))
  } catch (e) {
    console.warn('Failed to reset layout cache:', e)
  }
}

// 从本地存储读取隐藏模块
const getHiddenModulesFromCache = (): Set<string> => {
  if (typeof window === 'undefined') return new Set()
  try {
    const cached = localStorage.getItem(HIDDEN_MODULES_CACHE_KEY)
    if (cached) {
      const data = JSON.parse(cached)
      if (Array.isArray(data)) {
        return new Set(data)
      }
    }
  } catch (e) {
    console.warn('Failed to load hidden modules from cache:', e)
  }
  return new Set()
}

// 保存隐藏模块到本地存储
const saveHiddenModulesToCache = (hiddenModules: Set<string>) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(HIDDEN_MODULES_CACHE_KEY, JSON.stringify(Array.from(hiddenModules)))
  } catch (e) {
    console.warn('Failed to save hidden modules to cache:', e)
  }
}

// 从本地存储读取布局配置
const getLayoutFromCache = () => {
  if (typeof window === 'undefined') return null
  try {
    const cached = localStorage.getItem(LAYOUT_CACHE_KEY)
    if (cached) {
      const data = JSON.parse(cached)
      // 验证数据有效性
      if (data.layouts && data.containerWidth && data.containerHeight) {
        return data
      }
    }
  } catch (e) {
    console.warn('Failed to load layout from cache:', e)
  }
  return null
}

// 保存布局配置到本地存储
const saveLayoutToCache = (layouts: ResponsiveLayouts, containerWidth: number, containerHeight: number) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      LAYOUT_CACHE_KEY,
      JSON.stringify({
        layouts,
        containerWidth,
        containerHeight,
        timestamp: Date.now()
      })
    )
  } catch (e) {
    console.warn('Failed to save layout to cache:', e)
  }
}

export const TradeLayout = ({ slots }: TradeLayoutProps) => {
  const hasValidCacheWidth = useRef(null)
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(() => {
    // 尝试从缓存读取
    const cached = getLayoutFromCache()
    if (cached) {
      hasValidCacheWidth.current = cached.containerWidth
      return cached.layouts
    }
    return getInitialLayout()
  })

  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
    initialWidth: hasValidCacheWidth.current || 1440
  })

  const [layoutClassName, setLayoutClassName] = useState('')
  const [hiddenModules, setHiddenModules] = useState<Set<string>>(() => getHiddenModulesFromCache())

  const handleCloseModule = (key: string) => {
    setHiddenModules((prev) => {
      const newSet = new Set(prev).add(key)
      saveHiddenModulesToCache(newSet)
      return newSet
    })
  }

  // 监听布局重置事件
  useEffect(() => {
    const handleReset = () => {
      setLayouts(getInitialLayout())
      setHiddenModules(new Set())
    }
    window.addEventListener(LAYOUT_RESET_EVENT, handleReset)
    return () => window.removeEventListener(LAYOUT_RESET_EVENT, handleReset)
  }, [])

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => setLayoutClassName(cn('react-grid-layout-animated')), 1)
      return () => clearTimeout(timer)
    }
  }, [mounted])

  return (
    <div
      ref={containerRef as any}
      // className="w-full"
    >
      {mounted && (
        <Responsive
          className={cn(layoutClassName)}
          layouts={layouts}
          breakpoints={{ lg: 1930, md: 1200, sm: 968, xs: 768, xxs: 0 }}
          cols={{ lg: 100, md: 100, sm: 100, xs: 100, xxs: 10 }}
          width={width}
          margin={[0, 0]}
          containerPadding={[4, 4]}
          rowHeight={1}
          dragConfig={{
            enabled: true,
            handle: '.drag-handle'
          }}
          onLayoutChange={(_, allLayouts) => {
            setLayouts(allLayouts)
            // 布局变化时更新缓存
            if (containerRef.current) {
              saveLayoutToCache(allLayouts, width, containerRef.current?.clientHeight || 0)
            }
          }}
        >
          {Object.entries(slots)
            .filter(([key]) => !hiddenModules.has(key))
            .map(([key, content]) => (
              <div key={key} className="group/layout-item relative p-1">
                <div className="drag-handle absolute top-0 left-0 right-0 h-2.5 cursor-grab active:cursor-grabbing z-50" />
                {CLOSABLE_MODULES.has(key) && (
                  <button
                    onClick={() => handleCloseModule(key)}
                    className="absolute top-2 right-2 z-50 w-5 h-5 flex items-center justify-center rounded text-white/30 hover:text-white/80 hover:bg-white/10 transition-all opacity-0 group-hover/layout-item:opacity-100"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 2l8 8M10 2l-8 8" />
                    </svg>
                  </button>
                )}
                {content}
              </div>
            ))}
        </Responsive>
      )}
    </div>
  )
}
