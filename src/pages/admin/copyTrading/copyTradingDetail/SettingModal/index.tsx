import './style.less'

import { ModalForm } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, Tabs, TabsProps, message } from 'antd'

import { CURRENCY } from '@/constants'
import { formatNum } from '@/utils'

import FixedAmount from './FixedAmount'
import FixedRatio from './FixedRatio'

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

type IProps = {
  trigger: JSX.Element
  onSuccess?: () => void
  onConfirm?: (values: any) => void
}

export default ({ trigger, onSuccess, onConfirm }: IProps) => {
  const [form] = Form.useForm<{ name: string; company: string }>()
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'mt.gendanpeizhi' })

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: intl.formatMessage({ id: 'mt.gudingjine' }),
      children: <FixedAmount onConfirm={onConfirm} />
    },
    {
      key: '2',
      label: intl.formatMessage({ id: 'mt.gudingbili' }),
      children: <FixedRatio onConfirm={onConfirm} />
    }
  ]

  const className = useEmotionCss(() => {
    return {
      '.ant-tabs': {
        '.ant-tabs-ink-bar.ant-tabs-ink-bar-animated': {
          width: '40.9994px !important',
          height: '10px !important',
          borderRadius: '8px !important',
          transform: 'translateX(-50%) translateY(50%) !important'
        }
      },

      '.ant-tabs-top > .ant-tabs-nav::before': {
        borderBottom: '1px solid #efefef !important'
      }
    }
  })

  return (
    <div>
      <ModalForm<{
        name: string
        company: string
      }>
        title={title}
        trigger={trigger}
        form={form}
        width={430}
        autoFocusFirstInput
        modalProps={{
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
        <div className="flex flex-col items-center">
          <div className=" w-[227px] h-[202px] bg-[url('/img/modal-bg.png')] bg-[length:100%_100%] flex items-center justify-center -mt-2">
            <div className=" flex flex-col items-center gap-1">
              <img src="/img/follow-icon.png" width={188} height={150} className="-mt-14" />
              <div className="flex flex-row justify-between gap-20">
                <div className="flex flex-col gap-2 w-24 items-center">
                  <span className=" text-lg leading-5 !font-dingpro-medium text-black-900">{formatNum('15')}%</span>
                  <span className=" text-xs text-gray-600">
                    <FormattedMessage id="mt.lirunfenchengbili" />
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-24 items-center">
                  <span className=" text-lg leading-5 !font-dingpro-medium text-black-900">{formatNum('15')}</span>
                  <span className=" text-xs text-gray-600">
                    <FormattedMessage id="mt.zichanyaoqiu" />
                    {CURRENCY}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Tabs items={items} className="flex-1  w-full flex-grow !-mt-3.5" />
        </div>
      </ModalForm>
    </div>
  )
}
