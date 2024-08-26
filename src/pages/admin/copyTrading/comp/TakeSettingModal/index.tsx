import './style.less'

import { ModalForm } from '@ant-design/pro-components'
import { getIntl, useIntl } from '@umijs/max'
import { Form, Tabs, TabsProps } from 'antd'
import { useMemo } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { setTradeFollowLeadSettings } from '@/services/api/tradeFollow/lead'
import { message } from '@/utils/message'

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
  info: Record<string, any>
  open?: boolean
  onOpenChange?: ((open: boolean) => void) | undefined
  trigger?: JSX.Element
  onConfirm?: (values: any) => void
}

export default ({ info, trigger, open, onOpenChange }: IProps) => {
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
      children: <BaseInformation form={form} />,
      forceRender: true
    },
    {
      key: '2',
      label: intl.formatMessage({ id: 'mt.daidancanshu' }),
      children: <TakerParams form={form} />,
      forceRender: true
    }
  ]

  const formDefault = useMemo(
    () => ({
      leadId: info?.leadId || 0,
      imageUrl: info?.imageUrl || '',
      projectName: info?.projectName || '',
      desc: info?.desc || '',
      tags: info?.tags || '',
      assetRequirement: info?.assetRequirement || 0,
      maxSupportCount: info?.maxSupportCount || 0,
      profitSharingRatio: info?.profitSharingRatio || 0,
      assetSacle: info?.assetScale || 0
    }),
    [info]
  )

  const onFinish = async (values: any) => {
    setTradeFollowLeadSettings({
      ...formDefault,
      ...values
    })
      .then((res) => {
        // form.setFieldsValue(formDefault) // 重置
        if (res.success) {
          message.info(getIntl().formatMessage({ id: 'common.opSuccess' }))
        }
      })
      .catch((error) => {
        message.info(getIntl().formatMessage({ id: 'common.opFailed' }))
      })
  }

  return (
    <div>
      <ModalForm<{
        name: string
        company: string
      }>
        onFinish={onFinish}
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
          <div className="hide-form-item">
            <ProFormText name="imageUrl" rules={[{ required: true, message: intl.formatMessage({ id: 'mt.qingshangchuantouxiang' }) }]} />
          </div>
          <Tabs items={items} className="flex-1  w-full flex-grow" />
        </div>
      </ModalForm>
    </div>
  )
}
