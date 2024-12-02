import { FormattedMessage, useIntl } from '@umijs/max'
import { Form, FormInstance } from 'antd'
import { QRCodeCanvas } from 'qrcode.react'

import ProFormText from '@/components/Admin/Form/ProFormText'

type IProps = {
  form: FormInstance
}

export default function TransferAddress({ form }: IProps) {
  const intl = useIntl()

  const address = Form.useWatch('address', form)

  // useEffect(() => {
  //   if (address) {
  //     let canvas = document.getElementById('canvas')

  //     QRCode.toCanvas(canvas, address, function (error) {
  //       if (error) console.error(error)
  //       console.log('success!')
  //     })
  //   }
  // }, [address])

  return (
    <div>
      <div className="text-sm text-primary font-medium mb-3">
        <FormattedMessage id="mt.chongbidizhierweima" />
      </div>
      <div className="flex flex-row items-end gap-8">
        {/* <canvas id="canvas" className="w-[135px] h-[135px] bg-gray-150 rounded-lg flex items-center justify-center flex-shrink-0"></canvas> */}

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
      <ProFormText name="address" disabled placeholder={intl.formatMessage({ id: 'mt.xitongcuowu' })} />
    </div>
  )
}
