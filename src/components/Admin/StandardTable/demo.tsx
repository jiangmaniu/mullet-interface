import type { ActionType, FormInstance, ProColumns } from '@ant-design/pro-components'
import { createIntl,ProProvider, ProTable, TableDropdown } from '@ant-design/pro-components'
import { request } from '@umijs/max'
import { Space, Tag } from 'antd'
import { useContext, useRef } from 'react'

const enLocale = {
  tableForm: {
    search: 'Query2',
    reset: 'Reset 1',
    submit: 'Submit',
    collapsed: 'Expand',
    expand: 'Collapse',
    inputPlaceholder: 'Please enter',
    selectPlaceholder: 'Please select'
  },
  alert: {
    clear: 'Clear'
  },
  tableToolBar: {
    leftPin: 'Pin to left',
    rightPin: 'Pin to right',
    noPin: 'Unpinned',
    leftFixedTitle: 'Fixed the left',
    rightFixedTitle: 'Fixed the right',
    noFixedTitle: 'Not Fixed',
    reset: 'Reset',
    columnDisplay: 'Column Display',
    columnSetting: 'Settings',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    reload: 'Refresh',
    density: 'Density',
    densityDefault: 'Default',
    densityLarger: 'Larger',
    densityMiddle: 'Middle',
    densitySmall: 'Compact'
  }
}

// 生成 intl 对象
const enUSIntl = createIntl('en_US', enLocale)

export const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export const waitTime = async (time = 100) => {
  await waitTimePromise(time)
}
/**
 * valueType 列表
 * valueType 是 ProComponents 的灵魂，ProComponents 会根据 valueType 来映射成不同的表单项。以下是支持的常见表单项：
 *
 * valueEnum：valueEnum 是最基础的用法， 它支持传入一个 Object 或者是 Map，相比于 options 支持更加丰富的定义
 * fieldProps.options：options 是 antd 定义的标准，但是只有部分组件支持， ProComponents 扩展了组件，使得 select, checkbox, radio, radioButton 都支持了 options, 他们的用法是相同的。
 *
 * 远程数据：
 * 支持组件 Select, TreeSelect, Cascader, Checkbox, Radio, RadioButton
 * 支持参数 request,params,fieldProps.options, valueEnum 来支持远程数据，这几个属性分别有不同的用法。
 *
 * 搜索表单
 * ProTable 会根据列来生成一个 Form，用于筛选列表数据，最后的值会根据通过 request 的第一个参数返回，看起来就像。
 * <ProTable request={(params,sort,filter)=>{ all params}}>
 * Form 的列是根据 valueType 来生成不同的类型,详细的值类型请查看通用配置。
 *
 * 搜索表单自定义 https://procomponents.ant.design/components/table?tab=api&current=1&pageSize=5#%E6%90%9C%E7%B4%A2%E8%A1%A8%E5%8D%95%E8%87%AA%E5%AE%9A%E4%B9%89
 * 当内置的表单项无法满足我们的基本需求，这时候我们就需要来自定义一下默认的组件，我们可以通过 fieldProps 和 renderFormItem 配合来使用。
  fieldProps 可以把 props 透传，可以设置 select 的样式和多选等问题。
  renderFormItem 可以完成重写渲染逻辑，传入 item 和 props 来进行渲染，需要注意的是我们必须要将 props 中的 value 和 onChange 必须要被赋值，否则 form 无法拿到参数。如果你需要自定义需要先了解 antd 表单的工作原理。
 *
  自定义 valueType:https://procomponents.ant.design/components/table?tab=api&current=1&pageSize=5#%E8%87%AA%E5%AE%9A%E4%B9%89-valuetype

 * https://procomponents.ant.design/components/schema#valuetype
 */

