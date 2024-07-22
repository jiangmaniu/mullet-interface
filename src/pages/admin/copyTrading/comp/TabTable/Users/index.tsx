import './style.less'

import { FormattedMessage, useIntl } from '@umijs/max'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import classNames from 'classnames'

import { CURRENCY } from '@/constants'
import { formatNum, getColorClass } from '@/utils'

import { data } from './mock'
const TabTableUsers = () => {
  const intl = useIntl()

  const columns: TableProps['columns'] = [
    {
      title: intl.formatMessage({ id: 'mt.pinzhong' }),
      dataIndex: 'pinzhong',
      key: 'pinzhong',
      width: 320,
      render: (pz) => (
        <span className=" flex gap-1 items-center">
          <img src={pz.img} alt="" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-black-800">{pz.pinzhong}</span>
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
        <span className={classNames('!font-dingpro-medium text-black-900', getColorClass(text))}>
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
      render: (text) => <span className="!font-dingpro-medium text-black-900">{`${formatNum(text)} ${CURRENCY}`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.gensuitianshu' }),
      dataIndex: 'gensuitianshu',
      key: 'gensuitianshu',
      align: 'right',
      render: (text) => (
        <span className="!font-dingpro-medium text-black-900">
          <FormattedMessage id={'mt.days'} values={{ count: text }} />
        </span>
      )
    }
  ]

  return <Table columns={columns} dataSource={data} className="className" />
}

export default TabTableUsers
