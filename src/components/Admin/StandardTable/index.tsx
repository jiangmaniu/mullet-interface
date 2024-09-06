/* eslint-disable simple-import-sort/imports */
import {
  ActionType,
  BaseQueryFilterProps,
  ProCardProps,
  ProColumns,
  ProFormInstance,
  ProFormProps,
  ProTable,
  ProTableProps,
  QueryFilterProps
} from '@ant-design/pro-components'
import type { ParamsType } from '@ant-design/pro-provider'
import type { SearchConfig } from '@ant-design/pro-table/es/components/Form/FormRender'
import type { OptionConfig } from '@ant-design/pro-table/es/components/ToolBar'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { FormInstance, Popconfirm, TablePaginationConfig, message } from 'antd'
import { type TableProps as RcTableProps } from 'antd/es/table/InternalTable'
import moment from 'moment'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { IconFontButton } from '@/components/Base/Button'
import DeleteConfirmModal from '@/components/Base/DeleteConfirmModal'
import Empty from '@/components/Base/Empty'
import SelectSuffixIcon from '@/components/Base/SelectSuffixIcon'
import { useLang } from '@/context/languageProvider'

import { IThemeMode, useTheme } from '@/context/themeProvider'
import { formatNum, isTruthy } from '@/utils'
import { cn } from '@/utils/cn'
import Export from './Export'

export type Instance = {
  /**表单实例 */
  form?: FormInstance
  /**actionType */
  action?: ActionType
}

interface IProps<T, U> extends ProTableProps<T, U> {
  /**@name 表格 */
  columns: ProColumns<T>[]
  /**@name 默认分页数量 */
  pageSize?: number
  /**@name 分页配置 */
  pagination?: false | TablePaginationConfig
  /**@name 配置 */
  options?: false | OptionConfig
  /**@name 是否隐藏options配置 */
  hideOptions?: boolean
  /**@name 搜索表单配置 */
  search?: false | SearchConfig
  /**@name 是否隐藏search表单配置 */
  hideSearch?: boolean
  /**@name 仅仅只有导出按钮 */
  showOnlyExportBtn?: boolean
  /**@name 是否隐藏form配置 */
  hideForm?: boolean
  /**@name 基本配置与 antd Form 相同, 但是劫持了 form onFinish 的配置 */
  form?: Omit<ProFormProps & QueryFilterProps, 'form'>
  /**@name 是否显示导出按钮 */
  showExportBtn?: boolean
  scroll?: RcTableProps<T>['scroll'] & {
    scrollToFirstRowOnChange?: boolean
  }
  /**导出 */
  onExport?: (values?: any) => void
  /**导入 */
  onImport?: () => void
  /**斑马线表格 */
  stripe?: boolean
  /**去掉表格底部边框 */
  hasTableBordered?: boolean
  /**表单、表格等实例 */
  getInstance?: (instance: Instance) => void
  /**table cardProps body 样式 */
  bodyStyle?: React.CSSProperties
  /**table cardProps 头部 样式 */
  headStyle?: React.CSSProperties
  /**表格样式类名 */
  className?: string
  getOpColumnItems?: (record: T, actionRef: ActionType, formRef?: FormInstance) => ReactNode[]
  opColumnWidth?: number
  hiddenDeleteBtn?: boolean
  hiddenEditBtn?: boolean
  /**列表增删改接口 */
  action?: {
    query: (params: U) => void
    create?: (params: U) => void
    update?: (params: U & { id: string | number }) => void
    del?: (params: any) => void
    info?: (params: any) => Promise<any>
  }
  /**是否显示操作列 */
  showOptionColumn?: boolean
  /**处理点击编辑 */
  onEditItem?: (record: T) => void
  /**渲染编辑按钮 */
  renderEditBtn?: (record: T) => React.ReactNode
  /**定义渲染操作栏 */
  renderOptionColumn?: (dom: React.ReactNode, entity: T, index: number) => React.ReactNode
  onDelete?: (record: T) => void
  /**搜索区域表单背景颜色 */
  searchFormBgColor?: string
  /**展示删除弹窗 */
  showDeleteModal?: boolean
  setDeleteModalText?: (record: T) => React.ReactNode
  cardProps?: ProCardProps
  /**获取request返回的结果 */
  getRequestResult?: (result: { total: number; data: T[]; success: boolean }) => void
  dataSource?: any
  /**主题模式 */
  theme?: IThemeMode
}

