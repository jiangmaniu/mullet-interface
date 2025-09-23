// 'use client'

import { isUndefined } from 'lodash-es'
import { useState } from 'react'

import { cn } from '@/utils/cn'

import { Button, ButtonProps } from '../ui/button'
import { Icons } from '../ui/icons'
import { toast } from '../ui/toast'

export type TextCopyButtonProps = ButtonProps & {
  text: string
}

export const TextCopyButton = ({ text, className, ...props }: TextCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('bg-transparent', { 'pointer-events-none': isCopied }, className)}
      onClick={async () => {
        if (!isUndefined(text)) {
          try {
            await navigator.clipboard.writeText(text)

            setIsCopied(true)

            toast.success('Copy Successful!')
          } catch (error) {
            console.log(error)

            toast.error('Copy Failed!')
          } finally {
            setTimeout(() => {
              setIsCopied(false)
            }, 1500)
          }
        }
      }}
      {...props}
    >
      <div className="size-4">{isCopied ? <Icons.lucide.Check className="size-4 text-success" /> : <Icons.lucide.Copy size={16} />}</div>
    </Button>
  )
}
