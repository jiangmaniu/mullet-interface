import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { observer } from 'mobx-react'

import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'

type IProps = {
  value: any
  label: string | JSX.Element
  tips: any
}

function AccountListItem({ value, label, tips }: IProps) {
  const { trade } = useStores()
  const currentAccountInfo = trade.currentAccountInfo
  const currencyDecimal = currentAccountInfo.currencyDecimal || 2 // 账户组小数位

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between text-weak">
      <span className="text-primary">{label}</span>
      <Tooltip overlayClassName="max-w-[300px]" placement="top" title={tips}>
        <span className="ml-[5px]">
          <InfoCircleOutlined style={{ fontSize: 12 }} />
        </span>
      </Tooltip>
      <span className="my-0 ml-[18px] mr-[23px] h-[1px] flex-1 border-t-[1px] border-dashed border-gray-250 dark:border-gray-610"></span>
      <span className="max-w-[240px] break-all text-right text-primary !font-dingpro-medium">
        {Number(value) ? formatNum(value, { precision: currencyDecimal }) : '0.00'} USD
      </span>
    </div>
  )
}

export default observer(AccountListItem)
