import { random } from 'lodash-es'

import Iconfont from '@/components/Base/Iconfont'

export const defaultDatas = {
  id: `${random(10000000, 99999999)}`,
  datas: {
    rate1: 19.81,
    rate2: 19.81,
    rate3: 12883,
    rate4: 23.23,
    rate5: 12883,
    rate6: 443300,
    rate7: 88
  }
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
