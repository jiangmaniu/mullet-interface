import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { QRCodeCanvas } from 'qrcode.react'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Button from '@/components/Base/Button'
import { cn } from '@/utils/cn'
import { message } from '@/utils/message'

type IProps = {
  form: FormInstance
}

export default function TransferCrypto({ form }: IProps) {
  const intl = useIntl()

  const address = Form.useWatch('address', form) ?? ''

  return (
    <div>
      <div className="text-sm text-primary font-medium mb-3">
        <FormattedMessage id="mt.chongbidizhierweima" />
      </div>
      <div className="flex flex-row items-end gap-8">
        {/* <canvas id="canvas" className="w-[135px] h-[135px] bg-gray-150 rounded-lg flex items-center justify-center flex-shrink-0"></canvas> */}
        <div className={cn('opacity-10 cursor-not-allowed', address && 'opacity-100 cursor-pointer')}>
          <QRCodeCanvas
            value={address}
            size={135}
            fgColor="#000000"
            bgColor="#ffffff"
            level="L"
            imageSettings={{
              src: '/img/saomiao.svg',
              height: 35, // 设置 logo 大小
              width: 35,
              excavate: true // 设置是否挖空二维码的中间部分
            }}
          />
        </div>
        <div className="flex flex-col gap-4 flex-shrink">
          <img src="/img/saomiao.svg" width={20} height={20} />
          <div className="text-xs text-secondary font-normal">
            <FormattedMessage id="mt.qingzhuanzhangzhixiafangqukuailiandizhi" />
          </div>
        </div>
      </div>
      <div className="text-sm text-primary font-medium mt-9 mb-3">
        <FormattedMessage id="mt.chongbidizhi" />
      </div>
      <div className=" bg-gray-50 py-1 px-[7px] rounded-[9px] flex-shrink flex flex-row items-center gap-2">
        <div className="flex-1">
          <ProFormText
            name="address"
            disabled
            placeholder="--"
            fieldProps={{
              size: 'small',
              style: {
                border: 'none',
                height: '28px'
              }
            }}
          />
        </div>
        {address && (
          <Button
            type="default"
            size="small"
            style={{ height: '28px' }}
            onClick={() => {
              navigator.clipboard.writeText(address).then(() => {
                message.info(intl.formatMessage({ id: 'mt.fuzhichenggong' }))
              })
            }}
          >
            <FormattedMessage id="mt.fuzhi" />
          </Button>
        )}
      </div>
    </div>
  )
}
