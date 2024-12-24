// 环境变量入口

import lynfooProd from './lynfoo/env.prod'
import stelluxDev from './stellux/env.dev'
import stelluxProd from './stellux/env.prod'
import stelluxTest from './stellux/env.test'

const APP_ENV = process.env.APP_ENV as string

type IENV = typeof stelluxProd

// 切换环境
const ENV = {
  // stellux默认平台
  test: stelluxTest,
  dev: stelluxDev,
  prod: stelluxProd,

  // 其他客户平台
  'lynfoo-prod': lynfooProd
}[APP_ENV] as IENV

export default ENV
