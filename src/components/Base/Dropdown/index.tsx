import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Dropdown as AntdDropdown } from 'antd'
import type { DropDownProps } from 'antd/es/dropdown'
import classNames from 'classnames'
import React from 'react'

type DropdownProps = {
  overlayClassName?: string
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter'
} & Omit<DropDownProps, 'overlay'>

const Dropdown: React.FC<DropdownProps> = ({ overlayClassName: cls, ...restProps }) => {
  const className = useEmotionCss(({ token }) => {
    return {
      [`@media screen and (max-width: ${token.screenXS})`]: {
        width: '100%'
      }
    }
  })
  return <AntdDropdown overlayClassName={classNames(className, cls)} {...restProps} />
}

export default Dropdown
