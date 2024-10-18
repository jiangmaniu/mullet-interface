type IProps = {
  color?: string
  style?: React.CSSProperties
}
export default function SelectIcon({ style, color = 'var(--color-text-primary)' }: IProps) {
  return (
    <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" style={style}>
      <g id="交易" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="归类收展" transform="translate(-161.000000, -855.000000)">
          <g id="编组-49" transform="translate(161.000000, 855.000000)">
            <rect id="矩形" x="0" y="0" width="18" height="18"></rect>
            <polygon
              id="路径"
              fill={color}
              fillRule="nonzero"
              transform="translate(9.000000, 7.280330) rotate(-45.000000) translate(-9.000000, -7.280330) "
              points="7.125 3.90533009 7.125 9.15533009 12.375 9.15533009 12.375 10.6553301 5.625 10.6553301 5.625 3.90533009"
            ></polygon>
          </g>
        </g>
      </g>
    </svg>
  )
}
