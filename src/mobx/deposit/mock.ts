import { IDepositMethod } from './types'

export const methods: IDepositMethod[] = [
  {
    id: 'USDT',
    icon: 'zhanghu',
    title: 'USDT',
    status: 'unlocked',
    options: [
      {
        title: '到账时间',
        desc: '即时 - 30分钟'
      },
      {
        title: '限制',
        desc: '20 - 10,000 USDT'
      },
      {
        title: '手续费',
        desc: '0.00%'
      }
    ],
    address: '0x1234567890abcdef',
    depositTips: `我们只接受 Ethereum 网络的 ERC-20 地址入金。`,
    depositNotice: `<p>这是 UDST-TRC20 地址，请不要将 USDT 转入其他地址。否则将无法到账。</p>
    <p>最小充值金额为 20 USDT，最大充值金额为 10,000 USDT。</p>
    <p>充值到该地址后，需要网络节点确认，到账速度取决于网络节点确认速度，请耐心等待。</p>`
  },
  {
    id: 'USDC',
    icon: 'zhanghu',
    title: 'USDC',
    status: 'locked',
    options: [
      {
        title: '到账时间',
        desc: '即时 - 30分钟'
      },
      {
        title: '限制',
        desc: '20 - 10,000 USDT'
      },
      {
        title: '手续费',
        desc: '0.00%'
      }
    ]
  },
  {
    id: 'BUSD',
    icon: 'zhanghu',
    title: 'BUSD',
    status: 'locked',
    options: [
      {
        title: '到账时间',
        desc: '即时 - 30分钟'
      },
      {
        title: '限制',
        desc: '20 - 10,000 USDT'
      },
      {
        title: '手续费',
        desc: '0.00%'
      }
    ]
  },
  {
    id: 'IDR',
    icon: 'zhanghu',
    title: 'IDR Qris/VA',
    status: 'locked',
    options: [
      {
        title: '到账时间',
        desc: '即时 - 30分钟'
      },
      {
        title: '限制',
        desc: '20 - 10,000 USDT'
      },
      {
        title: '手续费',
        desc: '0.00%'
      }
    ]
  }
]