export default <T extends Record<string, any>, U extends ParamsType = ParamsType>({
  columns = [],
  pageSize = 10,
  pagination = {},
  scroll = {},
  options = false,
  hideOptions = true,
  search = false,
  hideSearch = false,
  form,
  hideForm = false,
  showExportBtn = false,
  showOnlyExportBtn = false,
  onExport,
  onImport,
  stripe = true,
  hasTableBordered = false,
  getInstance,
  bodyStyle,
  headStyle,
  className,
  getOpColumnItems,
  hiddenDeleteBtn = false,
  hiddenEditBtn = false,
  showOptionColumn = false,
  opColumnWidth,
  action,
  onEditItem,
  renderOptionColumn,
  renderEditBtn,
  onDelete,
  searchFormBgColor,
  setDeleteModalText,
  showDeleteModal,
  cardProps,
  getRequestResult,
  dataSource,
  theme,
  ...res
}: IProps<T, U>) => {
  const proTableOptions: ProTableProps<T, U> = { search: false }
  const intl = useIntl()
  const dateRangeRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<ProFormInstance>()
  const [tableColumns, setTableColumns] = useState<ProColumns<T>[]>([])
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'
  const actionRef = useRef<ActionType>(null)
  // 记录列表request请求结果
  const [requestResult, setRequestResult] = useState({} as { total: number; data: T[]; success: boolean })
  const { setHasProList, hasProList } = useModel('global')
  const [showExportWhenData, setShowExportWhenData] = useState(false)
  const themeConfig = useTheme()
  const themeMode = theme || themeConfig.theme
  const isDark = themeMode === 'dark'

  const [showQueryBtn, setShowQueryBtn] = useState(false) // 避免切换页面，表单项没渲染出来，先出现查询按钮，页面闪动

  const handleExport = async (searchConfig: Omit<BaseQueryFilterProps, 'submitter' | 'isForm'>) => {
    const values = searchConfig?.form?.getFieldsValue()
    return onExport?.(values)
  }

  useEffect(() => {
    setTimeout(() => {
      setShowQueryBtn(true)
    }, 100)
  }, [])

  useEffect(() => {
    getInstance?.({
      form: formRef.current,
      action: actionRef.current as ActionType
    })
  }, [formRef.current])

  useEffect(() => {
    getRequestResult?.(requestResult)
  }, [requestResult])

  useEffect(() => {
    setHasProList(dataSource?.length > 0)
  }, [dataSource])

  // 格式化参数
  // antd form 的配置
  if (!hideForm) {
    // 配合 label 属性使用，表示是否显示 label 后面的冒号
    // 标签宽度设置为0
    proTableOptions.form = {
      // 设置默认配置
      colon: false, // 配合 label 属性使用，表示是否显示 label 后面的冒号
      labelWidth: 0, // 文字标签宽
      ...form
    }
  }
  if (!hideSearch) {
    const getExportBtn = (searchConfig: Omit<BaseQueryFilterProps, 'submitter' | 'isForm'>) => (
      <Export onClick={() => handleExport(searchConfig)} key="export" />
    )
    // table顶部的搜索表单配置
    proTableOptions.search = {
      // 设置默认配置
      searchGutter: 12, // 查询表单Item项栅格间隔,
      span: 4, // 控制搜索表单的宽 col ant-col-5
      // 控制 查询、重置按钮距离左侧的距离
      submitterColSpanProps: { span: showExportBtn ? 4 : 2, offset: 0, ...((search && search.submitterColSpanProps) || {}) },
      optionRender: (searchConfig, props, dom) => {
        return [
          <div key="action" className="flex items-center">
            {showQueryBtn && (
              <div className="flex items-center gap-3">
                {/* {dom.reverse()} */}
                <IconFontButton
                  type="primary"
                  icon="sousuo"
                  loading={loading}
                  onClick={() => {
                    searchConfig?.form?.submit()
                  }}
                  style={{ paddingLeft: 10 }}
                >
                  {intl.formatMessage({ id: 'common.search' })}
                </IconFontButton>
                <IconFontButton
                  icon="qingli"
                  onClick={() => {
                    searchConfig?.form?.resetFields()
                    searchConfig?.form?.submit()
                  }}
                  style={{ paddingLeft: 10 }}
                >
                  {intl.formatMessage({ id: 'common.reset' })}
                </IconFontButton>
                {showExportWhenData && showExportBtn && getExportBtn(searchConfig)}
              </div>
            )}
          </div>
        ]
      },
      style: { background: 'var(--bg-base-gray)', padding: 0 },
      ...search
    }
    if (showOnlyExportBtn) {
      proTableOptions.search = {
        ...proTableOptions.search,
        submitterColSpanProps: {
          span: 1,
          offset: 0
        },
        optionRender: (searchConfig, props, dom) => {
          return [getExportBtn(searchConfig)]
        }
      }
    }
  }

  const onDeleteConfirm = async (record: any) => {
    if (onDelete) {
      onDelete(record)
    } else {
      await action?.del?.({ id: record.id })
      // 删除重构刷新列表
      actionRef.current?.reload()
      message.success(intl.formatMessage({ id: 'common.deleteSuccess' }))
    }
  }

  useEffect(() => {
    // 显示操作项
    if (showOptionColumn && !columns.some((v) => v.key === 'option')) {
      columns.push({
        title: <FormattedMessage id="common.op" />,
        key: 'option',
        fixed: 'right',
        width: opColumnWidth || 120,
        align: 'right',
        hideInForm: true,
        hideInSearch: true,
        render: (text, record, _, _action) => [
          <>
            {renderOptionColumn?.(text, record, _)}
            {!renderOptionColumn && (
              <>
                {!hiddenEditBtn &&
                  (renderEditBtn ? (
                    renderEditBtn(record)
                  ) : (
                    <a
                      key="editable"
                      onClick={async () => {
                        onEditItem?.(record)
                      }}
                      className="!text-primary text-sm font-medium"
                    >
                      <FormattedMessage id="common.bianji" />
                    </a>
                  ))}
                {!hiddenDeleteBtn && (
                  <>
                    {showDeleteModal && (
                      <DeleteConfirmModal
                        trigger={
                          <a className="!text-primary font-medium text-sm ml-6">
                            <FormattedMessage id="common.delete" />
                          </a>
                        }
                        text={() => setDeleteModalText?.(record)}
                        onConfirm={() => {
                          onDeleteConfirm(record)
                        }}
                      />
                    )}
                    {!showDeleteModal && (
                      <Popconfirm
                        title={intl.formatMessage({ id: 'common.confirmDelete' })}
                        onConfirm={() => {
                          onDeleteConfirm(record)
                        }}
                        key="delete"
                      >
                        <a className="!text-primary font-medium text-sm ml-6">
                          <FormattedMessage id="common.delete" />
                        </a>
                        {/* <LoadingOutlined /> */}
                      </Popconfirm>
                    )}
                  </>
                )}
              </>
            )}
          </>,
          ...(getOpColumnItems?.(record, actionRef.current as ActionType, formRef.current as FormInstance) || [])
        ]
      })
    }

    columns.forEach((v) => {
      // 格式化小数位
      // @ts-ignore
      const precision = v.fieldProps?.precision
      if (isTruthy(precision)) {
        v.renderText = (text, record, index, action) => {
          return <span className="text-primary">{formatNum(text, { precision })}</span>
        }
      }
      if (!v.valueType && (v.className || '')?.indexOf('!px-5') === -1) {
        v.className = cn('!px-5', v.className) // 统一修改单元格间距
      }

      // 多语言 统一修改单元格宽度
      if (!isZh) {
        v.width = v.width ? Number(v.width) + 40 : v.width
      }

      if (v.valueType === 'select') {
        v.fieldProps = {
          showSearch: true,
          ...v.fieldProps,
          suffixIcon: <SelectSuffixIcon opacity={0.4} />
        }
      }
      // 统一限制时间选择
      if (v.valueType === 'dateRange') {
        v.fieldProps = {
          ...v.fieldProps,
          onCalendarChange: (value: any) => {
            console.log('val', value)
            dateRangeRef.current = value
          },
          // 监听日期选择面板打开状态
          onOpenChange: (open: boolean) => {
            const dates = dateRangeRef.current
            setTimeout(() => {
              if (!open && dates && Math.abs(moment(dates?.[0]).diff(dates?.[1], 'days')) > 91) {
                // 当天在内和之前90天
                dateRangeRef.current = null
                // 重置日期表单
                formRef.current?.resetFields(['dates'])

                message.warning(intl.formatMessage({ id: 'mt.shijianbunengdayusangeyue' }))
              }
            }, 300)
          }
        }
      }
    })
    setTableColumns(columns)
  }, [columns.length])

  // @ts-ignore
  const classNameWrapper = useEmotionCss(({ token }) => {
    return {
      // 表格圆角
      '.ant-table-content': {
        borderTopLeftRadius: `${isDark ? 0 : 12}px !important`,
        borderTopRightRadius: `${isDark ? 0 : 12}px !important`,
        '&::-webkit-scrollbar': {
          height: isDark ? '4px !important' : `${hasProList ? 7 : 0}px !important`,
          width: 0,
          overflowY: 'auto'
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 5,
          backgroundColor: `${isDark ? '#17171c' : '#f7f7f7'} !important`
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 0,
          borderRadius: 0,
          background: `${isDark ? '#17171c' : '#fff'}  !important`
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(0, 0, 0, 0.4) !important',
          borderRadius: 5,
          boxShadow: 'inset 0 0 5px rgba(239, 239, 239, 1)'
        }
      },
      '.ant-form': {
        background: `${searchFormBgColor || 'rgb(248, 248, 248)'} !important`
      },
      // 设置表头圆角样式
      '.ant-table-container table > thead > tr:first-child > *:first-child': {
        borderTopLeftRadius: `${isDark ? 0 : 12}px !important`
      },
      '.ant-table-container table > thead > tr:last-child > *:last-child': {
        borderTopRightRadius: `${isDark ? 0 : 12}px !important`
      },
      '.ant-table-thead > tr > th': {
        paddingTop: '12px !important',
        paddingBottom: '12px !important'
      },
      '.ant-table-footer': {
        background: 'transparent !important'
      },
      // 去掉表头列之间的分割线
      '.ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before':
        {
          width: '0 !important'
        },
      '.ant-pagination': {
        marginRight: '10px !important'
      }
    }
  })
  const darkClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-table-thead > tr > th': {
        background: 'var(--bg-primary) !important',
        borderBottom: '1px solid var(--divider-line-color) !important'
      },
      'tr > td': {
        background: 'var(--bg-primary) !important',
        borderBottom: '1px solid var(--divider-line-color) !important'
      }
    }
  })

  return (
    <ProTable<T, U>
      cardBordered={false}
      columns={tableColumns}
      actionRef={actionRef}
      rowKey="id"
      // false则不显示table工具栏
      options={!hideOptions ? { ...options } : false}
      // 表格默认的 size
      defaultSize="middle"
      dateFormatter="string"
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: false,
              defaultPageSize: pageSize,
              hideOnSinglePage: true, // 在没有数据或只有一页数据时隐藏分页栏
              size: 'default',
              ...pagination
            }
      }
      locale={{ emptyText: <Empty /> }}
      // 幽灵模式，是否取消表格区域的 padding
      ghost={false}
      scroll={{ x: 1200, ...scroll }}
      request={async (
        // params:{pageSize,current} ，这两个参数是 antd 的规范。ProTable 会根据列来生成一个 Form，用于筛选列表数据，最后的值会根据通过 request 的第一个参数返回
        params = {} as U,
        sort,
        filter
      ) => {
        const queryParams = {
          ...params
        }
        console.log(sort, filter)

        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化、如果需要转化参数可以在这里进行修改
        const res = (await action?.query(queryParams)) as any

        const records = res?.data?.records || []
        const isArray = Array.isArray(res?.data)
        const dataList = isArray ? res.data : records
        const total = isArray ? dataList.length : res?.data?.total

        const result = {
          data: res?.data?.length ? res.data : dataList,
          success: res?.success,
          total: res?.total ? res.total : total
        }
        setHasProList(result.data?.length > 0)

        setRequestResult(result)

        return result
        // return request<{
        //   data: AgentReport.UserCloseReportListItem[]
        // }>('https://proapi.azurewebsites.net/github/issues', {
        //   params
        // })
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
      // 搜索前参数统一处理入口
      beforeSearchSubmit={(params) => {
        console.log('params', params)
        setLoading(true)
        return params
      }}
      postData={(data: T[]) => {
        setShowExportWhenData(data?.length > 0)
        setLoading(false)
        return data
      }}
      cardProps={{
        bodyStyle: { padding: '16px', ...bodyStyle },
        className: '!rounded-2xl border border-gray-150',
        headStyle: { borderRadius: '12px 12px 0px 0px', ...headStyle },
        ...cardProps
      }}
      rowClassName={(record, i) => {
        if (stripe) {
          // 添加斑马线
          return i % 2 === 1 ? 'table-even' : 'table-odd'
        }
        return ''
      }}
      // 自定义渲染搜索表单区域，不满足需求考虑重写搜索表单
      // searchFormRender={(props) => {
      //   return (
      //     <Form
      //       onFinish={(value) => {
      //         console.log('values', value)
      //       }}
      //       className="!mb-3"
      //     >
      //       <div className="flex items-center justify-between">
      //         <div className="flex items-center gap-3">
      //           <Form.Item className="w-[200px]" name="test1">
      //             <ProFormSelect options={[{ value: 'test1', label: '测试1' }]} />
      //           </Form.Item>
      //           <Form.Item className="w-[200px]" name="test2">
      //             <ProFormSelect options={[{ value: 'test2', label: '测试2' }]} />
      //           </Form.Item>
      //           <Form.Item className="w-[200px]" name="test3">
      //             <ProFormSelect options={[{ value: 'test3', label: '测试3' }]} />
      //           </Form.Item>
      //           <div className="flex items-center gap-3">
      //             <Button type="primary" htmlType="submit">
      //               查询
      //             </Button>
      //             <Button>重置</Button>
      //           </div>
      //         </div>
      //         <div>客户数量：9001</div>
      //       </div>
      //     </Form>
      //   )
      // }}
      className={cn(
        'standard-table',
        classNameWrapper,
        { 'no-table-bordered': !hasTableBordered, [className as string]: true },
        className,
        isDark ? darkClassName : ''
      )}
      formRef={formRef}
      dataSource={dataSource}
      {...proTableOptions}
      {...res}
    />
  )
}
