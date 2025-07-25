// 不区分平台的配置变量

import { STORAGE_GET_REGISTER_CODE } from '@/utils/storage'

// 配置文件地址
export const CONFIG_URL = '/platform/config.js'

// https://dashboard.privy.io 聚合钱包配置
export const PRIVY_APP_ID = 'cmca93bzn02d1jr0nik736ppe'
export const PRIVY_CLIENT_ID = 'client-WY6N2LhbC3ukhZuMTzuGVtvyouxs2gsPrLQkjY6Sr1Qfs'

export const getAppRegisterCode = () => {
  const code = STORAGE_GET_REGISTER_CODE()

  return code || '123456'
}
