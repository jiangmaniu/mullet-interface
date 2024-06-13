import { action, makeAutoObservable } from 'mobx'

import trade from './trade'

export class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  // ========== 全局页面初始化执行 ================
  @action
  init = () => {
    trade.init()
  }
}

const global = new GlobalStore()

export default global
