import type { PropsWithChildren } from 'react'

export const Trans = ({ children }: PropsWithChildren) => {
  return <>{children}</>
}

export const t = (v: any) => v

export const useLingui = () => {
  const t = (...args: any) => {
    return args.join('')
  }
  return { t }
}
