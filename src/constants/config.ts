// 不区分平台的配置变量

import { STORAGE_GET_REGISTER_CODE } from '@/utils/storage'

// 配置文件地址
export const CONFIG_URL = '/platform/config.js'

export const getAppRegisterCode = () => {
  const code = STORAGE_GET_REGISTER_CODE()

  return code || '123456'
}
