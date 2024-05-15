declare namespace Activity {
  type BannerItem = {
    bannerImage: string
    bannerName: string
    bannerSort: number
    bannerType: number
    bannerUrl: string
    id: number
    isEnable: boolean
    language: string
    remark: string
  }
  // 我的活动
  type MyActivityItem = {
    accountactivityendtime: number
    accountactivitystarttime: number
    accountactivitystatus: number
    accountactivitystatusname: string
    accountid: number
    activityendtime: number
    activitygroup: string
    activityid: number
    activityname: string
    activitystarttime: number
    activitystatus: number
    activitystatusname: string
    activitytemplate: string
    /**LaXin LaoDaiXinSan */
    code: string
    dollarsincash: number
    handnum: number
    id: number
    invitednum: number
    inviteebonus: number
    inviterbonus: number
    platform: number
    releasedamount: number
    tradingcashback: number
    userhandnum: number
  }
  type LaoDaiXinActivityItem = {
    accountid: string
    starttime: string
    freegold: string
  }
}
