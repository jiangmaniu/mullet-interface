import { SvgIconProps } from '../svg-icon'

export const IconFail = ({ width, height, viewBox, ...props }: SvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? 24}
      height={width ?? 24}
      viewBox={viewBox ?? '0 0 24 24'}
      fill="none"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#FF445D" fillOpacity="0.15" />
      <path
        d="M15.932 7.18325C16.1764 6.93901 16.5726 6.9389 16.8169 7.18325C17.061 7.42758 17.061 7.82375 16.8169 8.06807L12.8841 11.9992L16.8169 15.932C17.061 16.1764 17.0611 16.5726 16.8169 16.8169C16.5726 17.0611 16.1764 17.061 15.932 16.8169L12.0001 12.8849L8.06807 16.8169C7.82374 17.061 7.42758 17.061 7.18325 16.8169C6.93893 16.5725 6.93903 16.1764 7.18325 15.932L11.1144 12.0001L7.18325 8.06807C6.93893 7.8237 6.93891 7.42759 7.18325 7.18325C7.42762 6.93893 7.82373 6.93891 8.06807 7.18325L11.9992 11.1152L15.932 7.18325Z"
        fill="#FF445D"
        stroke="#FF445D"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
