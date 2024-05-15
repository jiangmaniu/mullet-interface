import { ProColumns } from '@ant-design/pro-components'
import { Space, Tag, Typography } from 'antd'

type IDataItem = {
  url: string
  id: number
  number: number
  title: string
  labels: {
    name: string
    color: string
  }[]
  state: string
  comments: number
  created_at: string
  updated_at: string
  closed_at?: string
}

const columns: ProColumns<IDataItem>[] = [
  {
    title: '标题', // 与 antd 中基本相同，但是支持通过传入一个方法
    dataIndex: 'title',
    hideInSearch: true, // 在 table的查询表单 中隐藏
    ellipsis: true,
    fieldProps: {
      placeholder: '请输入操作用户2'
    },
    formItemProps: {
      label: '' // 去掉form label
    },
    fixed: 'left',
    width: 200
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true, // 表头的筛选菜单项，当值为 true 时，自动使用 valueEnum 生成
    onFilter: true, //筛选表单，为 true 时使用 ProTable 自带的，为 false 时关闭本地筛选
    ellipsis: true,
    valueType: 'select', // 值的类型,会生成不同的渲染器
    order: 1,
    hideInSearch: true,
    valueEnum: {
      // 值的枚举，会自动转化把值当成 key 来取出要显示的内容
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error'
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true
      },
      processing: {
        text: '解决中',
        status: 'Processing'
      }
    },
    width: 300
  },
  {
    dataIndex: 'state',
    filters: true, // 表头的筛选菜单项，当值为 true 时，自动使用 valueEnum 生成
    onFilter: true, //筛选表单，为 true 时使用 ProTable 自带的，为 false 时关闭本地筛选
    ellipsis: true,
    valueType: 'select', // 值的类型,会生成不同的渲染器
    order: 1,
    hideInTable: true,
    valueEnum: {
      // 值的枚举，会自动转化把值当成 key 来取出要显示的内容
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error'
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true
      },
      processing: {
        text: '解决中',
        status: 'Processing'
      }
    },
    hideInSearch: true,
    fieldProps: {
      placeholder: '请选择交易品种212'
    },
    width: 300
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_)
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
    width: 300
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
    width: 300
  },
  {
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      // 转化值的 key, 一般用于时间区间的转化
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1]
        }
      }
    },
    hideInSearch: true,
    fieldProps: {
      placeholder: ['开始时间', '截止时间']
    },
    width: 300
  },
  {
    dataIndex: 'created_at1',
    title: '创建时间',
    valueType: 'dateRange',
    hideInTable: false,
    search: {
      // 转化值的 key, 一般用于时间区间的转化
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1]
        }
      }
    },
    hideInSearch: false,
    fieldProps: {
      placeholder: ['开始时间', '截止时间']
    },
    width: 300
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    align: 'center',
    fixed: 'right',
    render: (text, record, _, action) => (
      <Space>
        <Typography.Link>Action1</Typography.Link>
        <Typography.Link>Action2</Typography.Link>
      </Space>
    ),
    width: 150
  }
]

export default columns
