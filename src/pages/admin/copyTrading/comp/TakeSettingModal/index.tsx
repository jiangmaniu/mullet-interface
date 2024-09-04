import './style.less'

import { ModalForm } from '@ant-design/pro-components'
import { getIntl, useIntl } from '@umijs/max'
import { Form, Tabs, TabsProps } from 'antd'
import { useRef } from 'react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import { ModalLoading } from '@/components/Base/Lottie/Loading'
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
  info: TradeFollowLead.LeadDetailItem | null
  open?: boolean
  onOpenChange?: ((open: boolean) => void) | undefined
  trigger?: JSX.Element
  onConfirm?: (values: any) => void
}

export default ({ info, trigger, open, onOpenChange }: IProps) => {
  const [form] = Form.useForm()
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'mt.daidanshezhi' })
  const loadingRef = useRef<any>()

  const onAvatarChange = (p: any) => {
    form.setFieldValue('imageUrl', p.link)
    form.validateFields(['imageUrl'])
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: intl.formatMessage({ id: 'mt.jibenxinxi' }),
      children: <BaseInformation form={form} info={info} />,
      forceRender: true
    },
    {
      key: '2',
      label: intl.formatMessage({ id: 'mt.daidancanshu' }),
      children: <TakerParams form={form} info={info} />,
      forceRender: true
    }
  ]

  const handleOpenChange = (open: boolean) => {
    open &&
      form.setFieldsValue({
        leadId: info?.leadId || 0,
        tradeAccountId: info?.tradeAccountId || 0,
        imageUrl: info?.imageUrl || '',
        projectName: info?.projectName || '',
        desc: info?.desc || '',
        tags: info?.tags || '',
        assetRequirement: info?.assetRequirement || 0,
        maxSupportCount: info?.maxSupportCount || 0,
        profitSharingRatio: info?.profitSharingRatio || 0,
        assetScale: info?.assetScale || 0
      })

    onOpenChange?.(open)
  }

  const onFinish = async (values: any) => {
    loadingRef.current?.show()
    setTradeFollowLeadSettings({
      ...values
    })
      .then((res) => {
        // form.setFieldsValue(formDefault) // 重置
        if (res.success) {
          message.info(getIntl().formatMessage({ id: 'common.opSuccess' }))
        }
      })
      .finally(() => {
        loadingRef.current?.hide()
      })
  }

  return (
    <div>
      <ModalForm
        onFinish={onFinish}
        title={title}
        trigger={trigger}
        form={form}
        width={430}
        open={open}
        onOpenChange={handleOpenChange}
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
            <AvatarUpload defaultImageUrl={info?.imageUrl} width={81} height={81} onChange={onAvatarChange} />
          </div>
          <div className="hide-form-item">
            <ProFormText name="imageUrl" rules={[{ required: true, message: intl.formatMessage({ id: 'mt.qingshangchuantouxiang' }) }]} />
          </div>
          <Tabs items={items} className="flex-1  w-full flex-grow" />
        </div>
      </ModalForm>

      <ModalLoading
        ref={loadingRef}
        title={intl.formatMessage({ id: 'mt.jieshugendan' })}
        tips={intl.formatMessage({ id: 'mt.jieshugendanzhong' })}
      />
    </div>
  )
}
