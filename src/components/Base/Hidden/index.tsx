type IProps = {
  show: boolean
  children: React.ReactNode
}

export default function Hidden({ show, children }: IProps) {
  return <div style={{ display: show ? 'block' : 'none' }}>{children}</div>
}
