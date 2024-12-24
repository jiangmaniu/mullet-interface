// 环境变量入口

import stelluxDev from './env.dev'
import stelluxProd from './env.prod'
import stelluxTest from './env.test'

const APP_ENV = process.env.APP_ENV as APP_ENV

type IENV = typeof stelluxProd

// 切换环境
const ENV = {
  // stellux默认平台
  test: stelluxTest,
  dev: stelluxDev,
  prod: stelluxProd
}[APP_ENV] as IENV

export default ENV
