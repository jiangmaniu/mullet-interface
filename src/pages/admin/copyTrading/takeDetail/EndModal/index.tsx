import './style.less'

import { ModalForm } from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, message } from 'antd'
import { useEffect, useState } from 'react'

import Button from '@/components/Base/Button'
import { tradeFollowInProgressBag } from '@/services/api/tradeFollow/lead'

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

type IProps = {
  id: string
  trigger?: JSX.Element
  onSuccess?: () => void
  onConfirm?: (values: any) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default ({ id, trigger, onSuccess, onConfirm, open, onOpenChange }: IProps) => {
  const [form] = Form.useForm<{ name: string; company: string }>()
  const intl = useIntl()

  const [status, setStatus] = useState<'abled' | 'disabled'>('disabled')

  useEffect(() => {
    tradeFollowInProgressBag({
      leadId: id
    }).then((res) => {
      if (res.success) setStatus(res.data ? 'disabled' : 'abled')
    })
  }, [id])

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
        form={form}
        width={430}
        open={open}
        onOpenChange={onOpenChange}
        autoFocusFirstInput
        modalProps={{
          centered: true,
          className: 'red',
          destroyOnClose: true,
          onCancel: () => console.log('run'),
          footer: null
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
          <div className=" w-[227px] h-[195px] flex items-center justify-center">
            <img src="/img/jieshugendan.svg" width={227} height={195} />
          </div>
          <div className="flex flex-col flex-1 items-center gap-1.5 -mt-20">
            <span className=" text-lg text-primary font-semibold">
              <FormattedMessage id="mt.jieshudaidan" />
            </span>
            <span className=" text-sm text-primary">{tips[status]}</span>
          </div>
          <div className=" flex flex-row items-center justify-between w-full gap-3.5">
            <Button
              height={38}
              style={{
                width: '100%',
                borderRadius: 8
              }}
              onClick={() => {
                onOpenChange?.(false)
              }}
            >
              <div className=" flex items-center gap-1">
                <span className=" font-medium text-base ">
                  <FormattedMessage id="mt.zaikaolvxia" />
                </span>
              </div>
            </Button>
            <Button
              height={38}
              type="primary"
              style={{
                backgroundColor: 'var(--color-red-600)',
                width: '100%',
                borderRadius: 8
              }}
              onClick={() => {
                onConfirm?.({
                  status
                })
              }}
            >
              <div className=" flex items-center gap-1">
                <span className=" font-semibold text-base ">{confirms[status]}</span>
              </div>
            </Button>
          </div>
        </div>
      </ModalForm>
    </div>
  )
}
