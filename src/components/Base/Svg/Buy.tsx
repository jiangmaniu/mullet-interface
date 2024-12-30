import { observer } from 'mobx-react'
import React from 'react'

import { useEnv } from '@/context/envProvider'
import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'

type IProps = {
  children?: React.ReactNode
  isActive?: boolean
  bgColor?: string
  width?: string
  height?: string
}

function Buy({ children, isActive, bgColor, width = '134px', height = '52px' }: IProps) {
  const { isPc } = useEnv()
  const { theme } = useTheme()
  const { isDark } = theme

  const svgIcon = (
    <svg width={'134px'} height={'52px'} viewBox="0 0 134 52">
      <g id="buy" stroke={isDark ? 'var(--border-primary-color)' : 'none'} strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M8.49174935,0 L126,0 C130.418278,-8.11624501e-16 134,3.581722 134,8 L134,44 C134,48.418278 130.418278,52 126,52 L18.3731149,52 C14.7703581,52 11.6120739,49.5917959 10.6584517,46.1175391 L0.777086155,10.1175391 C-0.392398385,5.85684824 2.11351944,1.45482134 6.37421028,0.285336802 C7.06412267,0.0959680096 7.77631966,-7.56756117e-16 8.49174935,0 Z"
          fill={isActive ? bgColor || 'var(--color-green)' : isDark ? gray['720'] : 'var(--bg-base-gray)'}
        ></path>
      </g>
    </svg>
  )

  return (
    <div className="relative flex items-center">
      <div
        className="relative left-[11px] z-30 h-[52px] w-[134px] rounded-lg"
        style={{ background: isPc ? '' : isActive ? bgColor || '#45A48A' : 'var(--bg-base-gray)', width }}
      >
        {children}
      </div>
      <div className="absolute left-0 top-0">{svgIcon}</div>
    </div>
  )
}

export default observer(Buy)
