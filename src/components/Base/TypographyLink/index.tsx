import { Typography } from 'antd'
import React from 'react'

interface IProps {
  children: React.ReactNode
  color?: string
  onClick?: () => void
}
export default function LinkColor({ children, color, onClick }: IProps) {
  return (
    <Typography.Link style={{ color: color || '#17A83C', fontWeight: 600 }} onClick={onClick}>
      {children}
    </Typography.Link>
  )
}
