import { useIntl } from '@umijs/max'
import { TableProps, TabsProps } from 'antd'
import classNames from 'classnames'

import { CURRENCY } from '@/constants'
import { formatNum, getColorClass } from '@/utils'

import TabList from '../comp/TabsTable/List'
import { IListItemTypes } from '../comp/TabsTable/List/ListItem'
import TabTable from '../comp/TabsTable/Table'
import { mockHistory, orders } from './mockTabTable'

export const useTabsConfig = () => {
  const intl = useIntl()

  const onChange = (key: string) => {
    console.log(key)
  }

  // 进行中
  const cols1: IListItemTypes[] = [
    {
      format: {
        id: 'mt.jingyingkui'
      },
      currency: true,
      color: true,
      prefix: true,
      field: 'jingyingkui'
    },
    {
      format: {
        id: 'mt.gendanjine'
      },
      currency: true,
      color: true,
      prefix: true,
      field: 'gendanjine'
    },
    {
      format: {
        id: 'mt.baozhengjinyue'
      },
      field: 'baozhengjinyue'
    },
    {
      format: {
        id: 'mt.yishixianyingkui'
      },
      field: 'yishixianyingkui'
    },
    {
      format: {
        id: 'mt.weishixianyingkui'
      },
      field: 'weishixianyingkui'
    },
    {
      format: {
        id: 'mt.fenrunjine'
      },
      field: 'fenrunjine'
    }
  ]

  // 已结束
  const cols2: IListItemTypes[] = [
    {
      format: {
        id: 'mt.jingyingkui'
      },
      currency: true,
      color: true,
      prefix: true,
      field: 'jingyingkui'
    },
    {
      format: {
        id: 'mt.yishixianyingkui'
      },
      currency: true,
      field: 'yishixianyingkui'
    },
    {
      format: {
        id: 'mt.gensuitianshui'
      },
      suffix: true,
      showSuffix: (item) => {
        return intl.formatMessage({ id: 'mt.days' }, { count: item.gensuitianshu })
      }
    },
    {
      format: {
        id: 'mt.gensuikaishishijian'
      },
      suffix: true,
      showSuffix: (item) => {
        return item.gensuikaishishijian
      }
    },
    {
      format: {
        id: 'mt.gensuijieshushijian'
      },
      suffix: true,
      showSuffix: (item) => {
        return item.gensuijieshushijian
      }
    },
    {
      format: {
        id: 'mt.fenrunjine'
      },
      field: 'fenrunjine'
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

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: intl.formatMessage({ id: 'mt.jinxingzhong' }),
      children: <TabList datas={orders} columns={cols1} />
    },
    {
      key: '2',
      label: intl.formatMessage({ id: 'mt.yijieshu' }),
      children: <TabList datas={orders} columns={cols2} />
    },
    {
      key: '3',
      label: intl.formatMessage({ id: 'mt.lishicangwei' }),
      children: <TabTable columns={historyColumns} datas={mockHistory} />
    }
  ]

  return {
    items,
    onChange
  }
}
