export const NewThemeTextColor = {
  'content-1': 'rgb(var(--color-white))',
  'content-2': 'rgb(var(--color-zinc-50))',
  'content-3': 'rgb(var(--color-zinc-100))',
  'content-4': 'rgb(var(--color-zinc-200))',
  'content-5': 'rgb(var(--color-zinc-300))',
  'content-6': 'rgb(var(--color-zinc-400))',
  'content-foreground': 'rgb(var(--color-zinc-800))',
  // shadcn/ui 兼容变量
  'foreground': 'rgb(var(--color-white))',
}

export const NewThemeBackgroundColor = {
  'primary': 'rgb(var(--color-zinc-500))',
  'secondary': 'rgb(var(--color-zinc-800))',
  'transparent': 'transparent',
  'move-in': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 10%, transparent)',
  'button': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 20%, transparent)',
  'button-box': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 40%, transparent)',
  'card': 'color-mix(in srgb, rgb(var(--color-zinc-800)) 50%, transparent)',
  'navigation': 'color-mix(in srgb, rgb(var(--color-zinc-800)) 80%, transparent)',
  'pop-up-mask': 'color-mix(in srgb, rgb(var(--color-zinc-800)) 100%, transparent)',
  // shadcn/ui 兼容变量
  'background': 'rgb(var(--color-zinc-500))',
}

export const NewThemeBorderColor = {
  'zinc-xs': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 20%, transparent)',
  'zinc-base': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 40%, transparent)',
  'zinc-large': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 100%, transparent)',
  'white-base': 'color-mix(in srgb, rgb(var(--color-white)) 100%, transparent)',
  'yellow-base': 'color-mix(in srgb, rgb(var(--color-yellow-500)) 100%, transparent)',
  'orange-base': 'color-mix(in srgb, rgb(var(--color-orange-500)) 100%, transparent)',
  // shadcn/ui 兼容变量
  'border': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 40%, transparent)',
}

export const NewThemeColor = {
  'brand-primary': 'rgb(var(--color-yellow-500))',
  'brand-support': 'rgb(var(--color-blue-500))',
  'brand-secondary-1': 'color-mix(in srgb, rgb(var(--color-zinc-400)) 100%, transparent)',
  'brand-secondary-2': 'color-mix(in srgb, rgb(var(--color-zinc-300)) 100%, transparent)',
  'brand-secondary-3': 'color-mix(in srgb, rgb(var(--color-zinc-200)) 100%, transparent)',
  'trade-buy': 'rgb(var(--color-green-500))',
  'trade-sell': 'rgb(var(--color-red-500))',
  'market-rise': 'var(--color-trade-buy)',
  'market-fall': 'var(--color-trade-sell)',
}

export const NewThemeFontSize = {
  'xs': '12px',
  'small': '14px',
  'medium': '16px',
  'large': '18px',
  'xl': '24px',
  '2xl': '28px',
  '3xl': '30px',

  'title-h1': [
    '32px',
    {
      lineHeight: 'var(--leading-2xl)',
      fontWeight: 'var(--font-weight-semibold)',
    },
  ],


  'title-h2': [
    '28px',
    {
      lineHeight: 'var(--leading-xl)',
      fontWeight: 'var(--font-weight-semibold)',
    },
  ],

  'title-h3': [
    '24px',
    {
      lineHeight: 'var(--leading-large)',
      fontWeight: 'var(--font-weight-semibold)',
    },
  ],

  'paragraph-p1': [
    '16px',
    {
      lineHeight: 'var(--leading-medium)',
      fontWeight: 'var(--font-weight-regular)',
    },
  ],

  'paragraph-p2': [
    '14px',
    {
      lineHeight: 'var(--leading-small)',
      fontWeight: 'var(--font-weight-regular)',
    },
  ],

  'paragraph-p3': [
    '12px',
    {
      lineHeight: 'var(--leading-xs)',
      fontWeight: 'var(--font-weight-regular)',
    },
  ],

  'important-1': [
    '14px',
    {
      lineHeight: 'var(--leading-xs)',
      fontWeight: 'var(--font-weight-semibold)',
    },
  ],

  'important-2': [
    '12px',
    {
      lineHeight: 'var(--leading-xs)',
      fontWeight: 'var(--font-weight-semibold)',
    },
  ],


  'button-1': [
    '12px',
    {
      lineHeight: 'var(--leading-xs)',
      fontWeight: 'var(--font-weight-medium)',
    },
  ],

  'button-2': [
    '14px',
    {
      lineHeight: 'var(--leading-xs)',
      fontWeight: 'var(--font-weight-medium)',
    },
  ],
  'clickable-1': [
    'var(--font-size-xs)',
    {
      lineHeight: 'var(--leading-xs)',
      // fontWeight: 'var(--font-weight-medium)',
    },
  ],
}

export const NewThemeLineHeight = {
  'xs': '16px',
  'small': '20px',
  'medium': '24px',
  'large': '28px',
  'xl': '32px',
  '2xl': '36px',
  '3xl': '40px',
}

export const NewThemeFontWeight = {
  'regular': 'regular',
  'medium': 'medium',
  'semibold': 'semibold',
}

export const NewThemeRadius = {
  'xs': '4px',
  'small': '8px',
  'medium': '12px',
  'large': '16px',
  'xl': '24px',
  '2xl': '28px',
  '3xl': '32px',
}

export const NewThemeBaseSize = 4

export const NewThemeSpacing = {
  xs: `${NewThemeBaseSize * 1}px`,
  small: `${NewThemeBaseSize * 1.5}px`,
  medium: `${NewThemeBaseSize * 2}px`,
  large: `${NewThemeBaseSize * 2.5}px`,
  xl: `${NewThemeBaseSize * 3}px`,
  '2xl': `${NewThemeBaseSize * 4}px`,
  '3xl': `${NewThemeBaseSize * 6}px`,
  '4xl': `${NewThemeBaseSize * 8}px`,
}

export const NewThemeBoxShadow = {
  'base': '0px 4px 4px 0px color-mix(in srgb, rgb(var(--color-black)) 10%, transparent)',
  'inset-base': 'inset 0px 2px 4px 0px color-mix(in srgb, rgb(var(--color-black)) 50%, transparent)',
}

export const NewThemeBackdropBlur = {
  'base': `${NewThemeBaseSize * 3}px`,
}
