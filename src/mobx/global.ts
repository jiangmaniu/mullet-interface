import { action, makeAutoObservable, observable, runInAction } from 'mobx'

import { HOME_PAGE } from '@/constants'
import { getIpInfo } from '@/utils/ip'
import { getPathname, replace } from '@/utils/navigator'
import {
  STORAGE_GET_ACTIVE_MENU_PATH,
  STORAGE_GET_OPEN_MENU_LIST,
  STORAGE_SET_ACTIVE_MENU_PATH,
  STORAGE_SET_OPEN_MENU_LIST
} from '@/utils/storage'

export type LocationData = {
  area_code: string
  city: string
  city_code: string
  continent: string
  country: string
  country_code: string
  district: string
  elevation: string
  ip: string
  isp: string
  latitude: string
  longitude: string
  province: string
  street: string
  time_zone: string
  weather_station: string
  zip_code: string
}

export class GlobalStore {
  @observable locationInfo = {} as LocationData

  constructor() {
    makeAutoObservable(this)
  }

  @observable openMenuList: string[] = [] // 记录打开的品种名称
  @observable currentOpenMenuPath = '/symbol' // 当前激活的品种名

  // 初始化本地打开的path
  @action
  initOpenMenuList() {
    this.openMenuList = STORAGE_GET_OPEN_MENU_LIST() || ['/symbol']
    this.currentOpenMenuPath = STORAGE_GET_ACTIVE_MENU_PATH() || '/symbol'
  }

  // 记录打开的path
  @action
  setOpenMenuList(path: string) {
    if (!this.currentOpenMenuPath) {
      this.currentOpenMenuPath = path
    }
    if (this.openMenuList.some((item) => item === path)) return
    this.openMenuList.push(path)
    this.updateLocalOpenMenuList()
  }

  // 移除打开的path
  @action
  removeOpenMenuList(path: string, removeIndex: number) {
    const originList = JSON.parse(JSON.stringify(this.openMenuList))
    const newList = this.openMenuList.filter((item) => item !== path)

    this.openMenuList = newList
    this.updateLocalOpenMenuList()

    if (this.currentOpenMenuPath === path) {
      // 更新激活的索引
      const nextActiveItem = originList[removeIndex - 1] || originList[removeIndex + 1]
      this.setActiveMenuPath(nextActiveItem)

      // 激活菜单路由
      replace(getPathname(nextActiveItem))
    }
  }

  // 关闭全部打开的路径
  @action
  closeOpenMenuPath = (key: string) => {
    const isRemoveAll = key === 'all'
    const path = isRemoveAll ? HOME_PAGE : this.currentOpenMenuPath
    // 清空缓存
    STORAGE_SET_OPEN_MENU_LIST([])
    // 当前当前激活的菜单
    this.currentOpenMenuPath = path
    STORAGE_SET_ACTIVE_MENU_PATH(path)
    // 设置打开的菜单列表
    STORAGE_SET_OPEN_MENU_LIST([path])
    this.openMenuList = [path]
    // 跳转
    replace(path)
  }

  // 切换当前打开的path
  @action
  setActiveMenuPath(path: string) {
    const formatPath = getPathname(path)
    this.currentOpenMenuPath = formatPath
    STORAGE_SET_ACTIVE_MENU_PATH(formatPath)

    // 更新激活的菜单路由
    this.setOpenMenuList(formatPath)
  }

  // 更新本地缓存的path列表
  @action updateLocalOpenMenuList = () => {
    STORAGE_SET_OPEN_MENU_LIST(this.openMenuList)
  }

  // ====================

  @action
  getIp = async () => {
    return getIpInfo().then((res) => {
      runInAction(() => {
        this.locationInfo = res
      })
    })
  }

  init = async () => {
    try {
      this.getIp()
      this.initOpenMenuList()
    } catch (e) {
      console.log('init error', e)
    }
  }
}

const global = new GlobalStore()

export default global
