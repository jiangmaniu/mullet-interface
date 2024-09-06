import Tags from '@/components/Admin/Tags'

export const AccountTag = ({
  type,
  children,
  size = 'medium',
  color
}: {
  type?: string
  children?: React.ReactNode
  color?: string // 'green' | 'biaozhun' | 'luodian' | 'meifen'
  size?: 'tiny' | 'small' | 'medium' | 'auto'
}) => {
  const format = type ? { id: `mt.${type}` } : undefined

  return (
    <Tags color={color} format={format} size={size}>
      {children}
    </Tags>
  )
}
