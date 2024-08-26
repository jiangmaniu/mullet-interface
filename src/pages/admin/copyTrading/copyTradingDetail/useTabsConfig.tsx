import { useIntl } from '@umijs/max'
import { TableProps, TabsProps } from 'antd'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'

import Tags from '@/components/Admin/Tags'
import { CURRENCY } from '@/constants'
import { getTradeFollowFolloerHistoryFollowerOrder } from '@/services/api/tradeFollow/follower'
import { formatNum, getColorClass } from '@/utils'

import TabTable from '../comp/TabsTable/Table'
import { mockHistory, orders as mockOrder } from './mockTabTable'

export const useTabsConfig = () => {
  const intl = useIntl()

  const onChange = (key: string) => {
    console.log(key)
  }

  // 订单表格
  const orderColumns: TableProps['columns'] = [
    {
      title: intl.formatMessage({ id: 'mt.pinzhong' }),
      dataIndex: 'pinzhong',
      key: 'pinzhong',
      render: (pz) => (
        <span className=" flex gap-1 items-center">
          <img src={pz.img} alt="" className="w-8 h-8 rounded-full" />
          <span className=" flex flex-col items-start">
            <span className="text-sm  font-pf-bold text-primary">{pz.pinzhong}</span>
            <span className="flex items-center gap-1">
              <Tags size="tiny" color={pz.zhuangtai === '空' ? 'red' : 'green'}>
                {pz.zhuangtai}
              </Tags>
              <Tags size="tiny" color="gray">
                {pz.desc}
              </Tags>
            </span>
          </span>
        </span>
      )
    },
    {
      title: `${intl.formatMessage({ id: 'mt.weishixianyingkui' })}(${CURRENCY})`,
      dataIndex: 'weishixianyingkui',
      key: 'weishixianyingkui',
      render: (text) => (
        <span className={classNames('!font-dingpro-medium text-primary', getColorClass(text))}>
          {text > 0 ? '+' : ''}
          {formatNum(text)}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'mt.shouyilv' }),
      dataIndex: 'shouyilv',
      key: 'shouyilv',
      render: (text) => <span className={classNames('!font-dingpro-medium text-primary', getColorClass(text))}>{formatNum(text)}%</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.kaicangjunjia' }),
      dataIndex: 'kaicangjunjia',
      key: 'kaicangjunjia',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.biaojijia' }),
      dataIndex: 'biaojijia',
      key: 'biaojijia',
      render: (text) => <span className="!font-dingpro-regular text-primary">{`${formatNum(text)} ${CURRENCY}`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.baozhengjin' }),
      dataIndex: 'baozhengjin',
      key: 'baozhengjin',
      render: (text) => <span className="!font-dingpro-regular text-primary">{`${formatNum(text)} ${CURRENCY}`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.chicangshuliang' }),
      dataIndex: 'chicangshuliang',
      key: 'chicangshuliang',
      render: (text) => <span className="!font-dingpro-regular text-primary">{`${formatNum(text)} ${CURRENCY}`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.qiangpinjia' }),
      dataIndex: 'qiangpinjia',
      key: 'qiangpinjia',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.gensuirenshu' }),
      dataIndex: 'gensuirenshu',
      key: 'gensuirenshu',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    }
  ]

  const historyColumns: TableProps['columns'] = [
    {
      title: intl.formatMessage({ id: 'mt.pinzhong' }),
      dataIndex: 'pinzhong',
      key: 'pinzhong',
      render: (pz) => (
        <span className=" flex gap-1 items-center">
          <img src={pz.img} alt="" className="w-8 h-8 rounded-full" />
          <span className=" flex flex-col items-start">
            <span className="text-sm font-pf-bold text-primary">{pz.pinzhong}</span>
            <span className="flex items-center gap-1">
              <Tags size="tiny" color={pz.zhuangtai === '空' ? 'red' : 'green'}>
                {pz.zhuangtai}
              </Tags>
              <Tags size="tiny" color="gray">
                {pz.desc}
              </Tags>
            </span>
          </span>
        </span>
      )
    },
    {
      title: `${intl.formatMessage({ id: 'mt.yingkui' })}(${CURRENCY})`,
      dataIndex: 'yingkui',
      key: 'yingkui',
      render: (text) => (
        <span className={classNames('!font-dingpro-medium text-primary', getColorClass(text))}>
          {text > 0 ? '+' : ''}
          {formatNum(text)}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'mt.shouxufei' }),
      dataIndex: 'shouxufei',
      key: 'shouxufei',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.chengjiaojiage' }),
      dataIndex: 'chengjiaojiage',
      key: 'chengjiaojiage',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.kaicangjunjia' }),
      dataIndex: 'kaicangjunjia',
      key: 'kaicangjunjia',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.shoushu' }),
      dataIndex: 'shoushu',
      key: 'shoushu',
      render: (text) => (
        <span className="!font-dingpro-regular text-primary">{`${formatNum(text)} ${intl.formatMessage({ id: 'mt.shou2' })}`}</span>
      )
    },
    {
      title: intl.formatMessage({ id: 'mt.fenrunjine' }),
      dataIndex: 'fenrunjine',
      key: 'fenrunjine',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.jiaoyishijian' }),
      dataIndex: 'kaicangshijian',
      key: 'kaicangshijian',
      align: 'right',
      render: (text) => <span className="!font-dingpro-regular text-primary">{text}</span>
    }
  ]

  const userColumns: TableProps['columns'] = [
    {
      title: intl.formatMessage({ id: 'mt.pinzhong' }),
      dataIndex: 'pinzhong',
      key: 'pinzhong',
      width: 320,
      render: (pz) => (
        <span className=" flex gap-1 items-center">
          <img src={pz.img} alt="" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-primary">{pz.pinzhong}</span>
        </span>
      )
    },
    {
      title: `${intl.formatMessage({ id: 'mt.gendanyingkui' })}(${CURRENCY})`,
      dataIndex: 'gendanyingkui',
      key: 'gendanyingkui',
      align: 'left',
      width: 240,
      render: (text) => (
        <span className={classNames('!font-dingpro-medium text-primary', getColorClass(text))}>
          {text > 0 ? '+' : ''}
          {`${formatNum(text)} ${CURRENCY}`}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'mt.gendanjine' }),
      dataIndex: 'gendanjine',
      key: 'gendanjine',
      align: 'left',
      width: 240,
      render: (text) => <span className="!font-dingpro-medium text-primary">{`${formatNum(text)} ${CURRENCY}`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.gensuitianshu' }),
      dataIndex: 'gensuitianshu',
      key: 'gensuitianshu',
      align: 'right',
      render: (text) => <span className="!font-dingpro-medium text-primary">{intl.formatMessage({ id: 'mt.days' }, { count: text })}</span>
    }
  ]

  const [histories, setHistories] = useState(mockHistory)
  const [orders, setOrders] = useState(mockOrder)

  useEffect(() => {
    getTradeFollowFolloerHistoryFollowerOrder({})
  })

  const items2: TabsProps['items'] = useMemo(
    () => [
      {
        key: '2',
        label: intl.formatMessage({ id: 'mt.lishigendan' }),
        children: <TabTable columns={historyColumns} datas={histories} />
      }
    ],
    [histories]
  )

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: intl.formatMessage({ id: 'mt.dangqiangendan' }),
        children: <TabTable columns={orderColumns} datas={orders} />
      },
      {
        key: '2',
        label: intl.formatMessage({ id: 'mt.lishigendan' }),
        children: <TabTable columns={historyColumns} datas={histories} />
      }
    ],
    [histories, orders]
  )

  return {
    items,
    items2,
    onChange
  }
}
