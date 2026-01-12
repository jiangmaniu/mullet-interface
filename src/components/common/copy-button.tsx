'use client'

import { t, Trans } from '@/libs/lingui/react/macro'
import { useState } from 'react'
import { isUndefined } from 'lodash-es'

import { toast } from '@/libs/ui/components/toast'
import { Iconify } from '@/libs/ui/components/icons'
import { GeneralTooltip } from '../tooltip'
import { IconButton, IconButtonProps } from '@/libs/ui/components/button'
import { cn } from '@/libs/ui/lib/utils'

export type CopyButtonProps = IconButtonProps & {
  text?: string
}

export const CopyButton = ({ text, className, ...props }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)

  if (!text) {
    return null
  }

  return (
    <GeneralTooltip isDisabledCursorHelp side="top" content={<Trans>Copy address</Trans>} triggerClassName="inline-flex items-center">
      <IconButton
        size="icon-sm"
        variant="ghost"
        className={cn(
          `size-6 transition-transform duration-200 ${
            isCopied ? 'scale-110 text-status-success' : 'text-brand-secondary-3 hover:text-brand-secondary-1'
          }`,
          { 'pointer-events-none': isCopied },
          className
        )}
        onClick={async () => {
          if (!isUndefined(text)) {
            try {
              await navigator.clipboard.writeText(text)

              setIsCopied(true)

              toast.success(t`Copy Successful!`)
            } catch (error) {
              console.log(error)

              toast.error(t`Copy Failed!`)
            } finally {
              setTimeout(() => {
                setIsCopied(false)
              }, 1500)
            }
          }
        }}
        {...props}
      >
        {isCopied ? (
          <Iconify icon="iconoir:check" className="size-full text-status-success" />
        ) : (
          <Iconify icon="iconoir:copy" className="size-full" />
        )}
      </IconButton>
    </GeneralTooltip>
  )
}
