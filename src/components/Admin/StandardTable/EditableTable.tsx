import {
  EditableFormInstance,
  EditableProTable,
  EditableProTableProps,
  ParamsType,
  ProColumns,
  RowEditableConfig
} from '@ant-design/pro-components'
import { RecordCreatorProps } from '@ant-design/pro-table/es/components/EditableTable'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
import { ButtonProps, Popconfirm } from 'antd'
import { NamePath } from 'antd/es/form/interface'
import { FormInstance } from 'antd/lib'
import classNames from 'classnames'
import { cloneDeep } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'

import Empty from '@/components/Base/Empty'

// @ts-ignore
interface IProps<T, U> extends EditableProTableProps<T, U> {
  /**@name 表格 */
  columns?: ProColumns<T>[]
  editable?: RowEditableConfig<T>
  /** @name 新建按钮的设置 */
  recordCreatorProps?:
    | (RecordCreatorProps<any> &
        ButtonProps & {
          creatorButtonText?: React.ReactNode
        })
    | false
  /**是否显示操作列 */
  showOptionColumn?: boolean
  opColumnWidth?: number
  form?: FormInstance
  /**隐藏复制按钮 */
  hiddenCopyBtn?: boolean
  /**隐藏新增按钮 */
  hiddenAddBtn?: boolean
  /**隐藏表头背景颜色 */
  hiddenHeaderBg?: boolean
  /**自定义表格边框，带有圆角 */
  showCustomBordered?: boolean
  /**操作栏对齐方式 */
  optionColumnAlign?: 'left' | 'right' | 'center'
  onRowSave?: (key: any, row: any) => void
  onRowCancel?: (key: any, row: any) => void
  onRowDelete?: (key: any, row: any) => void
  /**初始值 */
  initialValue?: any[]
  /**表单的name */
  name?: NamePath
  /**表格边框颜色 */
  borderColor?: 'light' | 'weak'
  /**隐藏操作栏删除按钮 */
  hiddenDeleteBtn?: boolean
}

