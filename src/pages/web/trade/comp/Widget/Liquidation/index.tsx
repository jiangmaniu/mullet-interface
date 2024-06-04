import { FormattedMessage } from '@umijs/max'

import Gauge from './Gauge'

/**提示爆仓、仓位展示组件，开了杠杆才展示 */
export default function Liquidation() {
  return (
    <div className="border-t border-gray-50">
      <div className="px-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col relative -top-[10px]">
            <div className="flex items-center pb-2">
              <span className="text-xs text-gray font-semibold">
                USDT
                <FormattedMessage id="mt.quancang" />
              </span>
              <span className="text-xs text-gray-weak pl-2">
                <FormattedMessage id="mt.weicangwei" />
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-weak text-xs">
                <FormattedMessage id="mt.baozhengjinlv" />：
              </span>
              <span className="text-green font-semibold text-xs">78%</span>
            </div>
            <div className="flex items-center pt-1">
              <span className="text-gray-weak text-xs">
                <FormattedMessage id="mt.weichibaozhengjin" />：
              </span>
              <span className="text-green font-semibold text-xs">1,172 USDT</span>
            </div>
          </div>
          <div>
            <Gauge />
          </div>
        </div>
      </div>
    </div>
  )
}
