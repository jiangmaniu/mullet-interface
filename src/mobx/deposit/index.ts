import { makeAutoObservable, observable } from 'mobx'

import { STORAGE_GET_TOKEN } from '@/utils/storage'

import { methods } from './mock'
import { IDepositMethod } from './types'

export class DepositStore {
  constructor() {
    makeAutoObservable(this)
  }
  @observable methods = methods as IDepositMethod[] // 消息列表

  // 从后端同步支付方式
  getDepositMethods = async () => {
    // const res = await getDepositMethodsAPI()
    // runInAction(() => {
    //   if (res.data) {
    //     this.methods = res.data
    //   }
    // })
  }

  // ========== 全局页面初始化执行 ================

  init = () => {
    this.getDepositMethods()

    if (STORAGE_GET_TOKEN()) {
    }
  }
}

const deposit = new DepositStore()

export default deposit
