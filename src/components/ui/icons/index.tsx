import { type LucideIcon } from 'lucide-react'

import { LogoIcons } from './logo'
import { LucideIcons } from './lucide-icons'
import { MBIcons } from './mars-betta'
import type { SvgIcon } from './svg-icon'

export type Icon = typeof SvgIcon | LucideIcon

export const Icons = {
  mb: MBIcons,
  lucide: LucideIcons,
  logo: LogoIcons
}
