import classNames from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'

import { useEnv } from '@/context/envProvider'
import { useTheme } from '@/context/themeProvider'
import { bgColorBase, gray } from '@/theme/theme.config'

type IProps = {
  children?: React.ReactNode
  isActive?: boolean
  bgColor?: string
  width?: string
  height?: string
}

function Sell({ children, isActive, bgColor, width = '134px', height = '52px' }: IProps) {
  const { isPc, isMobileOrIpad } = useEnv()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const svgIcon = (
    <svg width={'134px'} height={'52px'} viewBox="0 0 134 52">
      <g id="sell" stroke="none" strokeWidth="1" fillRule="evenodd">
        <path
          d="M10.4917494,0 L128,0 C132.418278,-8.11624501e-16 136,3.581722 136,8 L136,44 C136,48.418278 132.418278,52 128,52 L20.3731149,52 C16.7703581,52 13.6120739,49.5917959 12.6584517,46.1175391 L2.77708615,10.1175391 C1.60760162,5.85684824 4.11351944,1.45482134 8.37421028,0.285336802 C9.06412267,0.0959680096 9.77631966,-7.56756117e-16 10.4917494,0 Z"
          fill={isActive ? bgColor || 'var(--color-red)' : isDark ? gray['720'] : bgColorBase}
          transform="translate(68.000000, 26.000000) scale(-1, -1) translate(-68.000000, -26.000000) "
        ></path>
      </g>
    </svg>
  )

  return (
    <div className="relative flex items-center">
      <div
        className={classNames('relative right-[11px] z-30 h-[52px] w-[134px] rounded-lg', {
          'rounded-br-none border-b border-l border-t border-[rgba(197,71,71,0.2)]': isMobileOrIpad && isActive
        })}
        style={{ background: isPc ? '' : isActive ? bgColor || 'var(--color-red-600)' : bgColorBase, width }}
      >
        {children}
      </div>
      <div className="absolute right-0 top-0">{svgIcon}</div>
    </div>
  )
}

export default observer(Sell)
