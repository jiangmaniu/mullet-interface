import tailwindcssScrollbar from 'tailwind-scrollbar'
import tailwindcssAnimate from 'tailwindcss-animate'
import TailwindcssTheme from './src/theme/theme.tailwind'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.tsx', './src/components/**/*.tsx', './src/layouts/**/*.tsx'],
  darkMode: 'class', // 开启黑色主题模式，在html上添加类 dark/light切换 代码中写dark:bg-primary ...
  theme: TailwindcssTheme,
  // 解决Antd和tailwind样式冲突问题(Button背景透明)
  corePlugins: {
    preflight: false
  },
  plugins: [
    tailwindcssScrollbar({ nocompatible: true }),
    tailwindcssAnimate,
    function ({ addUtilities, addBase }) {
      addBase({
        '@keyframes dot-blink': {
          '0%, 100%': { content: '"."' },
          '33%': { content: '".."' },
          '66%': { content: '"..."' }
        }
      })

      const newUtilities = {
        '.ellipsis-blink': {
          position: 'relative',
          paddingRight: '15px'
        },
        '.ellipsis-blink::after': {
          content: '"."',
          position: 'absolute',
          display: 'inline-block',
          float: 'right',
          marginLeft: '1px',
          animation: 'dot-blink 2.4s infinite'
        }
      }

      addUtilities(newUtilities)
    }
  ]
}
