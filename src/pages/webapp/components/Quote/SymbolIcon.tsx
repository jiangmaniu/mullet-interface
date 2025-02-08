import React from 'react'

import { useTheme } from '@/context/themeProvider'
import { getSymbolIcon } from '@/utils/business'

import { View } from '../Base/View'

type IProps = {
  src: any
  style?: React.CSSProperties
  width?: number
  height?: number
}

export default function SymbolIcon({ src, style, width = 24, height = 24 }: IProps) {
  const { cn, theme } = useTheme()
  return (
    <View className={cn('flex items-center justify-center border-[0.5px] border-gray-90 rounded-full relative')} style={{ width, height }}>
      <img loading="lazy" src={getSymbolIcon(src)} className={cn('rounded-full w-full h-full')} style={style} />
    </View>
  )
}
