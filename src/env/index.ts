// 环境变量入口

import lynfooEnv from './lynfoo'
import stelluxEnv from './stellux'

const PLATFORM = process.env.PLATFORM as PLATFORM

// 根据平台切换环境
const ENV =
  {
    stellux: stelluxEnv,
    lynfoo: lynfooEnv
  }[PLATFORM] || {}

export default ENV
