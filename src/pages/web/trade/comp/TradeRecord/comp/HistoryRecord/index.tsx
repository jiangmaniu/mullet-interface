import { ProFormSelect } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { useState } from 'react'

import CustomTabs from '@/components/Base/CustomTabs'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { useEnv } from '@/context/envProvider'
import { useStores } from '@/context/mobxProvider'

import HistoryCloseList from './comp/HistoryCloseList'
import HistoryPendingList from './comp/HistoryPendingList'

type IProps = {
  style?: React.CSSProperties
  showActiveSymbol?: boolean
}

// 历史记录
function HistoryList({ style, showActiveSymbol }: IProps) {
  const { isPc } = useEnv()
  const { ws, trade } = useStores()
  const [tabKey, setTabKey] = useState<'close' | 'pending'>('close') // 历史成交、历史挂单
  const intl = useIntl()
  const [selectSymbol, setSelectSymbol] = useState<string>('')

  const filterClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-select-selector,.ant-picker-range': {
        borderRadius: '16px !important'
      }
    }
  })

  return (
    <div style={style}>
      <div className="flex items-center justify-between m-4">
        <CustomTabs
          items={[
            { label: <FormattedMessage id="mt.lishichengjiao" />, key: 'close' },
            { label: <FormattedMessage id="mt.lishiguadan" />, key: 'pending' }
          ]}
          onChange={(key: any) => {
            setTabKey(key)
          }}
          activeKey={tabKey}
        />
        <div className={classNames('flex items-center gap-x-3', filterClassName)}>
          <ProFormSelect
            options={trade.symbolListAll.map((item) => ({ ...item, value: item.symbol, label: item.symbol }))}
            placeholder={intl.formatMessage({ id: 'mt.xuanzebizhong' })}
            fieldProps={{
              optionItemRender: (item: Account.TradeSymbolListItem) => {
                return (
                  <div className="flex items-center truncate w-full">
                    <SymbolIcon src={item?.imgUrl} width={20} height={20} />
                    <span className="text-sub pl-1">{item.symbol}</span>
                  </div>
                )
              },
              onChange: (value: any) => {
                // 根据选择的值，筛选历史记录
                setSelectSymbol(value)
              }
            }}
            width={150}
          />
          {/* <ProFormDateRangePicker /> */}
        </div>
      </div>
      {tabKey === 'close' && <HistoryCloseList selectSymbol={selectSymbol} />}
      {tabKey === 'pending' && <HistoryPendingList selectSymbol={selectSymbol} />}
    </div>
  )
}

export default observer(HistoryList)
