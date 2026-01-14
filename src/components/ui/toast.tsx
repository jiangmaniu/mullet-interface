// 'use client'

import { cn } from '@/utils/cn'
import { Toaster as Sonner, toast, ToasterProps } from 'sonner'
import { Iconify } from '@/libs/ui/components/icons'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            'bg-pop-up-mask w-[var(--width)] gap-2 flex items-start border border-brand-default rounded-small p-2xl backdrop-blur-base'
          ),
          title: cn('text-paragraph-p2 text-white leading-6'),
          description: cn('text-paragraph-p3 text-content-4'),
          content: cn('flex flex-col gap-2 flex-1'),
          closeButton: cn(
            'order-last text-brand-secondary-3 p-0.5 size-6 justify-center items-center flex leading-none rounded-full active:scale-95 transition-transform'
          ),
          success: cn('text-[#2EBC84]'),
          error: cn('text-[#FF453A]'),
          warning: cn('text-[#FFD60A]'),
          info: cn('text-[#2167ff]'),
          icon: cn('flex')
        },
        closeButton: true
      }}
      style={
        {
          '--width': '380px'
          // '--normal-bg': 'var(--popover)',
          // '--normal-text': 'var(--popover-foreground)',
          // '--normal-border': 'var(--border)'
        } as React.CSSProperties
      }
      icons={{
        close: <Iconify icon="iconoir:xmark" className="size-6" />,
        success: <Iconify icon="iconoir:check-circle-solid" className="size-6" />,
        error: <Iconify icon="iconoir:xmark-circle-solid" className="size-6" />,
        info: <Iconify icon="iconoir:info-circle-solid" className="size-6" />,
        warning: <Iconify icon="iconoir:info-circle-solid" className="size-6" />
      }}
      {...props}
    />
  )
}

export { toast, Toaster }
