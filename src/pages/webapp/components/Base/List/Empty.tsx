import React, { isValidElement } from 'react'

import { useTheme } from '@/context/themeProvider'
import { getIntl } from '@umijs/max'

export interface Iprops {
  image?: string
  text?: React.ReactNode
  style?: React.CSSProperties
  imageStyle?: React.CSSProperties
}

const Empty: React.FC<Iprops> = ({ image, text, style = {}, imageStyle = {} }: Iprops) => {
  const { theme } = useTheme()
  return (
    <div className="flex items-center justify-center flex-col" style={{ paddingTop: 30, ...style }}>
      <img src={image || '/img/icon-zanwucangwei.png'} style={{ width: 120, height: 120, ...imageStyle }} />
      {isValidElement(text) ? (
        text
      ) : (
        <div style={{ color: theme.colors.textColor.weak, fontSize: 12 }}>{text || getIntl().formatMessage({ id: 'common.NO Data' })}</div>
      )}
    </div>
  )
}

export default Empty
