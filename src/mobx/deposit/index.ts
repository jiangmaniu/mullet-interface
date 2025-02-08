import { makeAutoObservable, observable, runInAction } from 'mobx'

import { getDepositMethodList, getWithdrawMethodList } from '@/services/api/wallet'
import { STORAGE_GET_TOKEN } from '@/utils/storage'

import { methods, outMethods } from './mock'

export class DepositStore {
  constructor() {
    makeAutoObservable(this)
  }
  @observable depositMethods = methods as Wallet.DepositMethod[] // 付款方式
  @observable withdrawalMethods = outMethods as Wallet.WithdrawMethod[] // 提现方式

  // 从后端同步支付方式
  getDepositMethods = async () => {
    const res = await getDepositMethodList()
    runInAction(() => {
      if (res.data) {
        this.depositMethods = res.data.records
      }
    })
  }

  // 从后端同步提现方式
  getWithdrawalMethods = async () => {
    const res = await getWithdrawMethodList()
    runInAction(() => {
      if (res.data) {
        this.withdrawalMethods = res.data.records
      }
    })
  }

  // ========== 全局页面初始化执行 ================

  init = () => {
    // 获取支付方式
    this.getDepositMethods()
    // 获取提现方式
    this.getWithdrawalMethods()

    if (STORAGE_GET_TOKEN()) {
    }
  }
}

const deposit = new DepositStore()

export default deposit
