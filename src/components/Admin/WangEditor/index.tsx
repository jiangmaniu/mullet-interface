import '@wangeditor/editor/dist/css/style.css'

import { useIntl } from '@umijs/max'
import { i18nChangeLanguage, IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { FormInstance } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type IProps = {
  /**编辑器高度 */
  height?: number
  /**编辑器样式 */
  editorStyle?: React.CSSProperties
  /**Toolbar样式 */
  toolbarStyle?: React.CSSProperties
  /**表单的name字段 */
  name?: string
  /**表单实例 */
  form?: FormInstance
  /**编辑器模式：简洁、默认 */
  mode?: 'simple' | 'default'
}
export default forwardRef(({ mode, height = 300, editorStyle, toolbarStyle, name, form }: IProps, ref: any) => {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [forceUpdate, setForceUpdate] = useState(0) // 用于触发重新渲染的 key
  const intl = useIntl()

  useImperativeHandle(ref, () => {
    return editor
  })

  // 编辑器内容
  const [html, setHtml] = useState('')

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: intl.formatMessage({ id: 'common.pleaseInput' }),
    MENU_CONF: {}
  }

  // https://www.wangeditor.com/v5/getting-started.html

  // @ts-ignore
  editorConfig.MENU_CONF['uploadImage'] = {
    // 菜单配置
    uploadImage: {
      server: '/api/upload-img',
      timeout: 5 * 1000, // 5s

      fieldName: 'custom-fileName',
      meta: { token: 'xxx', a: 100 },
      metaWithUrl: true, // join params to url
      headers: { Accept: 'text/x-json' },

      maxFileSize: 10 * 1024 * 1024, // 10M

      // base64 插入图片：小于该值就插入 base64 格式（而不上传），默认为 0
      base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb

      // 上传之前触发
      onBeforeUpload(file: File) {
        console.log('onBeforeUpload', file)

        return file // will upload this file
        // return false // prevent upload

        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
      },
      // 上传进度的回调函数
      onProgress(progress: number) {
        console.log('onProgress', progress)
      },
      // 单个文件上传成功之后
      onSuccess(file: File, res: any) {
        console.log('onSuccess', file, res)
      },
      onFailed(file: File, res: any) {
        // alert(res.message)
        console.log('onFailed', file, res)
      },
      onError(file: File, err: any, res: any) {
        // alert(err.message)
        console.error('onError', file, err, res)
      }
    }
  }

  useEffect(() => {
    const formData = form?.getFieldsValue()
    if (name && formData) {
      const val = formData[name as string]
      val && setHtml(val)
      setForceUpdate((prevKey) => prevKey + 1)
    }
  }, [form?.getFieldValue])

  // 及时销毁 editor ，重要！
  useEffect(() => {
    i18nChangeLanguage('en')
    return () => {
      if (editor === null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div className="!rounded-2xl z-50 border border-gray-150">
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode={mode || 'simple'}
          style={{ borderBottom: '1px solid #efefef', ...toolbarStyle }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => {
            const val = editor.getHtml()
            setHtml(val)
            // 设置表单值
            form?.setFieldValue?.(name, val)
          }}
          mode={mode || 'simple'}
          style={{ height, overflowY: 'hidden', ...editorStyle }}
        />
      </div>
    </>
  )
})
