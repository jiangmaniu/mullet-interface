'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@/libs/ui/lib/utils'
import { Select, SelectContent, SelectTrigger, SelectValue } from './select'
import { Iconify } from './icons/iconify'

interface SelectLabelTriggerProps extends React.ComponentProps<typeof SelectTrigger> {
  label?: string | React.ReactNode
}

export const RichSelectTrigger = React.forwardRef<React.ElementRef<typeof SelectTrigger>, SelectLabelTriggerProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <SelectTrigger
        ref={ref}
        className={cn(
          'group relative', // Layout for floating label
          className
        )}
        {...props}
      >
        {children}
        {label && (
          <label
            className={cn(
              'text-paragraph-p2 text-content-5 pointer-events-none absolute left-3 transition-all duration-200 ease-out',
              'top-1/2 -translate-y-1/2 origin-left', // Default center
              // Trigger states for floating
              'bg-background px-1', // Add background and padding for masking
              'group-data-[state=open]:!top-0 group-data-[state=open]:-translate-y-1/2 group-data-[state=open]:scale-75 group-data-[state=open]:!text-paragraph-p3 group-data-[state=open]:!text-content-5',
              // Float if not placeholder (has value)
              'group-[&:not([data-placeholder])]:!top-0 group-[&:not([data-placeholder])]:-translate-y-1/2 group-[&:not([data-placeholder])]:scale-75'
            )}
          >
            {label}
          </label>
        )}
      </SelectTrigger>
    )
  }
)
RichSelectTrigger.displayName = 'RichSelectTrigger'

export const RichSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "focus:bg-primary focus:text-content-1 transition-all [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 px-xl text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      'data-[state=checked]:bg-button',
      className
    )}
    {...props}
  >
    <div className="w-full">{children}</div>
  </SelectPrimitive.Item>
))
RichSelectItem.displayName = 'RichSelectItem'

export const RichSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'item-aligned', align = 'center', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        ' data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto ',
        'border border-brand-default bg-pop-up-mask backdrop-blur-base rounded-large',

        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      align={align}
      {...props}
    >
      <SelectPrimitive.SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'py-small',
          position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

RichSelectContent.displayName = 'RichSelectContent'
