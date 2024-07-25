import Tags from '@/components/Admin/Tags'

export const AccountTag = ({ type }: { type: string }) => {
  return <Tags color={type} format={{ id: `mt.${type}` }} />
}