export default <T extends Record<string, any>, U extends ParamsType>({
  columns = [],
  editable,
  recordCreatorProps,
  showOptionColumn = true,
  opColumnWidth,
  hiddenCopyBtn = true,
  hiddenAddBtn = false,
  form,
  name,
  hiddenHeaderBg = true,
  showCustomBordered = true,
  optionColumnAlign,
  onRowSave,
  onRowCancel,
  onRowDelete,
  initialValue,
  borderColor = 'light',
  hiddenDeleteBtn,
  ...res
}: IProps<T, U>) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<readonly T[]>([])
  const editorFormRef = useRef<EditableFormInstance<T>>()
  const [currentRow, setCurrentRow] = useState<any>(undefined) // 点击编辑保存当前行数据

  const intl = useIntl()

  useEffect(() => {
    if (initialValue?.length) {
      setDataSource(initialValue)
    }
  }, [initialValue])

  // 显示操作项
  if (showOptionColumn && !columns.some((v) => v.key === 'option')) {
    columns.push({
      title: <FormattedMessage id="common.op" />,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: opColumnWidth || 120,
      align: optionColumnAlign || 'center',
      hideInForm: true,
      hideInSearch: true,
      render: (text, record, _, action) => [
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: optionColumnAlign || 'center',
            width: '100%'
          }}
          key="action"
        >
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record?.id)
              setCurrentRow(record)
            }}
            className="!text-gray"
          >
            {intl.formatMessage({ id: 'common.bianji' })}
          </a>
          {!hiddenDeleteBtn && (
            <Popconfirm
              title={intl.formatMessage({ id: 'common.confirmDelete' })}
              onConfirm={async () => {
                const tableDataSource = form?.getFieldValue('table') || []
                // 注意：这个需要通过外部的form来接管状态
                form?.setFieldsValue({
                  table: tableDataSource.filter((item: any) => item?.id !== record?.id)
                })
              }}
              key="delete"
            >
              <a key="delete" className="!text-gray">
                {intl.formatMessage({ id: 'common.delete' })}
              </a>
            </Popconfirm>
          )}
          {!hiddenCopyBtn && (
            <EditableProTable.RecordCreator
              record={{
                ...record,
                id: (Math.random() * 1000000).toFixed(0)
              }}
            >
              <a className="!text-gray">{intl.formatMessage({ id: 'common.copy' })}</a>
            </EditableProTable.RecordCreator>
          )}
        </div>
      ]
    })
  }

  columns.forEach((v) => {
    v.className = '!px-5' // 统一修改单元格间距
  })

  const tableClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-table-thead >tr>th': {
        background: hiddenHeaderBg ? '#fff !important' : ''
      },
      // 去掉表格边框线，重新定义新的
      '.ant-table-container': {
        borderLeft: 'none !important',
        borderTop: 'none !important',
        borderTopLeftRadius: '0 !important',
        borderTopRightRadius: '0 !important'
      },
      '.ant-table-thead > tr > th:before': {
        display: 'none !important'
      }
    }
  })

  const borderColorName = {
    weak: '#D9DDE3',
    light: '#f0f0f0'
  }[borderColor]

  // 定义表格边框线，因没有圆角
  const tableBorderClassName = useEmotionCss(({ token }) => {
    return {
      // 把表格最后一行的底部线条删除
      '.ant-table-tbody > .ant-table-row:last-child > td': {
        borderBottom: 'none !important',
        borderColor: '#f0f0f0 !important'
      },
      '.ant-table-tbody > .ant-table-row > td:last-child': {
        borderRight: 'none !important'
      },
      '.ant-table-thead > tr > th:last-child': {
        borderRight: 'none !important'
      },
      '.ant-table': {
        border: `1px solid ${borderColorName} !important`,
        borderRadius: '10px !important',
        overflow: 'hidden'
      }
    }
  })

  // 获取table数据 const rows = editorFormRef.current?.getRowsData?.();
  return (
    <>
      <EditableProTable<T, U>
        // 注意：id必须为字符串，否则编辑不成功
        rowKey={'id'}
        // name="table"
        name={name}
        className={classNames(tableClassName, { [tableBorderClassName]: showCustomBordered })}
        // scroll={{
        //   x: 960,
        // }}
        // value	同 dataSource，传入一个数组，是 table 渲染的元数据
        // value: [],
        // onChange	dataSource 修改时触发，删除和修改都会触发，如果设置了 value，Table 会成为一个受控组件。
        // value={dataSource}
        // onChange={setDataSource}
        bordered
        // table 所有的 form，带了一些表格特有的操作
        editableFormRef={editorFormRef}
        // headerTitle="可编辑表格"
        // 最大的行数，到达最大行数新建按钮会自动消失
        // maxLength={5}
        // 保存后通知 Form
        // 是否受控，如果受控每次编辑都会触发 onChange，并且会修改 dataSource
        // 如果为 true，每次 value 更新都会重置表单
        controlled={false}
        // recordCreatorProps={false}就可以关掉按钮
        // 同时使用 actionRef.current?.addEditRecord(row) 来控制新建行
        // @ts-ignore
        recordCreatorProps={
          hiddenAddBtn
            ? false
            : {
                // 顶部添加还是末尾添加
                position: 'bottom',
                // record 可以配置新增行的默认数据
                // 不写 key ，会使用 index 当行 id
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                // 设置按钮文案
                creatorButtonText: intl.formatMessage({ id: 'mt.xinzengyihang' }),
                ...recordCreatorProps
                // 按钮的样式设置，可以设置按钮是否显示
                // 这样可以做最大行限制和最小行限制之类的功能
                // style: {
                //   display: 'none',
                // },
                // https://ant.design/components/button-cn/#API
                // ...antButtonProps,
              }
        }
        columns={columns}
        editable={{
          form,
          // 可编辑表格的类型，单行编辑或者多行编辑 single | multiple
          type: 'single',
          // 正在编辑的行，受控属性。 默认 key 会使用 rowKey 的配置，如果没有配置会使用 index，建议使用 rowKey
          // editableKeys,
          formProps: {}, // 可以配置 form 的属性，但是不支持 onFinish
          // form, // form实例
          // 行数据被修改的时候触发
          // onChange: setEditableRowKeys,
          // 自定义编辑模式的操作栏 defaultDom = {save,cancel,delete}
          actionRender: (row, config, defaultDom) => {
            //
            return [
              <div
                key="action"
                className="flex gap-3 w-full"
                style={{
                  justifyContent: optionColumnAlign || 'center'
                }}
              >
                {defaultDom.save}
                {defaultDom.cancel}
              </div>
            ]
          },
          // 保存一行的时候触发
          onSave: async (key, row) => {
            console.log('onSave', key, row)
            onRowSave?.(key, row)
          },
          saveText: intl.formatMessage({ id: 'common.save' }), // 保存一行的文字
          // 删除一行的时候触发
          onDelete: async (key, row) => {
            console.log('onDelete', key, row)

            onRowDelete?.(key, row)
          },
          deleteText: intl.formatMessage({ id: 'common.delete' }), // 删除一行的文字
          // 取消编辑一行时触发
          onCancel: async (key, row, originRow) => {
            console.log('onCancel', key, row)
            onRowCancel?.(key, row)

            // 修复取消编辑没有回显上次的值
            if (name) {
              const tableData: any = cloneDeep(form?.getFieldValue(name))
              const idx: number = tableData?.findIndex?.((item: any) => item?.id === row?.id)

              if (idx !== -1 && tableData) {
                // 回显上次值
                tableData[idx] = currentRow
                form?.setFieldsValue({
                  [name]: tableData
                })
                // 重置当前行数据
                setCurrentRow(undefined)
              }
            }
          },
          cancelText: intl.formatMessage({ id: 'common.cancel' }), // 取消编辑一行的文字
          deletePopconfirmMessage: intl.formatMessage({ id: 'mt.shanchucixiang' }), // 删除时弹出的确认框提示消息
          onlyOneLineEditorAlertMessage: <span className="!text-white">{intl.formatMessage({ id: 'mt.zhinengtongshibiaojiyihang' })}</span>, // 只能编辑一行的的提示
          onlyAddOneLineAlertMessage: <span className="!text-white">{intl.formatMessage({ id: 'mt.zhinengxinzengyihang' })}</span>, // 只能同时新增一行的提示
          onValuesChange: (record, recordList) => {
            console.log('onValuesChange', recordList)
          },
          ...editable
        }}
        locale={{ emptyText: <Empty /> }}
        {...res}
      />
    </>
  )
}