type GithubIssueItem = {
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

const columns: ProColumns<GithubIssueItem>[] = [
  // {
  //   title: '标题', // 与 antd 中基本相同，但是支持通过传入一个方法
  //   dataIndex: 'title',
  //   valueType: 'radioButton', // checkbox、radio、radioButton
  //   fieldProps: {
  //     options: ['chapter', 'chapter2']
  //   }
  // },
  // {
  //   title: '标题', // 与 antd 中基本相同，但是支持通过传入一个方法
  //   dataIndex: 'title',
  //   // 传入函数
  //   valueType: (item: any) => ({
  //     type: 'progress',
  //     status: item.status !== 'error' ? 'active' : 'exception'
  //   })
  // },
  {
    title: '标题', // 与 antd 中基本相同，但是支持通过传入一个方法
    dataIndex: 'title',
    valueType: 'select',
    // 通过接口去获取，返回一个promise
    // request ：是一个 promise,需要返回一个 options 相同的数据
    // params ：一般而言 request 是惰性的，params 修改会触发 request 的重新请求。
    // 在实际的使用中 request 增加了一个 5s 缓存，可能会导致数据更新不及时，如果需要频繁更新，建议使用 state+fieldProps.options
    request: async () => [
      { label: '全部', value: 'all' },
      { label: '未解决', value: 'open' },
      { label: '已解决', value: 'closed' },
      { label: '解决中', value: 'processing' }
    ],
    params: {},
    fieldProps: {
      placeholder: '请输入标题'
    },
    formItemProps: {
      label: '这里是form的label' //
    }
  },
  // {
  //   title: '标题', // 与 antd 中基本相同，但是支持通过传入一个方法
  //   dataIndex: 'title',
  //   copyable: true, // 是否支持复制
  //   ellipsis: true, // 是否自动缩略
  //   tooltip: '会在 title列旁边展示一个 icon，hover 之后提示一些信息',
  //   tip: '标题过长会自动收缩',
  //   // 传递给 Form.Item 的配置,可以配置 rules，但是默认的查询表单 rules 是不生效的。需要配置 ignoreRules
  //   formItemProps: {
  //     rules: [
  //       {
  //         required: true,
  //         message: '此项为必填项'
  //       }
  //     ]
  //   },
  //   valueType: 'select',
  //   fieldProps: {
  //     // options: ['chapter', 'chapter2']
  //     options: [
  //       { label: '全部', value: 'all' },
  //       { label: '未解决', value: 'open' },
  //       { label: '已解决', value: 'closed' },
  //       { label: '解决中', value: 'processing' },
  //       {
  //         label: '特殊选项',
  //         value: 'optGroup',
  //         optionType: 'optGroup',
  //         options: [
  //           { label: '不解决', value: 'no' },
  //           { label: '已废弃', value: 'clear' }
  //         ]
  //       }
  //     ]
  //   }
  //   // 查询表单项初始填入值
  //   // initialValue: '测试'
  //   // 类似 table 的 render，第一个参数变成了 dom,增加了第四个参数 action
  //   // renderText: (text: any, record: any, index: number, action: any) => {
  //   //   return text
  //   // }
  //   // 渲染查询表单的输入组件
  //   // renderFormItem: (item, form) => {
  //   //   return <p>123</p>
  //   // }
  // },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true, // 表头的筛选菜单项，当值为 true 时，自动使用 valueEnum 生成
    onFilter: true, //筛选表单，为 true 时使用 ProTable 自带的，为 false 时关闭本地筛选
    ellipsis: true,
    valueType: 'select', // 值的类型,会生成不同的渲染器
    order: 1, // 顶部 查询表单中的权重，权重大排序靠前
    // 查询表单的 props，会透传给表单项,如果渲染出来是 Input,就支持 input 的所有 props，同理如果是 select，也支持 select 的所有 props。也支持方法传入
    // fieldProps: (form: any, config: any) => {
    //   console.log('form', form)
    //   console.log('config', config)
    // },
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
    }
    // 自定义渲染表单
    // renderFormItem: (item, res, form) => {
    //   return <Select placeholder="请选择" {...res} />
    // },

    // 从服务器请求枚举 https://procomponents.ant.design/components/schema#request-%E5%92%8C-params
    // 大部分时候我们是从网络中获取数据，但是获取写一个 hooks 来请求数据还是比较繁琐的，同时还要定义一系列状态，所以我们提供了 request 和 params 来获取数据。
    // request ：是一个 promise,需要返回一个 options 相同的数据
    // params ：一般而言 request 是惰性的，params 修改会触发 request 的重新请求。
    // const request = async () => [
    //   { label: '全部', value: 'all' },
    //   { label: '未解决', value: 'open' },
    //   { label: '已解决', value: 'closed' },
    //   { label: '解决中', value: 'processing' },
    // ];
    // request
    // 配置列的搜索相关，false 为隐藏该项在表单搜索中
    // search: false
    // 在查询表单中不展示此项
    // hideInSearch: true,
    // 在 Form 中不展示此列,当切换表格类型为type=form的时候
    // hideInForm: false,
    // 在 Descriptions 中不展示此列
    // hideInDescriptions: false
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
    )
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true
  },
  {
    title: '创建时间',
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
    fieldProps: {
      placeholder: ['请选择开始时间', '请选择截止时间']
    }
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id)
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' }
        ]}
      />
    ]
  }
]

