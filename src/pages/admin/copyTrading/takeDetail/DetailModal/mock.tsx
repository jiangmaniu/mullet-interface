import { FormattedMessage } from '@umijs/max'
import dayjs from 'dayjs'

export const defaultAccountTypes = [
  { value: 'biaozhun', label: <FormattedMessage id="mt.biaozhun" /> },
  { value: 'luodian', label: <FormattedMessage id="mt.luodian" /> },
  { value: 'meifen', label: <FormattedMessage id="mt.meifen" /> }
]

export const defaultTags = [{ value: 'dipin', label: <FormattedMessage id="mt.dipin" /> }]

export const defaultTimeRange = [
  {
    value: 'liangzhou',
    label: <FormattedMessage id="mt.liangzhou" />
  },
  {
    value: 'yiyue',
    label: <FormattedMessage id="mt.yiyue" />
  }
]

export const orders = Array.from({ length: 20 }, (v, i) => {
  return {
    key: i + 1,
    shijian: dayjs().format('YYYY-MM-DD'),
    daidanfenrun: '23.232',
    gensui: 12,
    details: Array.from({ length: 5 }, (vv, j) => {
      return {
        img: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        pinzhong: 'BTCUSDT 永续',
        zhuangtai: j % 2 === 0 ? '多' : '空',
        desc: '全仓20X',
        fenrun: '111.334',
        name: '章鱼哥',
        shijian: dayjs().format('YYYY-MM-DD')
      }
    })
  }
})
