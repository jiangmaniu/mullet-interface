import { useEffect, useState } from 'react'

import { useLang } from '@/context/languageProvider'
import { gray } from '@/theme/theme.config'
import { cn } from '@/utils/cn'

type IProps = {
  onChange?: (key: string) => void
  items: {
    key: string
    label: React.ReactNode
  }[]
  activeKey?: string
  itemStyle?: React.CSSProperties
  activeBg?: string
}

export default function Tabs({ onChange, items, activeKey, itemStyle, activeBg }: IProps) {
  const [current, setCurrent] = useState('')
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'

  useEffect(() => {
    setCurrent(activeKey || items[0]?.key)
  }, [activeKey, items])

  return (
    <div className="flex rounded-[26px] border-[0.5px] border-[#dadada] p-[2px]">
      {items.map((item, idx) => {
        const isActive = item.key === current
        return (
          <div
            className={cn(
              'cursor-pointer py-[5px] hover:text-primary text-sm',
              isActive ? `rounded-[26px] text-primary` : 'text-secondary',
              isZh ? 'px-[26px]' : 'px-[7px]'
            )}
            onClick={() => {
              onChange?.(item.key)
              setCurrent(item.key)
            }}
            key={idx}
            style={{ background: isActive ? activeBg || gray['50'] : '', ...itemStyle }}
          >
            {item.label}
          </div>
        )
      })}
    </div>
  )
}
