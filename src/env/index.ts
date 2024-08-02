// 环境入口

import dev from './env.dev'
import prod from './env.prod'
import test from './env.test'

const APP_ENV = process.env.APP_ENV as string

// 切换环境
const env = {
  test,
  dev,
  prod
}[APP_ENV]

// 公共环境变量
const URLS = {
  offical: 'www.stellux.com',
  ...env
}

const ENV = URLS as typeof env & typeof URLS

export default ENV
