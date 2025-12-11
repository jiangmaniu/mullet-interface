import { ComponentProps } from 'react'
import { Link as RouterLink } from '@umijs/max'

type LinkProps = ComponentProps<'a'>
export const Link = ({ children, href, ...props }: LinkProps) => {
  return (
    <RouterLink to={href ?? ''} {...props}>
      {children}
    </RouterLink>
  )
}

export default Link
