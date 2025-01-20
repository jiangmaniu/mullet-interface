import { IPlatformConfig } from '@/mobx/global'
import { STORAGE_GET_PLATFORM_CONFIG } from '@/utils/storage'

const ENV = (STORAGE_GET_PLATFORM_CONFIG() || {}) as IPlatformConfig

export default ENV
