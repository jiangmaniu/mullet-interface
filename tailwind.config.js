import TailwindcssTheme from './src/theme/theme.tailwind'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.tsx', './src/components/**/*.tsx', './src/layouts/**/*.tsx'],
  darkMode: 'class', // 开启黑色主题模式，在html上添加类 dark/light切换 代码中写dark:bg-primary ...
  theme: TailwindcssTheme,
  // 解决Antd和tailwind样式冲突问题(Button背景透明)
  corePlugins: {
    preflight: false
  }
}
