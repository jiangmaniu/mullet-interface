import { FormattedMessage } from '@umijs/max'
import { random } from 'lodash-es'

import { IOrderTaker } from '@/models/takers'

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

export const defaultTakers: IOrderTaker[] = [
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      id: `${random(10000000, 99999999)}`,
      name: 'Linen_Bitnex',
      type: 'biaozhun',
      avatar: '/img/avatar_demo.png',
      followers: 234,
      limitFollowers: 400
    },
    datas: {
      rate1: 19.81,
      rate2: 0.13,
      rate3: 12883,
      rate4: 12883,
      rate5: 12883,
      rate6: 0.98
    },
    tags: ['dipin'],
    state: 'gendan'
  },
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      id: `${random(10000000, 99999999)}`,
      name: 'Linen_Bitnex',
      type: 'luodian',
      avatar: '/img/avatar_demo.png',
      followers: 234,
      limitFollowers: 400
    },
    datas: {
      rate1: -19.81,
      rate2: -0.13,
      rate3: 12883,
      rate4: 12883,
      rate5: 12883,
      rate6: -0.98
    },
    tags: ['dipin'],
    state: 'yimanyuan'
  },
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      id: `${random(10000000, 99999999)}`,
      name: 'Linen_Bitnex',
      type: 'meifen',
      avatar: '/img/avatar_demo.png',
      followers: 234,
      limitFollowers: 400
    },
    datas: {
      rate1: 19.81,
      rate2: -0.13,
      rate3: 12883,
      rate4: 12883,
      rate5: 12883,
      rate6: 0.98
    },
    tags: ['dipin'],
    state: 'wufagendan'
  },
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      id: `${random(10000000, 99999999)}`,
      name: 'Linen_Bitnex',
      type: 'meifen',
      avatar: '/img/avatar_demo.png',
      followers: 234,
      limitFollowers: 400
    },
    datas: {
      rate1: 19.81,
      rate2: -0.13,
      rate3: 12883,
      rate4: 12883,
      rate5: 12883,
      rate6: 0.98
    },
    tags: ['dipin'],
    state: 'gendan'
  },
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      id: `${random(10000000, 99999999)}`,
      name: 'Linen_Bitnex',
      type: 'meifen',
      avatar: '/img/avatar_demo.png',
      followers: 234,
      limitFollowers: 400
    },
    datas: {
      rate1: 19.81,
      rate2: -0.13,
      rate3: 12883,
      rate4: 12883,
      rate5: 12883,
      rate6: 0.98
    },
    tags: ['dipin'],
    state: 'yigendan'
  },
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      id: `${random(10000000, 99999999)}`,
      name: 'Linen_Bitnex',
      type: 'meifen',
      avatar: '/img/avatar_demo.png',
      followers: 234,
      limitFollowers: 400
    },
    datas: {
      rate1: 19.81,
      rate2: -0.13,
      rate3: 12883,
      rate4: 12883,
      rate5: 12883,
      rate6: 0.98
    },
    tags: ['dipin'],
    state: 'wufagendan'
  },
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      id: `${random(10000000, 99999999)}`,
      name: 'Linen_Bitnex',
      type: 'meifen',
      avatar: '/img/avatar_demo.png',
      followers: 234,
      limitFollowers: 400
    },
    datas: {
      rate1: 19.81,
      rate2: -0.13,
      rate3: 12883,
      rate4: 12883,
      rate5: 12883,
      rate6: 0.98
    },
    tags: ['dipin'],
    state: 'wufagendan'
  }
]
