import { random } from 'lodash-es'

import { IOrderTaker } from '@/models/takers'

// export const defaultTakers: IOrderTaker[] = []

export const defaultTakers: IOrderTaker[] = [
  {
    id: `${random(10000000, 99999999)}`,
    account: {
      // 八位數字隨機數
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
      rate6: 443300,
      rate7: 88
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
      rate6: 443300,
      rate7: -88
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
      rate6: 443300,
      rate7: 88
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
      rate6: 443300,
      rate7: 88
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
      rate6: 443300,
      rate7: 88
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
      rate6: 443300,
      rate7: 88
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
      rate6: 443300,
      rate7: 88
    },
    tags: ['dipin'],
    state: 'wufagendan'
  }
]
