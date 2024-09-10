import Tags from '@/components/Admin/Tags'

export const AccountTag = ({
  type,
  children,
  size = 'medium',
  color,
  code
}: {
  type?: string
  children?: React.ReactNode
  color?: string // 'green' | 'biaozhun' | 'luodian' | 'meifen'
  size?: 'tiny' | 'small' | 'medium' | 'auto'
  code?: string
}) => {
  const format = type ? { id: `mt.${type}` } : undefined

  return (
    <Tags color={color} code={code} format={format} size={size}>
      {children}
    </Tags>
  )
}
