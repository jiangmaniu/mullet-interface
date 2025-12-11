import { cn } from '@/utils/cn'
import { ComponentProps } from 'react'

type ImagesProps = ComponentProps<'img'> & { width: number; height: number }
export const Image = ({ className, width, height, ...props }: ImagesProps) => {
  return <img className={cn('', className)} width={width} height={height} {...props} />
}
