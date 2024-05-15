import currency from 'currency.js'
import lodash, { cloneDeep } from 'lodash'
import moment from 'moment'

import { DATE } from '@/constants/date'

export function isMobileDevice(): boolean {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(navigator.userAgent)
}

// 获取uid
export function getUid() {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    const cryptoObj = window.crypto || window.msCrypto
    if (cryptoObj && typeof cryptoObj.getRandomValues !== 'undefined') {
      // @ts-ignore
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
      )
    } else {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }
}

export const regPassword = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,16}$/ // 至少包含一个数字、至少包含一个大写字母、至少包含一个小写字母、至少包含一个特殊字符或下划线

export const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/ // 验证是否为邮箱格式；
export const regMobile = /^\d+(.\d{1,2})?$/

export function isMobile(str: string) {
  return regMobile.test(str)
}
export function isPassword(str: string) {
  return regPassword.test(str)
}
export function isEmail(str: string) {
  return regEmail.test(str)
}

// 格式化手机号码 178****12
export function formatMobile(mobile: string | undefined) {
  if (!mobile) return
  const mobileReg = /(\d{3})\d*(\d{2})/
  return `${mobile}`.replace(mobileReg, '$1****$2')
}

// 格式化邮箱
export const formatEmail = (email: string | undefined) => {
  if (!email) return
  if (email.indexOf('@') > 0) {
    let newEmail,
      str = email.split('@'),
      _s = ''

    if (str[0].length > 4) {
      _s = str[0].substr(0, 4)
      for (let i = 0; i < str[0].length - 4; i++) {
        _s += '*'
      }
    } else {
      _s = str[0].substr(0, 1)
      for (let i = 0; i < str[0].length - 1; i++) {
        _s += '*'
      }
    }
    newEmail = _s + '@' + str[1]
    return newEmail
  } else {
    return email
  }
}

/**
 * 格式化是
 * @param time 时间戳、字符串时间
 * @param formatType
 * @returns
 */
export const formatTime = (time: any, formatType = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '--'
  return moment(time).format(formatType)
}

export const formatStartTime = (value: any) => formatTime(value, 'YYYY-MM-DD') + ' 00:00:00'
export const formatEndTime = (value: any) => formatTime(value, 'YYYY-MM-DD') + ' 23:59:59'

/**
 * 格式化数字，返回默认两位  currency(123);      // 123.00
 * @param value
 * @returns
 */
export const formatValue = (value: any, opts?: any) => {
  // 不是一个数字
  if (isNaN(value)) {
    return '0.00'
  }
  const val = value || '0.00'
  return currency(val, opts).toString()
}

/**
 * 格式化数字
 * @param value
 * @returns
 */
export const formatNum = (value: any, opts = {}) => {
  // 不是一个数字
  if (isNaN(value)) {
    return '0.00'
  }
  const val = value || '0.00'
  const precision = String(value).split('.')?.[1]?.length || 2
  return currency(val, { symbol: '', precision, ...opts }).format()
}

/**
 * 第一个首字母大写
 * @param str 字符串
 * @returns
 */
export const upperFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const START_TIME = `${DATE.DATE_3_MONTHS_BEFORE} 00:00:00`
const END_TIME = `${DATE.DATE_TODAY} 23:59:59`

/**获取三个月前的日期 */
export const get3MonBeforeRange = (isFormat?: boolean) => {
  return isFormat ? [DATE.DATE_3_MONTHS_BEFORE, DATE.DATE_TODAY] : [moment(START_TIME), moment(END_TIME)]
}

export const getDefaultDateRange = (fileds: string[]) => {
  return { [fileds[0]]: START_TIME, [fileds[1]]: END_TIME }
}

/**
 *格式化代理人参数
 * @param params 请求参数
 * @param fileds 开始和结束时间字段名称
 * @param hiddenPageSizeOrPageNo 是否隐藏页码和分页大小
 * @returns
 */
