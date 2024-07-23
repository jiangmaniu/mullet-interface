// 訂單列表
// export const orders: any[] = []

import dayjs from 'dayjs'

// 遍历 1 ～ 10 创建id 为 1 ～ 10 的对象数组
export const orders = Array.from({ length: 10 }, (v, i) => {
  return {
    key: i + 1,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    name: 'Linen_Bitnex',
    id: '123456789',
    type: 'biaozhun',
    followers: 234,
    jingyingkui: i % 2 === 0 ? '-3771.21' : '3771.21',
    gendanjine: i % 2 === 0 ? '-12' : '12',
    baozhengjinyue: '1182.2',
    yishixianyingkui: '1182.2',
    weishixianyingkui: '237',
    gensuitianshu: '20',
    fenrunjine: '1182.2',
    gensuikaishishijian: dayjs().format('MM-DD HH:mm:ss'),
    gensuijieshushijian: dayjs().format('MM-DD HH:mm:ss')
  }
})

// historys
export const mockHistory: any[] = [
  {
    key: '1',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '空',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '-111'
  },
  {
    key: '2',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '多',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '111'
  },
  {
    key: '3',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '多',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '111'
  },
  {
    key: '4',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '多',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '111'
  },
  {
    key: '5',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '多',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '111'
  },
  {
    key: '6',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '多',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '111'
  },
  {
    key: '7',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '多',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '111'
  },
  {
    key: '8',
    pinzhong: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      pinzhong: 'BTCUSDT 永續',
      zhuangtai: '多',
      desc: '全倉 20X'
    },
    pingcangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    kaicangshijian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    zuidachicangliang: '12',
    pingcangjunjia: '1182.2',
    kaicangjunjia: '1182.2',
    pingcangshuliang: '237',
    chicangshuliang: '982',
    qiangpinjia: '1182.2',
    gensuirenshu: '1182.2',
    yingkui: '111'
  }
]
