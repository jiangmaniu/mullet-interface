import { SvgIconProps } from '../svg-icon'

export const IconSuccess = ({ width, height, viewBox, ...props }: SvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? 24}
      height={width ?? 24}
      viewBox={viewBox ?? '0 0 24 24'}
      fill="none"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#2EBC84" fillOpacity="0.15" />
      <path
        d="M17.661 6.91096C17.9173 6.65468 18.3327 6.65468 18.589 6.91096C18.8453 7.16724 18.8453 7.58266 18.589 7.83894L9.83899 16.5889C9.58271 16.8452 9.16729 16.8452 8.91101 16.5889L5.41101 13.0889C5.15473 12.8327 5.15473 12.4172 5.41101 12.161C5.66729 11.9047 6.08271 11.9047 6.33899 12.161L9.375 15.197L17.661 6.91096Z"
        fill="#2EBC84"
        stroke="#2EBC84"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
