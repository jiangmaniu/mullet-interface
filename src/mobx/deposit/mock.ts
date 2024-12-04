/** 数据 mock */

export const methods: Wallet.DepositMethod[] = [
  {
    id: 'USDT',
    icon: 'zhanghu',
    title: 'USDT',
    status: 'unlocked',
    type: 'crypto',
    options: {
      waiting: {
        label: '到账时间',
        desc: '即时 - 30分钟'
      },
      limit: {
        label: '限制',
        desc: '20 - 10,000 USDT'
      },
      fee: {
        label: '手续费',
        desc: '0.00%'
      }
    },
    tips: `我们只接受 Ethereum 网络的 ERC-20 地址入金。`,
    notice: `<p>这是 UDST-TRC20 地址，请不要将 USDT 转入其他地址。否则将无法到账。</p>
    <p>最小充值金额为 20 USDT，最大充值金额为 10,000 USDT。</p>
    <p>充值到该地址后，需要网络节点确认，到账速度取决于网络节点确认速度，请耐心等待。</p>`
  },
  {
    id: 'USDC',
    icon: 'zhanghu',
    title: 'USDC',
    status: 'locked',
    type: 'crypto',
    options: {
      waiting: {
        label: '到账时间',
        desc: '即时 - 30分钟'
      },
      limit: {
        label: '限制',
        desc: '20 - 10,000 USDT'
      },
      fee: {
        label: '手续费',
        desc: '0.00%'
      }
    }
  },
  {
    id: 'BUSD',
    icon: 'zhanghu',
    title: 'BUSD',
    status: 'locked',
    type: 'crypto',
    options: {
      waiting: {
        label: '到账时间',
        desc: '即时 - 30分钟'
      },
      limit: {
        label: '限制',
        desc: '20 - 10,000 USDT'
      },
      fee: {
        label: '手续费',
        desc: '0.00%'
      }
    }
  },
  {
    id: 'IDR',
    icon: 'zhanghu',
    title: 'IDR Qris/VA',
    status: 'locked',
    type: 'bank',
    options: {
      waiting: {
        label: '到账时间',
        desc: '即时 - 30分钟'
      },
      limit: {
        label: '限制',
        desc: '20 - 10,000 USDT'
      },
      fee: {
        label: '手续费',
        desc: '0.00%'
      }
    }
  }
]

export const outMethods: Wallet.WithdrawMethod[] = [
  {
    id: 'USDT',
    icon: 'zhanghu',
    title: 'USDT',
    status: 'unlocked',
    type: 'crypto',
    options: {
      crypto: {
        label: '币种',
        desc: 'USDT',
        value: 'USDT'
      },
      chain: {
        label: '链',
        desc: 'ERC-20',
        value: 'ERC-20'
      },
      waiting: {
        label: '到账时间',
        desc: '即时 - 30分钟'
      },
      limit: {
        label: '限制',
        desc: '20 - 10,000 USDT'
      },
      fee: {
        label: '手续费',
        desc: '0.00%'
      }
    },
    tips: `请确保出金地址为 Ethereum 网络的 ERC-20 地址。`,
    notice: `<p>这是 UDST-TRC20 地址，请不要将 USDT 转入其他地址。否则将无法到账。</p>
    <p>最小充值金额为 20 USDT，最大充值金额为 10,000 USDT。</p>
    <p>充值到该地址后，需要网络节点确认，到账速度取决于网络节点确认速度，请耐心等待。</p>`
  },
  {
    id: 'IDR',
    icon: 'zhanghu',
    title: 'IDR Qris/VA',
    status: 'unlocked',
    type: 'bank',
    options: {
      bankName: {
        label: '银行名称',
        desc: 'Bank Name',
        value: 'Bank Name'
      },
      waiting: {
        label: '到账时间',
        desc: '即时 - 30分钟'
      },
      limit: {
        label: '限制',
        desc: '20 - 10,000 USDT'
      },
      fee: {
        label: '手续费',
        desc: '0.00%'
      }
    },
    notice: `<p>1. 出金金额少于 50 USD 将收取 3 USD 手续费。</p>
    <p>2. 用户交易量少于出金金额 50% 将收取 5% 手续费。</p>
    <p>3. 当前有处理中的订单时，无法出金。</p>
    <p>4. 出金时间（GMT+8）：10:00-18:00, 不在出金时间内将顺延至下一出金时间。</p>
    <p>5. 请务必确认设备安全， 防止信息被篡改或泄露。</p>`
  }
]
