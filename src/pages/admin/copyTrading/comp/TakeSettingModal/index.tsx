import './style.less'

import { ModalForm } from '@ant-design/pro-components'
import { useIntl } from '@umijs/max'
import { Form, message, Tabs, TabsProps } from 'antd'

import { AvatarUpload } from '../../apply/AvatarUpload'
import BaseInformation from './BaseInformation'
import TakerParams from './TakerParams'

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

type IProps = {
  open?: boolean
  onOpenChange?: ((open: boolean) => void) | undefined
  trigger?: JSX.Element
  onConfirm?: (values: any) => void
}

export default ({ trigger, open, onOpenChange }: IProps) => {
  const [form] = Form.useForm<{ name: string; company: string }>()
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'mt.daidanshezhi' })

  const onAvatarChange = (p: any) => {
    form.setFieldValue('imageUrl', p.link)
    form.validateFields(['imageUrl'])
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: intl.formatMessage({ id: 'mt.jibenxinxi' }),
      children: <BaseInformation />
    },
    {
      key: '2',
      label: intl.formatMessage({ id: 'mt.daidancanshu' }),
      children: <TakerParams />
    }
  ]

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
        open={open}
        onOpenChange={onOpenChange}
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
        <div className="flex flex-col items-center">
          <div className=" w-[165px] h-[142px] bg-[url('/img/modal-bg.png')] bg-[length:100%_100%] flex items-center justify-center -mt-7">
            <AvatarUpload width={81} height={81} onChange={onAvatarChange} />
          </div>

          <Tabs items={items} className="flex-1  w-full flex-grow" />
        </div>
      </ModalForm>
    </div>
  )
}
