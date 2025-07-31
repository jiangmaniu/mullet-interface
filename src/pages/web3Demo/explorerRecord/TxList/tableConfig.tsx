import { ellipsify } from '@/utils'
import { push } from '@/utils/navigator'
import { ProColumns } from '@ant-design/pro-components'
import dayjs from 'dayjs'

export const getColumns = (): ProColumns<any>[] => {
  return [
    {
      title: 'signature', // 与 antd 中基本相同，但是支持通过传入一个方法
      dataIndex: 'signature',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: true,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      fixed: 'left',
      width: 120,
      renderText(text, record, index, action) {
        // return <ExplorerLink path={`tx/${record.signature}`} label={ellipsify(record.signature, 8)} />
        return <a onClick={() => push(`/explorer-test/tx/${record.signature}`)}>{ellipsify(record.signature, 8)}</a>
      }
    },
    {
      title: 'block',
      dataIndex: 'slot',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      renderText(text, record, index, action) {
        // return <ExplorerLink path={`block/${record.slot}`} label={record.slot.toString()} />
        return <a onClick={() => push(`/explorer-test/block/${record.slot}`)}>{record.slot.toString()}</a>
      }
    },
    {
      title: 'blockTime',
      dataIndex: 'blockTime',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      renderText(text, record, index, action) {
        return <span>{dayjs((record.blockTime ?? 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: 'status',
      dataIndex: 'status',
      hideInSearch: true, // 在 table的查询表单 中隐藏
      ellipsis: false,
      copyable: false,
      fieldProps: {
        placeholder: ''
      },
      formItemProps: {
        label: '' // 去掉form label
      },
      width: 120,
      renderText(text, record, index, action) {
        return <span>{record.err ? 'Failed' : 'Success'}</span>
      }
    }
  ]
}