export const formatAgentParams = (params: any, fileds?: any[], hiddenPageSizeOrPageNo?: boolean) => {
  // 避免污染
  const values = cloneDeep(params)

  // 如果没有传日期，默认三个月的，避免在页面重复写默认日期
  // 没有找到一个有效的日期
  if (!Object.values(values).some((v: any) => moment(v, 'YYYY-MM-DD', true).isValid()) && fileds?.length) {
    values[fileds[0]] = START_TIME
    values[fileds[1]] = END_TIME
  }

  if (values.current) {
    values.pageNo = values.current - 1 // 从0开始
  } else {
    values.pageNo = 0
    values.pageSize = 10
  }

  // 导出、查询统计信息不需要分页
  if (hiddenPageSizeOrPageNo) {
    delete values.pageNo
    delete values.pageSize
  }

  // 兼容后台的多套日期参数格式化
  if (values.beginCreateTime) {
    values.beginCreateTime = formatStartTime(values.beginCreateTime)
    values.endCreateTime = formatEndTime(values.endCreateTime)
  }
  if (values.beginCloseTime) {
    values.beginCloseTime = formatStartTime(values.beginCloseTime)
    values.endCloseTime = formatEndTime(values.endCloseTime)
  }
  if (values.beginTime) {
    values.beginTime = formatStartTime(values.beginTime)
    values.endTime = formatEndTime(values.endTime)
  }
  if (values.StartTime) {
    values.StartTime = formatStartTime(values.StartTime)
    values.EndTime = formatEndTime(values.EndTime)
  }
  if (values.startDate) {
    values.startDate = formatStartTime(values.startDate)
    values.endDate = formatEndTime(values.endDate)
  }

  // 选择日期后，格式化pc搜索表单参数，导出需要传日期
  if (fileds?.length && values.dates) {
    values[fileds[0]] = formatStartTime(values.dates[0])
    values[fileds[1]] = formatEndTime(values.dates[1])
    delete values.dates
  }

  return lodash.omit(values, ['current', 'dates'])
}

/**
 * 格式化导出参数-非代理人接口
 * @param params
 * @returns
 */
export const formatExportParams = (params: any, fileds?: any[]) => {
  // 处理pc导出参数
  if (params.dates && fileds?.length) {
    params[fileds[0]] = formatStartTime(params.dates[0])
    params[fileds[1]] = formatEndTime(params.dates[1])
    delete params.dates
  }
  return lodash.omit(params, ['current', 'startTime', 'endTime', 'dates'])
}

// 每n个分组
export const groupBy = (arr: any[], n: number) => {
  let newList = []
  for (let i = 0; i < arr.length; i += n) {
    newList.push(arr.slice(i, i + n))
  }
  return newList
}

export function formatStrLen(str: string) {
  return `${str}`.replace(/^(.{6}).*(.{6})$/, '$1****$2')
}

/**
 * 书籍生成指定位数的整数
 * @param digits
 * @returns
 */
export function generateRandomNumber(digits: number) {
  if (digits <= 0) {
    console.error('Digits should be greater than 0')
    return null
  }

  const min = 10 ** (digits - 1)
  const max = 10 ** digits - 1

  return Math.floor(Math.random() * (max - min + 1)) + min
}
// 数组随机排序
export function shuffleArray(arr: any[]) {
  return arr.sort(function () {
    return Math.random() - 0.5
  })
}

/**
 * 分钟转小时时间段
 * @param min 分钟
 * @returns
 */
export const formatMin2Time = (min: any) => {
  let time = (min / 60).toFixed(2)
  if (parseInt(time) === parseFloat(time)) {
    // console.log('整数')
    if (Number(time) < 10) {
      return '0' + parseInt(time).toFixed(0) + ':' + '00'
    } else {
      return parseInt(time).toFixed(0) + ':' + '00'
    }
  } else {
    // @ts-ignore
    let c = time.substring(time.indexOf('.') + 1, time.length) * 0.01
    let d = parseInt(time).toFixed(0)
    // @ts-ignore
    if (d < 10) {
      // @ts-ignore
      return '0' + d + ':' + ((c * 60).toFixed(0) < 10 ? '0' + (c * 60).toFixed(0) : (c * 60).toFixed(0))
    } else {
      // @ts-ignore
      return d + ':' + ((c * 60).toFixed(0) < 10 ? '0' + (c * 60).toFixed(0) : (c * 60).toFixed(0))
    }
  }
}
