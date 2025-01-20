// 环境变量入口
// @ts-ignore
import platformConfig from '../../public/platform/config.js'

const ENV = {
  // 平台配置文件，支持在打包后也能手动修改
  ...platformConfig
}

export default ENV
