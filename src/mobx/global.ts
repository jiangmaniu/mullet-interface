import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx'

import {
  STORAGE_GET_ACTIVE_SYMBOL_NAME,
  STORAGE_GET_FAVORITE,
  STORAGE_GET_SYMBOL_NAME_LIST,
  STORAGE_SET_ACTIVE_SYMBOL_NAME,
  STORAGE_SET_FAVORITE,
  STORAGE_SET_SYMBOL_NAME_LIST
} from '@/utils/storage'
import { AllSymbols, DEFAULT_QUOTE_FAVORITES_CURRENCY } from '@/utils/wsUtil'

export class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  @observable openSymbolNameList: string[] = [] // 记录打开的品种名称
  @observable favoriteList: string[] = [] // 自选列表
  @observable activeSymbolName = 'BTCUSDT' // 当前激活的品种名 @TODO 获取接口后，设置第一个默认币种
  @observable currentAccount = '' // 当前切换的账户
  @observable showBalanceEmptyModal = false // 余额为空弹窗

  // ========= 设置打开的品种 =========

  // 初始化本地打开的symbol
  @action
  initOpenSymbolNameList() {
    this.openSymbolNameList = STORAGE_GET_SYMBOL_NAME_LIST() || ['BTCUSDT'] // 当前激活的品种名 @TODO 获取接口后，设置第一个默认币种
    this.activeSymbolName = STORAGE_GET_ACTIVE_SYMBOL_NAME() || 'BTCUSDT' // 当前激活的品种名 @TODO 获取接口后，设置第一个默认币种
  }

  // 记录打开的symbol
  @action
  setOpenSymbolNameList(name: string) {
    if (!this.activeSymbolName) {
      this.activeSymbolName = name
    }
    if (this.openSymbolNameList.some((item) => item === name)) return
    this.openSymbolNameList.push(name)
    this.updateLocalOpenSymbolNameList()
  }

  // 移除打开的symbol
  @action
  removeOpenSymbolNameList(name: string, removeIndex: number) {
    const originList = JSON.parse(JSON.stringify(this.openSymbolNameList))
    const newList = this.openSymbolNameList.filter((item) => item !== name)

    this.openSymbolNameList = newList
    this.updateLocalOpenSymbolNameList()

    if (this.activeSymbolName === name) {
      // 更新激活的索引
      const nextActiveItem = originList[removeIndex - 1] || originList[removeIndex + 1]
      this.setActiveSymbolName(nextActiveItem)
    }
  }

  // 切换当前打开的symbol
  @action
  setActiveSymbolName(key: string) {
    this.activeSymbolName = key
    STORAGE_SET_ACTIVE_SYMBOL_NAME(key)
  }

  // 更新本地缓存的symbol列表
  @action updateLocalOpenSymbolNameList = () => {
    STORAGE_SET_SYMBOL_NAME_LIST(this.openSymbolNameList)
  }

  // =========== 收藏、取消收藏 ==============

  // 是否收藏品种
  @computed get isFavoriteSymbol() {
    return this.favoriteList.some((item: any) => item.name === this.activeSymbolName && item.checked)
  }

  // 获取本地自选
  @action async initFavoriteList() {
    const data = await STORAGE_GET_FAVORITE()
    if (Array.isArray(data) && data.length) {
      runInAction(() => {
        this.favoriteList = data
      })
    } else {
      this.setDefaultFavorite()
    }
  }

  // 设置默认资讯
  @action setDefaultFavorite() {
    // 设置本地默认自选
    this.setSymbolFavoriteToLocal(DEFAULT_QUOTE_FAVORITES_CURRENCY)
  }

  // 设置本地自选
  @action async setSymbolFavoriteToLocal(data: any) {
    if (Array.isArray(data) && data.length) {
      this.favoriteList = data
      STORAGE_SET_FAVORITE(data)
    } else {
      this.setDefaultFavorite()
    }
  }

  // 切选收藏选中状态
  @action toggleSymbolFavorite(name?: string) {
    const symbolName = name || this.activeSymbolName // 不传name，使用当前激活的
    const index = this.favoriteList.findIndex((v: any) => v.name === symbolName)
    const item: any = AllSymbols.find((v) => v.name === symbolName)

    // 删除
    if (index !== -1) {
      this.favoriteList.splice(index, 1)
    } else {
      // 添加到已选列表
      item.checked = true
      this.favoriteList.push(item)
    }
    this.setSymbolFavoriteToLocal(this.favoriteList)
  }

  // ========== 页面初始化执行 ================

  @action
  init = () => {
    // 初始化打开的品种列表
    this.initOpenSymbolNameList()
    // 初始化自选列表
    this.initFavoriteList()
  }
}

const global = new GlobalStore()

export default global
