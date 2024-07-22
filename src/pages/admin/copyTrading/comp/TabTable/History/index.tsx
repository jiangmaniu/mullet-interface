import './style.less'

import { useIntl } from '@umijs/max'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import classNames from 'classnames'

import { CURRENCY } from '@/constants'
import { formatNum, getColorClass } from '@/utils'

import { data } from './mock'
const TabTableHistory = () => {
  const intl = useIntl()

  const columns: TableProps['columns'] = [
    {
      title: intl.formatMessage({ id: 'mt.pinzhong' }),
      dataIndex: 'pinzhong',
      key: 'pinzhong',
      render: (pz) => (
        <span className=" flex gap-1 items-center">
          <img src={pz.img} alt="" className="w-8 h-8 rounded-full" />
          <span className=" flex flex-col items-start">
            <span className="text-sm font-medium text-black-800">{pz.pinzhong}</span>
            <span>
              <span
                className={classNames(
                  'text-xs font-light border-none px-1 rounded',
                  pz.zhuangtai === '空' ? 'text-red bg-red bg-opacity-20' : 'text-green bg-green bg-opacity-20'
                )}
              >
                {pz.zhuangtai}
              </span>{' '}
              <span className="text-xs font-light border-none px-1 rounded bg-gray-120">{pz.desc}</span>
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
        <span className={classNames('!font-dingpro-medium text-black-900', getColorClass(text))}>
          {text > 0 ? '+' : ''}
          {formatNum(text)}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'mt.pingcangshijian' }),
      dataIndex: 'pingcangshijian',
      key: 'pingcangshijian',
      render: (text) => <span className="!font-dingpro-medium text-black-900">{text}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.kaicangshijian' }),
      dataIndex: 'kaicangshijian',
      key: 'kaicangshijian',
      render: (text) => <span className="!font-dingpro-medium text-black-900">{text}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.zuidachicangliang' }),
      dataIndex: 'zuidachicangliang',
      key: 'zuidachicangliang',
      render: (text) => <span className="!font-dingpro-medium text-black-900">{`${formatNum(text)} BTC`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.pingcangjunjia' }),
      dataIndex: 'pingcangjunjia',
      key: 'pingcangjunjia',
      render: (text) => <span className="!font-dingpro-medium text-black-900">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.kaicangjunjia' }),
      dataIndex: 'kaicangjunjia',
      key: 'kaicangjunjia',
      render: (text) => <span className="!font-dingpro-medium text-black-900">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.pingcangshuliang' }),
      dataIndex: 'pingcangshuliang',
      key: 'pingcangshuliang',
      render: (text) => <span className="!font-dingpro-medium text-black-900">{`${formatNum(text)} BTC`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.gensuirenshu' }),
      dataIndex: 'gensuirenshu',
      key: 'gensuirenshu',
      render: (text) => <span className="!font-dingpro-medium text-black-900">{formatNum(text)}</span>
    }
  ]

  return <Table columns={columns} dataSource={data} className="className" />
}

export default TabTableHistory
