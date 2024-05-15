import { getIntl } from '@umijs/max'
import { cloneDeep } from 'lodash'

import { ITabItem } from '@/components/Admin/Tabs'
import Iconfont from '@/components/Base/Iconfont'
import { useNotification } from '@/context/notification'

type IProps = {
  /**tabbar */
  tabList: ITabItem[]
  /**激活当前的卡片 */
  setActiveKey: (activeKey: string) => void
}

const useCheckTabsForm = ({ tabList, setActiveKey }: IProps) => {
  const { api } = useNotification()

  const checkForm = async () => {
    // 批量提交表单
    let newList = cloneDeep(tabList)
    let formData = {}
    for (let item of newList) {
      // @ts-ignore
      await item?.ref?.current
        ?.validateFields?.()
        .then((values: any) => {
          // console.log('校验成功', values)
          formData = {
            ...formData,
            ...values
          }
        })
        .catch((error: any) => {
          const { errorFields } = error || {}
          // console.log('校验失败', error)
          // @ts-ignore
          item.formErrors = errorFields.map((v: any) => ({ name: v?.name?.[0], message: v?.errors?.[0] })).filter((v: any) => v.message)
        })
    }

    const tabItem = newList.find((item: any) => item.formErrors?.length > 0)
    // 根据错误出现的位置，自动切换到未填写的Tab页面
    if (tabItem) {
      setActiveKey(tabItem.key)
    }

    // 表单错误信息弹窗提示
    const errors = newList.filter((v: any) => v.formErrors?.length > 0)
    if (errors.length) {
      setTimeout(() => {
        api?.open?.({
          message: <div className="text-gray font-semibold text-base">{getIntl().formatMessage({ id: 'mt.qingwanshanbitianxiang' })}</div>,
          // duration: 0,
          description: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '80vh',
                overflowY: 'auto',
                marginTop: 20
              }}
            >
              {errors.map((item: any, idx) => (
                <div
                  style={{ marginBottom: 20, cursor: 'pointer' }}
                  key={idx}
                  onClick={() => {
                    setActiveKey(item.key)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 8 }}>
                    <Iconfont name={item.icon} width={20} height={20} />
                    <span className="text-gray text-sm font-medium pl-1">
                      {item.label}
                      <span className="text-red pl-1">*</span>
                    </span>
                  </div>
                  {item.formErrors.map((v: any, index: number) => (
                    <div key={index} className="text-gray-secondary text-sm" style={{ lineHeight: '24px' }}>
                      {v.message}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        })
      }, 300)
    }

    if (errors.length === 0 && Object.keys(formData).length) {
      // tabs下全部的表单校验完成
      return formData
    }
    return undefined
  }

  return {
    checkForm
  }
}

export default useCheckTabsForm
