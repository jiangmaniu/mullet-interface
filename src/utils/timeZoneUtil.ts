/**
 * 时区时间转换工具
 */
class TimeZoneUtil {
  /**
   * 转换UTC时间到指定时区
   * @param utcTime UTC时间，支持时间戳(number)、ISO字符串、Date对象
   * @param timeZoneOffset 时区偏移小时数，例如：东八区填8，西五区填-5
   * @param format 输出格式：'timestamp' | 'iso' | 'date' | 'string'
   * @returns 转换后的时间
   */
  static convertToTimezone(
    utcTime: number | string | Date,
    timeZoneOffset = 8,
    format: 'timestamp' | 'iso' | 'date' | 'string' = 'string'
  ) {
    // 统一转换为Date对象
    const date = typeof utcTime === 'number' ? new Date(utcTime) : typeof utcTime === 'string' ? new Date(utcTime) : utcTime

    // 计算时区偏移的毫秒数
    const offsetMs = timeZoneOffset * 60 * 60 * 1000
    const localTime = new Date(date.getTime() + offsetMs)

    // 根据指定格式返回
    switch (format) {
      case 'timestamp':
        return localTime.getTime()
      case 'iso':
        return localTime.toISOString()
      case 'date':
        return localTime
      case 'string':
      default:
        return this.formatDate(localTime)
    }
  }

  /**
   * 格式化日期为可读字符串
   * @param date Date对象
   * @returns 格式化后的字符串，格式：YYYY-MM-DD HH:mm:ss
   */
  private static formatDate(date: Date): string {
    const pad = (num: number) => String(num).padStart(2, '0')

    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  /**
   * 获取当前时区的偏移小时数
   * @returns 当前时区的偏移小时数
   */
  static getCurrentTimezoneOffset(): number {
    return -new Date().getTimezoneOffset() / 60
  }
}

export { TimeZoneUtil }

/**
 * 
 * 时区偏移值为正数表示东区（如：北京UTC+8为8）
时区偏移值为负数表示西区（如：纽约UTC-5为-5）
默认使用东八区（北京时间）作为目标时区
默认输出格式为 "YYYY-MM-DD HH:mm:ss"


// 示例1：转换时间戳
const timestamp = 1677649200000; // 2023-03-01 12:00:00 UTC
console.log(TimeZoneUtil.convertToTimezone(timestamp)); // 2023-03-01 20:00:00 (UTC+8)

// 示例2：转换ISO字符串
const isoString = '2023-03-01T12:00:00.000Z';
console.log(TimeZoneUtil.convertToTimezone(isoString)); // 2023-03-01 20:00:00 (UTC+8)

// 示例3：转换为时间戳
console.log(TimeZoneUtil.convertToTimezone(timestamp, 8, 'timestamp')); 

// 示例4：转换为ISO格式
console.log(TimeZoneUtil.convertToTimezone(timestamp, 8, 'iso'));

// 示例5：转换为Date对象
console.log(TimeZoneUtil.convertToTimezone(timestamp, 8, 'date'));

// 示例6：获取当前时区偏移
console.log('当前时区偏移：', TimeZoneUtil.getCurrentTimezoneOffset());

// 示例7：处理不同时区
console.log(TimeZoneUtil.convertToTimezone(timestamp, -5));  // 美东时间 (UTC-5)
console.log(TimeZoneUtil.convertToTimezone(timestamp, 1));   // 欧洲中部时间 (UTC+1)
console.log(TimeZoneUtil.convertToTimezone(timestamp, 9));   // 日本时间 (UTC+9)
 */
