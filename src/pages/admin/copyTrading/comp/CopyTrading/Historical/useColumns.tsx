import { useIntl } from '@umijs/max'
import { TableProps } from 'antd'
import classNames from 'classnames'

import { CURRENCY } from '@/constants'
import { formatNum, getColorClass } from '@/utils'

export default () => {
  const intl = useIntl()

  // 订单表格
  const orderColumns: TableProps['columns'] = [
    {
      title: intl.formatMessage({ id: 'mt.pinzhong' }),
      dataIndex: 'symbol',
      key: 'symbol',
      render: (pz, record, index) => {
        console.log(pz)
        return (
          <span className=" flex gap-1 items-center">
            {pz}
            {/* <img src={pz.img} alt="" className="w-8 h-8 rounded-full" />
            <span className=" flex flex-col items-start">
              <span className="text-sm  font-pf-bold text-primary">{pz.pinzhong}</span>
              <span className="flex items-center gap-1">
                <Tags size="tiny" color={pz.zhuangtai === '空' ? 'red' : 'green'}>
                  {pz.zhuangtai}
                </Tags>
                <Tags size="tiny" color="gray">
                  {pz.conf} {pz.leverageMultiple}
                </Tags>
              </span>
            </span> */}
          </span>
        )
      }
    },
    {
      title: `${intl.formatMessage({ id: 'mt.yingkui' })}(${CURRENCY})`,
      dataIndex: 'yingkui',
      key: 'yingkui',
      render: (text) => (
        <span className={classNames(' font-dingpro-medium  text-primary ', getColorClass(text))}>
          {text > 0 ? '+' : ''}
          {formatNum(text)}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'mt.shouxufei' }),
      dataIndex: 'shouxufei',
      key: 'shouxufei',
      render: (text) => <span className={classNames('!font-dingpro-regular text-primary')}>{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.chengjiaojiage' }),
      dataIndex: 'chengjiaojiage',
      key: 'chengjiaojiage',
      render: (text) => <span className="!font-dingpro-regular text-primary">{formatNum(text)}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.kaicangjiage' }),
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
      render: (text) => <span className="!font-dingpro-regular text-primary">{`${formatNum(text)}`}</span>
    },
    {
      title: intl.formatMessage({ id: 'mt.jiaoyishijian' }),
      dataIndex: 'jiaoyishijian',
      key: 'jiaoyishijian',
      align: 'end',
      render: (text) => <span className="!font-dingpro-regular text-primary">{text}</span>
    }
  ]

  return orderColumns
}
