import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// HTML 元素的类名书写顺序并不影响类的优先级，类的优先级取决于样式文件中出现的先后顺序，越晚出现，优先级越高
// tailwind-merge 根据类名先后顺序做了优先级处理
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
