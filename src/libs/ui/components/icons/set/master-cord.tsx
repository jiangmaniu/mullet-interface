import { SvgIconProps } from '../svg-icon'

export const IconMasterCord = ({ width, height, viewBox, ...props }: SvgIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width ?? 24} height={height ?? 14} viewBox="0 0 24 14" fill="none" {...props}>
      <circle cx="6.85714" cy="6.85714" r="6.85714" fill="#EB001B" />
      <circle cx="17.1429" cy="6.85714" r="6.85714" fill="#F79E1B" />
      <path
        d="M11.9996 2.32361C13.0659 3.53221 13.7143 5.11838 13.7144 6.85681C13.7144 8.5952 13.0658 10.1814 11.9996 11.39C10.9336 10.1814 10.2857 8.595 10.2857 6.85681C10.2858 5.11857 10.9335 3.53215 11.9996 2.32361Z"
        fill="#FF5F00"
      />
    </svg>
  )
}