export default () => {
  const actionRef = useRef<ActionType>()
  const formRef = useRef<FormInstance>()
  const values = useContext(ProProvider)
  return (
    // 国际化，可以修改部分字段，如果和需求不一致的情况下
    <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
      <ProTable<GithubIssueItem>
        // 	封装的 table 的 className
        // tableClassName={}
        // 封装的 table 的 style
        // tableStyle={}
        // Table 和 Search 外围 Card 组件的边框 boolean | {search?: boolean, table?: boolean}
        cardBordered={false}
        // 批量操作需要设置 rowSelection 来开启 总是展示 alert，默认无选择不展示（rowSelection内置属性）
        rowSelection={{ alwaysShowAlert: true }}
        // 幽灵模式，即是否取消表格区域的 padding
        // ghost={false}
        // 防抖时间
        // debounceTime={10}
        // 窗口聚焦时自动重新请求
        // revalidateOnFocus={true}
        columns={columns}
        // Table action 的引用，便于自定义触发
        // 刷新 ref.current.reload();
        // 刷新并清空,页码也会重置，不包括表单 ref.current.reloadAndRest();
        // 重置到默认值，包括表单 ref.current.reset();
        // 清空选中项 ref.current.clearSelected();
        // 开始编辑 ref.current.startEditable(rowKey);
        // 结束编辑 ref.current.cancelEditable(rowKey);
        actionRef={actionRef}
        // 可以获取到查询表单的 form 实例，用于一些灵活的配置
        formRef={formRef}
        // params 是需要自带的参数
        // 这个参数优先级更高，会覆盖查询表单的参数
        // 用于 request 查询的额外参数，一旦变化会触发重新加载
        // params={params}
        // 对象中必须要有 data 和 success，如果需要手动分页 total 也是必需的
        // request 会接管 loading 的设置，同时在查询表单查询和 params 参数发生修改时重新执行。同时 查询表单的值和 params 参数也会带入
        // (params?: {pageSize,current},sort,filter) => {data,success,total}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params = {}, // ProTable 会根据列来生成一个 Form，用于筛选列表数据，最后的值会根据通过 request 的第一个参数返回
          sort,
          filter
        ) => {
          console.log(sort, filter)
          // await waitTime(2000)
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          return request<{
            data: GithubIssueItem[]
          }>('https://proapi.azurewebsites.net/github/issues', {
            params
          })
          // 如果需要转化参数可以在这里进行修改
          // const msg = await myQuery({
          //   page: params.current,
          //   pageSize: params.pageSize,
          // });
          // return {
          //   data: msg.result,
          //   // success 请返回 true，
          //   // 不然 table 会停止解析数据，即使有数据
          //   success: boolean,
          //   // 不传会使用 data 的长度，如果是分页一定要传
          //   total: number,
          // };
        }}
        // 数据加载失败时触发
        // onRequestError={(error: any) => {
        //   console.log('onRequestError', error)
        // }}
        // 对通过 request 获取的数据进行处理	(data: T[]) => T[]
        // postData={(data: T[]) => T[]}
        // defaultData	默认的数据	T[]
        // defaultData={}
        // Table 的数据，protable 推荐使用 request 来加载	T[]
        // dataSource={}
        // Table 的数据发生改变时触发 (dataSource: T[]) => void
        // onDataSourceChange={(dataSource: any) => {
        //   console.log('dataSource', dataSource)
        // }}
        editable={{
          type: 'multiple'
        }}
        // 受控的列状态，可以操作显示隐藏
        // columnsState={{
        //   persistenceKey: 'pro-table-singe-demos',
        //   persistenceType: 'localStorage',
        //   onChange(value) {
        //     console.log('value: ', value)
        //   }
        // }}
        // 可编辑表格的相关配置
        // editable={{}}
        // table 尺寸发生改变
        // onSizeChange={(size: 'default' | 'middle' | 'small') => void}
        // 格式化搜索表单提交数据
        // beforeSearchSubmit={(params: any) => {
        //   console.log('beforeSearchSubmit params: ', params)
        // }}
        // pro-table 类型
        // type="table"
        // antd form 的配置
        // form={{ }}
        // 提交表单时触发
        onSubmit={(params: any) => {
          console.log('onSubmit params', params)
        }}
        // 	重置表单时触发
        // onReset={() => void}
        // 空值时的显示，不设置时显示 -， false 可以关闭此功能
        // columnEmptyText=''
        rowKey="id"
        // 自定义渲染表格函数 (props,dom,domList:{ toolbar,alert,table}) => ReactNode
        // tableRender={(props, dom, domList: any) => {
        //   return <div>12</div>
        // }}
        // 	透传 ListToolBar 配置项
        // toolbar={{}}
        // 自定义表格的主体函数，在表格上面添加一些内容 (props: ProTableProps<T, U>, dataSource: T[]) => ReactNode;
        // tableExtraRender={(props: any, dataSource: any) => {
        //   return <div>自定义表格的主体函数</div>
        // }}
        // 是否显示搜索表单，传入对象时为搜索表单的配置
        search={{
          labelWidth: 'auto'
          // 查询按钮的文本
          // searchText: '',
          // 重置按钮文本
          // resetText:'',
          // 自定义右侧表单搜索处操作栏	((searchConfig,formProps,dom) => ReactNode[])|false
          // optionRender: false
        }}
        // table 工具栏，设为 false 时不显示.传入 function 会点击时触发
        options={{
          setting: {
            listsHeight: 400
          }
        }}
        // 表格默认的 size
        defaultSize="middle"
        // 转化 moment 格式数据为特定类型，false 不做转化 "string" | "number" | ((value: Moment, valueType: string) => string | number) | false
        // dateFormatter=''
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime]
              }
            }
            return values
          }
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page)
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        // 数据加载完成后触发,会多次触发
        onLoad={(dataSource: any) => {
          console.log(1)
        }}
        // loading 被修改时触发，一般是网络请求导致的
        // onLoadingChange={(loading:boolean)=>{}}
        // 渲染工具栏，支持返回一个 dom 数组，会自动增加 margin-right
        // toolBarRender={() => [
        //   <Button
        //     key="button"
        //     icon={<PlusOutlined />}
        //     onClick={() => {
        //       actionRef.current?.reload()
        //       // console.log('formRef.current?.getFieldValue()', formRef.current?.getFieldsValue())
        //     }}
        //     type="primary"
        //   >
        //     新建
        //   </Button>,
        //   <Dropdown
        //     key="menu"
        //     menu={{
        //       items: [
        //         {
        //           label: '1st item',
        //           key: '1'
        //         },
        //         {
        //           label: '2nd item',
        //           key: '1'
        //         },
        //         {
        //           label: '3rd item',
        //           key: '1'
        //         }
        //       ]
        //     }}
        //   >
        //     <Button>
        //       <EllipsisOutlined />
        //     </Button>
        //   </Dropdown>
        // ]}
      />
    </ProProvider.Provider>
  )
}
