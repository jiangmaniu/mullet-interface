import { ProColumns } from '@ant-design/pro-components'
import { FormattedMessage } from '@umijs/max'

import SymbolIcon from '@/components/Base/SymbolIcon'
import { getEnum } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { formatNum } from '@/utils'
import { getBuySellInfo } from '@/utils/business'
import { cn } from '@/utils/cn'

export const getColumns = (): ProColumns<Order.OrderPageListItem>[] => {
  const { trade } = useStores()
  const currencyDecimal = trade.currentAccountInfo.currencyDecimal
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'

  return [
    {
      title: (
        <span className="!pl-1">
          <FormattedMessage id="mt.pinlei" />
        </span>
      ), // 与 antd 中基本相同，但是支持通过传入一个方法
      dataIndex: 'category',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      fixed: 'left',
      width: 230,
      renderText(text, record, index, action) {
        const buySellInfo = getBuySellInfo(record)
        return (
          <div className="flex items-center">
            <SymbolIcon src={record?.imgUrl} />
            <div className="flex flex-col pl-4">
              <span className="text-base font-semibold text-primary">{record.symbol}</span>
              <span className={cn('text-xs font-medium pt-[2px]', buySellInfo.colorClassName)}>{buySellInfo.text2}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: <FormattedMessage id="common.type" />,
      dataIndex: 'type',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: isZh ? 120 : 160,
      align: 'left',
      valueEnum: getEnum().Enum.OrderType,
      className: '!text-[13px] text-primary'
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.qingqiujiage" />
        </>
      ),
      dataIndex: 'limitPrice',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 140,
      renderText(text, record, index, action) {
        let price: any = ''
        if (record.type === 'MARKET_ORDER') {
          price = ''
        } else {
          price = record.limitPrice
        }
        // if (
        //   record.type === 'LIMIT_BUY_ORDER' ||
        //   record.type === 'LIMIT_SELL_ORDER' ||
        //   record.type === 'STOP_LOSS_LIMIT_BUY_ORDER' ||
        //   record.type === 'STOP_LOSS_LIMIT_SELL_ORDER'
        // ) {
        //   // 停损单/限价单  显示挂单输入价格
        //   price = record.limitPrice
        // }
        // else {
        //   // 止盈止损  显示输入的价格
        //   price = record.limitPrice
        // }
        return <span className="!text-[13px] text-primary">{formatNum(price)}</span>
      }
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.chengjiaojia" />
        </>
      ),
      dataIndex: 'tradePrice',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 140,
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-primary">{formatNum(text, { precision: record.symbolDecimal })}</span>
      }
    },
    {
      title: <FormattedMessage id="mt.shoushu" />,
      dataIndex: 'orderVolume',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        precision: 2,
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: isZh ? 140 : 100,
      align: 'left',
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-primary">{formatNum(text)}</span>
      }
    },
    {
      title: (
        <>
          <FormattedMessage id="mt.shouxufei" />
          (USD)
        </>
      ),
      dataIndex: 'handlingFees',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: isZh ? 140 : 150,
      renderText(text, record, index, action) {
        return <span className="!text-[13px] text-primary">{formatNum(text, { precision: currencyDecimal })}</span>
      }
    },
    {
      title: <FormattedMessage id="mt.jiaoyishijian" />,
      dataIndex: 'createTime',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 180,
      className: '!text-[13px] text-primary'
    },
    {
      title: <FormattedMessage id="mt.dingdanhao" />,
      dataIndex: 'id',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 200
    },
    {
      title: <FormattedMessage id="common.status" />,
      dataIndex: 'status',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      align: 'right',
      fixed: 'right',
      className: '!text-[13px] text-primary',
      renderText(text, record, index, action) {
        return <span>{getEnum().Enum.OrderStatus?.[record.status!]?.text || '-'}</span>
      }
    }
  ]
}
