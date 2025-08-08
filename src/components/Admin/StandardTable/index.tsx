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
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

// @ts-ignore
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

export default function OptimizedTable<T extends Record<string, any>, U extends ParamsType = ParamsType>({
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
}: IProps<T, U>) {
  const intl = useIntl()
  const dateRangeRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<ProFormInstance>()
  const [tableColumns, setTableColumns] = useState<ProColumns<T>[]>([])
  const { lng } = useLang()
  const isZh = lng === 'zh-TW'
  const actionRef = useRef<ActionType>(null)

  // 记录列表request请求结果 - 使用useCallback优化
  const [requestResult, setRequestResult] = useState<{ total: number; data: T[]; success: boolean }>({
    total: 0,
    data: [],
    success: true
  })

  const { setHasProList, hasProList } = useModel('global')
  const [showExportWhenData, setShowExportWhenData] = useState(false)
  const themeConfig = useTheme()
  const themeMode = theme || themeConfig.theme.mode
  const isDark = themeMode === 'dark'
  const [showQueryBtn, setShowQueryBtn] = useState(false)

  // 使用useCallback优化函数引用
  const handleExport = useCallback(
    async (searchConfig: Omit<BaseQueryFilterProps, 'submitter' | 'isForm'>) => {
      const values = searchConfig?.form?.getFieldsValue()
      return onExport?.(values)
    },
    [onExport]
  )

  // 使用useCallback优化删除确认函数
  const onDeleteConfirm = useCallback(
    async (record: any) => {
      if (onDelete) {
        onDelete(record)
      } else {
        await action?.del?.({ id: record.id })
        actionRef.current?.reload()
        message.success(intl.formatMessage({ id: 'common.deleteSuccess' }))
      }
    },
    [onDelete, action, intl]
  )

  // 优化实例获取逻辑
  useEffect(() => {
    if (getInstance && formRef.current && actionRef.current) {
      getInstance({
        form: formRef.current,
        action: actionRef.current as ActionType
      })
    }
  }, [getInstance])

  // 优化请求结果处理
  useEffect(() => {
    if (getRequestResult && requestResult.data.length > 0) {
      getRequestResult(requestResult)
    }
  }, [getRequestResult, requestResult])

  // 优化数据源处理
  useEffect(() => {
    const hasData = dataSource?.length > 0
    setHasProList(hasData)
  }, [dataSource, setHasProList])

  // 修复定时器清理问题
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQueryBtn(true)
    }, 100)

    return () => {
      clearTimeout(timer) // 清理定时器
    }
  }, [])

  // 使用useMemo优化proTableOptions
  const proTableOptions: ProTableProps<T, U> = useMemo(() => {
    const options: ProTableProps<T, U> = { search: false }

    if (!hideForm) {
      options.form = {
        colon: false,
        labelWidth: 0,
        ...form
      }
    }

    if (!hideSearch) {
      const getExportBtn = (searchConfig: Omit<BaseQueryFilterProps, 'submitter' | 'isForm'>) => (
        <Export onClick={() => handleExport(searchConfig)} key="export" />
      )

      options.search = {
        searchGutter: 12,
        span: 4,
        submitterColSpanProps: {
          span: showExportBtn ? 4 : 2,
          offset: 0,
          ...((search && search.submitterColSpanProps) || {})
        },
        // @ts-ignore
        optionRender: (searchConfig, props, dom) => {
          return [
            <div key="action" className="flex items-center">
              {showQueryBtn && (
                <div className="flex items-center gap-3">
                  <IconFontButton
                    type="primary"
                    icon="sousuo"
                    loading={loading}
                    onClick={() => searchConfig?.form?.submit()}
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
        options.search = {
          ...options.search,
          submitterColSpanProps: { span: 1, offset: 0 },
          optionRender: (searchConfig) => [getExportBtn(searchConfig)]
        }
      }
    }

    return options
  }, [hideForm, hideSearch, form, search, showExportBtn, showOnlyExportBtn, handleExport, showQueryBtn, loading, intl, showExportWhenData])

  // 优化列处理逻辑，使用useMemo缓存
  const processedColumns = useMemo(() => {
    const processedCols = [...columns]

    // 显示操作项
    if (showOptionColumn && !processedCols.some((v) => v.key === 'option')) {
      processedCols.push({
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
                    <a key="editable" onClick={() => onEditItem?.(record)} className="!text-primary text-sm font-medium">
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
                        onConfirm={() => onDeleteConfirm(record)}
                      />
                    )}
                    {!showDeleteModal && (
                      <Popconfirm
                        title={intl.formatMessage({ id: 'common.confirmDelete' })}
                        onConfirm={() => onDeleteConfirm(record)}
                        key="delete"
                      >
                        <a className="!text-primary font-medium text-sm ml-6">
                          <FormattedMessage id="common.delete" />
                        </a>
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

    processedCols.forEach((v) => {
      // 格式化小数位
      const precision = (v.fieldProps as any)?.precision
      if (isTruthy(precision)) {
        v.renderText = (text) => <span className="text-primary">{formatNum(text, { precision })}</span>
      }

      if (!v.valueType && (v.className || '')?.indexOf('!px-5') === -1) {
        v.className = cn('!px-5', v.className)
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
            dateRangeRef.current = value
          },
          onOpenChange: (open: boolean) => {
            const dates = dateRangeRef.current
            if (!open && dates && Math.abs(moment(dates?.[0]).diff(dates?.[1], 'days')) > 91) {
              dateRangeRef.current = null
              formRef.current?.resetFields(['dates'])
              message.warning(intl.formatMessage({ id: 'mt.shijianbunengdayusangeyue' }))
            }
          }
        }
      }
    })

    return processedCols
  }, [
    columns,
    showOptionColumn,
    opColumnWidth,
    renderOptionColumn,
    hiddenEditBtn,
    hiddenDeleteBtn,
    renderEditBtn,
    onEditItem,
    showDeleteModal,
    setDeleteModalText,
    onDeleteConfirm,
    intl,
    getOpColumnItems
  ])

  // 设置处理后的列
  useEffect(() => {
    setTableColumns(processedColumns)
  }, [processedColumns])

  // 使用useMemo优化样式类
  const classNameWrapper = useEmotionCss(({ token }) => {
    return {
      '.ant-table-content': {
        borderTopLeftRadius: `${isDark ? 0 : 12}px !important`,
        borderTopRightRadius: `${isDark ? 0 : 12}px !important`,
        '&::-webkit-scrollbar': {
          height: isDark ? '4px !important' : `${hasProList ? 7 : 0}px !important`,
          width: 0,
          scrollbarColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 5,
          backgroundColor: `${isDark ? '#17171c' : '#f7f7f7'} !important`,
          background: 'none !important'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'none',
          borderRadius: 0,
          background: `${isDark ? '#17171c' : '#fff'} !important`
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
      '.ant-pagination': {
        marginRight: '0 !important',
        marginTop: '0 !important',
        paddingTop: 16,
        background: 'var(--bg-primary)',
        paddingRight: '10px'
      }
    }
  })

  const darkClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-table-thead > tr > th': {
        background: 'var(--bg-primary) !important',
        border: '0px solid var(--divider-line-color) !important'
      },
      'tr > td': {
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--divider-line-color) !important'
      }
    }
  })

  // 优化请求函数
  const handleRequest = useCallback(
    async (params: U = {} as U, sort: any, filter: any) => {
      const queryParams: any = { ...params }

      if (Object.keys(sort).length) {
        Object.keys(sort).forEach((key) => {
          queryParams.orderBy = sort[key] === 'ascend' ? 'ASC' : 'DESC'
          queryParams.orderByField = key
        })
      }

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
    },
    [action, setHasProList]
  )

  const handleBeforeSearchSubmit = useCallback((params: any) => {
    setLoading(true)
    return params
  }, [])

  const handlePostData = useCallback((data: T[]) => {
    setShowExportWhenData(data?.length > 0)
    setLoading(false)
    return data
  }, [])

  const handleRowClassName = useCallback(
    (record: T, i: number) => {
      if (stripe) {
        return i % 2 === 1 ? 'table-even' : 'table-odd'
      }
      return ''
    },
    [stripe]
  )

  return (
    <ProTable<T, U>
      cardBordered={false}
      columns={tableColumns}
      actionRef={actionRef}
      rowKey="id"
      // @ts-ignore
      options={!hideOptions ? { ...options } : false}
      defaultSize="middle"
      dateFormatter="string"
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: false,
              defaultPageSize: pageSize,
              hideOnSinglePage: true,
              size: 'default',
              ...pagination
            }
      }
      locale={{
        emptyText: !requestResult?.data?.length && !dataSource?.length ? <Empty /> : <div className="h-[200px]"></div>
      }}
      ghost={false}
      scroll={{ x: 1200, ...scroll }}
      request={handleRequest}
      beforeSearchSubmit={handleBeforeSearchSubmit}
      postData={handlePostData}
      cardProps={{
        bodyStyle: { padding: '16px', ...bodyStyle },
        className: '!rounded-2xl border border-gray-150',
        headStyle: { borderRadius: '12px 12px 0px 0px', ...headStyle },
        ...cardProps
      }}
      rowClassName={handleRowClassName}
      className={cn(
        'standard-table',
        classNameWrapper,
        { 'no-table-bordered': !hasTableBordered, [className as string]: className },
        isDark ? darkClassName : ''
      )}
      formRef={formRef}
      dataSource={dataSource}
      {...proTableOptions}
      {...res}
    />
  )
}
