import { IPlatformConfig } from '@/mobx/global'
import { STORAGE_GET_PLATFORM_CONFIG } from '@/utils/storage'
import serverConf from './server'

export const getEnv = () => {
  // 客户端环境变量-通过请求public/platform/config.json动态获取的配置
  const clientConf = STORAGE_GET_PLATFORM_CONFIG() || {}

  const env = {
    ...clientConf,
    // 优先使用构建时传入的变量覆盖
    ...serverConf
  }
  return env as IPlatformConfig
}
