import { IPlatformConfig } from '@/mobx/global'
import { STORAGE_GET_PLATFORM_CONFIG } from '@/utils/storage'
import serverConf from './server'

export const getEnv = () => {
  // 客户端环境变量
  const clientConf = STORAGE_GET_PLATFORM_CONFIG() || {}

  const env = {
    ...serverConf,
    ...clientConf
  }
  return env as IPlatformConfig
}
