type IProps = {
  color?: string
}

export default function SignalIcon({ color = '#6A7073' }: IProps) {
  return (
    <svg className="h-[10px] w-[18px]" viewBox="0 0 1294 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      <path d="M0 727.578947l188.631579 0 0 296.421053-188.631579 0 0-296.421053Z" fill={color}></path>
      <path d="M269.473684 565.894737l188.631579 0 0 458.105263-188.631579 0 0-458.105263Z" fill={color}></path>
      <path d="M565.894737 377.263158l161.684211 0 0 646.736842-161.684211 0 0-646.736842Z" fill={color}></path>
      <path d="M835.368421 188.631579l188.631579 0 0 835.368421-188.631579 0 0-835.368421Z" fill={color}></path>
      <path d="M1104.842105 0l188.631579 0 0 1024-188.631579 0 0-1024Z" fill={color}></path>
    </svg>
  )
}
