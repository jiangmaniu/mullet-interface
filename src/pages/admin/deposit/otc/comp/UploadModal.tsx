import { FormattedMessage, getIntl } from '@umijs/max'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Modal from '@/components/Admin/Modal'
import { message } from '@/utils/message'
import { GetProp, Image, UploadProps } from 'antd'

import Button from '@/components/Base/Button'
import { submitDepositCertificate } from '@/services/api/wallet'
import { push } from '@/utils/navigator'
import UploadIdcard from './UploadCard'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

type IProps = {
  // trigger?: JSX.Element
  // handleReset: () => void
  id: string
  certificateUrl: string
}

function UploadModal(props: IProps, ref: any) {
  const modalRef = useRef<any>()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  const [imgs, setImgs] = useState<string[]>([])

  useEffect(() => {
    setImgs(props.certificateUrl?.split(',') || [])
  }, [props.certificateUrl])

  const handleSubmit = () => {
    if (imgs.length === 0) {
      message.info(getIntl().formatMessage({ id: 'mt.qingshangchuangpingzheng' }))
      return
    }

    submitDepositCertificate({
      id: props.id,
      certificateUrl: imgs.join(',')
    }).then((res) => {
      if (res.success) {
        message.info(getIntl().formatMessage({ id: 'common.submitSuccess' }))
        modalRef.current.close()
        push(`/deposit/wait`)
      }
    })
  }

  const [visible, setVisible] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

  return (
    <>
      <Modal
        width={500}
        afterOpenChange={(open) => {
          // props.handleReset()
        }}
        title={
          <span className="">
            <FormattedMessage id="mt.shangchuanpinzheng" />

            <span className="text-red-500 text-sm font-normal underline cursor-pointer ml-4" onClick={() => setVisible(true)}>
              <FormattedMessage id="mt.chukanshili" />
            </span>
          </span>
        }
        footer={null}
        ref={modalRef}
        contentStyle={{ paddingTop: 0, paddingBottom: 18 }}
        titleStyle={{ paddingBottom: 0 }}
      >
        <UploadIdcard setImgs={setImgs} imgs={imgs} />

        <Button size="large" type="primary" className="mt-2 w-full" onClick={handleSubmit}>
          <FormattedMessage id="common.tijiao" />
        </Button>
      </Modal>
      <Image.PreviewGroup
        preview={{
          visible,
          scaleStep: 1,
          destroyOnClose: true,
          onVisibleChange: (value) => {
            setVisible(value)
            if (!value) {
              // @hack 修复点击mask不销毁组件
              setForceUpdate(forceUpdate + 1)
            }
          }
        }}
        key={forceUpdate}
      >
        <Image width={200} style={{ display: 'none' }} src={'/img/shili-01.jpeg'} />
        <Image width={200} style={{ display: 'none' }} src={'/img/shili-02.png'} />
        <Image width={200} style={{ display: 'none' }} src={'/img/shili-03.jpeg'} />
      </Image.PreviewGroup>
    </>
  )
}

export default forwardRef(UploadModal)
