import './style.less'

import { ModalForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, message } from 'antd'
import { useState } from 'react'

import Button from '@/components/Base/Button'
import { push } from '@/utils/navigator'

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

type IProps = {
  trigger?: JSX.Element
  open?: boolean
  onSuccess?: () => void
  onConfirm?: (values: any) => void
  onOpenChange?: (bo: boolean) => void
  params?: Record<string, any>
}

export default ({ trigger, open, onSuccess, onConfirm, onOpenChange, params }: IProps) => {
  const [form] = Form.useForm<{ name: string; company: string }>()
  const intl = useIntl()

  const [status, setStatus] = useState<'abled' | 'disabled'>('disabled')

  const tips = {
    disabled: intl.formatMessage({ id: 'mt.dingdanweichuli' }),
    abled: intl.formatMessage({ id: 'mt.jieshudaidanhou' })
  }

  const confirms = {
    disabled: intl.formatMessage({ id: 'mt.qupingcang' }),
    abled: intl.formatMessage({ id: 'mt.jieshudaidan' })
  }

  return (
    <div>
      <ModalForm<{
        name: string
        company: string
      }>
        title={<></>}
        trigger={trigger}
        open={open}
        onOpenChange={onOpenChange}
        form={form}
        width={430}
        autoFocusFirstInput
        modalProps={{
          centered: true,
          className: 'custom',
          destroyOnClose: true,
          onCancel: () => console.log('run')
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          await waitTime(2000)
          console.log(values.name)
          message.success('提交成功')
          return true
        }}
        submitter={{
          render: (props, defaultDoms) => {
            return []
          }
        }}
      >
        <div className="flex flex-col items-center gap-6">
          {/* <div className=" w-[227px] h-[195px] flex items-center justify-center">
            <img src="/img/chuangjianzhanghu.svg" width={227} height={195} />
          </div> */}
          <div className=" w-[227px] h-[202px] bg-[url('/img/modal-bg.png')] bg-[length:100%_100%] flex flex-col items-center justify-start -mt-2 mb-2 gap-1.5">
            <div className="flex flex-col items-center gap-1">
              <img src="/img/chuangjianzhanghu.svg" width={133} height={133} />
            </div>
            <div className="flex flex-col flex-1 items-center gap-1.5 ">
              <span className=" text-lg text-primary font-semibold">
                <FormattedMessage id="mt.wujiaoyizhanghu" />
              </span>
              <span className=" text-sm text-primary text-center w-[321px]">
                <FormattedMessage id="mt.youyuningdangqianzhanghuyouchicang" />
              </span>
            </div>
          </div>

          <div className=" flex flex-row items-center justify-between w-full gap-3.5">
            <Button
              height={38}
              style={{
                width: '100%',
                borderRadius: 8
              }}
            >
              <div className=" flex items-center gap-1">
                <span className=" text-base font-semibold">
                  <FormattedMessage id="mt.zaikaolvxia" />
                </span>
              </div>
            </Button>
            <Button
              height={38}
              type="primary"
              style={{
                width: '100%',
                borderRadius: 8
              }}
              onClick={() => {
                // 拼接 params 參數 到路由 ‘/account/type’ 中
                let _parmas: any[] = []
                if (params) {
                  _parmas = Object.keys(params).map((key) => `${key}=${params[key]}`)
                }

                push(`/account/type?${_parmas.join('&')}`)
              }}
            >
              <div className=" flex items-center gap-1 ">
                <span className="font-semibold text-base ">
                  <FormattedMessage id="mt.chuangjianzhanghu" />
                </span>
              </div>
            </Button>
          </div>
        </div>
      </ModalForm>
    </div>
  )
}
