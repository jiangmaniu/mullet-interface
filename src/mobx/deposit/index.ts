import { makeAutoObservable, observable } from 'mobx'

import { STORAGE_GET_TOKEN } from '@/utils/storage'

import { methods, outMethods } from './mock'
import { IDepositMethod, IWithdrawalMethod } from './types'

export class DepositStore {
  constructor() {
    makeAutoObservable(this)
  }
  @observable depositMethods = methods as IDepositMethod[] // 付款方式
  @observable withdrawalMethods = outMethods as IWithdrawalMethod[] // 提现方式

  // 从后端同步支付方式
  getDepositMethods = async () => {
    // const res = await getDepositMethodsAPI()
    // runInAction(() => {
    //   if (res.data) {
    //     this.methods = res.data
    //   }
    // })
  }

  // 从后端同步提现方式
  getWithdrawalMethods = async () => {}

  // ========== 全局页面初始化执行 ================

  init = () => {
    this.getDepositMethods()
    this.getWithdrawalMethods()

    if (STORAGE_GET_TOKEN()) {
    }
  }
}

const deposit = new DepositStore()

export default deposit
