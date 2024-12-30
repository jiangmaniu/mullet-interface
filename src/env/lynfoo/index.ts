// 环境变量入口

import lynfooProd from './env.prod'

const APP_ENV = process.env.APP_ENV as APP_ENV

type IENV = typeof lynfooProd

// 切换环境
const ENV = {
  prod: lynfooProd,
  dev: lynfooProd,
  test: lynfooProd
}[APP_ENV] as IENV

export default ENV
