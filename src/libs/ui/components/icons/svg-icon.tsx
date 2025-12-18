import { cn } from '@/libs/ui/lib/utils'

export type SvgIconProps = React.SVGAttributes<HTMLOrSVGElement>

export const SvgIcon = ({ children, className, viewBox, ...props }: SvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-[1em]', 'h-[1em]', 'fill-current', className)}
      viewBox={viewBox ?? '0 0 16 16'}
      {...props}
    >
      {children}
    </svg>
  )
}
