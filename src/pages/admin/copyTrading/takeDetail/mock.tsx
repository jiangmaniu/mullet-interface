import { random } from 'lodash-es'

import Iconfont from '@/components/Base/Iconfont'
import { IOrderTaker } from '@/models/takers'

export const defaultTaker: IOrderTaker = {
  id: `${random(10000000, 99999999)}`,
  account: {
    // 八位數字隨機數
    id: `${random(10000000, 99999999)}`,
    name: 'Linen_Bitnex',
    type: 'biaozhun',
    avatar: '/img/avatar_demo.png',
    introduction: '我的交易总是采用 DCA！如果你设置了 SL，你就会亏钱！使用“固定比率”选项。我会像对待自己的资金一样照顾你的资金。',
    followers: 234,
    limitFollowers: 400
  },
  datas: {
    rate1: 70.3,
    rate2: 0.13,
    rate3: 12883,
    rate4: 12883,
    rate5: 12883,
    rate6: 443300,
    rate7: 88
  },
  tags: ['dipin', 'dipin'],
  state: 'gendan'
}

export const mockNotifications = [
  {
    children: (
      <span className="flex items-center text-sm font-normal text-primary">
        <Iconfont name="tongzhi" width={20} height={20} />
        昨日带单分润已到账，数量 <span className=" text-green">0.02364731</span> USDT，请查收!
      </span>
    )
  },
  {
    children: (
      <span className="flex items-center text-sm font-normal text-primary">
        <Iconfont name="tongzhi" width={20} height={20} />
        通知通知通知通知<span className=" text-green">通知通知</span>，请查收!
      </span>
    )
  }
]

export const defaultTimeRange = 'liangzhou'
