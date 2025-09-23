import { cn } from '@/utils/cn'
import { push } from '@/utils/navigator'
import { Slot, Slottable } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { Icons } from './icons'

const buttonVariants = cva(
  [
    'inline-flex items-center gap-1 justify-center transition-[colors_transform] text-[14px] whitespace-nowrap font-medium ring-offset-background ',
    'active:scale-95',
    'focus-visible:outline-focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    `data-[disabled='true']:cursor-not-allowed data-[disabled='true']:opacity-35`
  ],
  {
    variants: {
      variant: {
        primary: [
          'text-[#0A0C27] bg-[#EED94C]',
          'hover:bg-[#FDFF84] hover:outline-none hover:ring-3 hover:ring-[#FDFF84]',
          'focus-visible:bg-[#FDFF84] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#FDFF84]'
        ],

        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-[#3B3D52] text-white bg-transparent hover:bg-[#181E5A]',
        secondary: [
          'border border-[#0A0C27] bg-[#0A0C27] ',
          'hover:bg-[#FDFF84] hover:outline-none hover:ring-3 hover:ring-[#FDFF84]',
          'focus-visible:bg-[#FDFF84] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#FDFF84]'
        ],
        ghost: 'hover:bg-[#FDFF84] bg-transparent text-[#EED94C] hover:text-[#0A0C27]',
        // link: 'relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300',
        link: ['text-[#EED94C]! font-semibold leading-none text-xs', 'hover:bg-[#FDFF84]', 'hover:text-interactive-link-focus']
      },
      size: {
        middle: 'min-h-8 py-3xs px-s box-border rounded-small leading-6 font-semibold',
        middle2: 'min-h-10 min-w-[130px] py-2.5 px-5 box-border rounded-[8px]',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'p-1 rounded-[4px]',
        large: 'p-4 rounded-2xl text-lg',
        submit: 'py-4 text-lg leading-[30px]'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'middle2'
    }
  }
)

interface IconProps {
  LeftIcon?: React.ReactNode
  RightIcon?: React.ReactNode
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  block?: boolean

  href?: string
  target?: React.HTMLAttributeAnchorTarget | undefined
  replace?: boolean | undefined
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & IconProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      block = false,
      children,
      LeftIcon,
      RightIcon,

      disabled = false,

      type = 'button',
      href,
      // target,
      // replace,

      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const Button = (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className: cn(
              {
                'flex w-full flex-1': block
              },
              className
            )
          })
        )}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        {...props}
      >
        {(LeftIcon || loading) && <>{LeftIcon ? LeftIcon : loading ? <Icons.lucide.Spinner className="size-4 animate-spin" /> : null}</>}
        <Slottable>{children}</Slottable>
        {RightIcon && <>{RightIcon}</>}
      </Comp>
    )

    if (href && !disabled) {
      return (
        <LinkButton
          href={href}
          block={block}
          // target={target}
          // replace={replace}
          className={className}
          variant={variant}
          size={size}
          LeftIcon={LeftIcon}
          RightIcon={RightIcon}
        >
          {children}
        </LinkButton>
      )
    }

    return <>{Button}</>
  }
)
Button.displayName = 'Button'

export type LinkButtonProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof buttonVariants> &
  IconProps & { block?: boolean; disabled?: boolean; href?: string }

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      className,
      variant,
      size,

      block = false,
      children,
      LeftIcon,
      RightIcon,

      disabled = false,

      href,

      ...props
    },
    ref
  ) => {
    const Button = (
      <div
        className={cn(
          buttonVariants({
            variant,
            size,
            className: cn(
              {
                'flex w-full flex-1': block
              },
              className
            )
          })
        )}
        data-disabled={disabled}
        // ref={ref}
        {...props}
        onClick={(...args) => {
          props.onClick?.(...args)
          if (href) {
            push(href)
          }
        }}
      >
        {LeftIcon && <div>{LeftIcon ? LeftIcon : null}</div>}
        <Slottable>{children}</Slottable>
        {RightIcon && <div>{RightIcon}</div>}
      </div>
    )

    return <>{Button}</>
  }
)
LinkButton.displayName = 'LinkButton'

export { Button, buttonVariants, LinkButton }
