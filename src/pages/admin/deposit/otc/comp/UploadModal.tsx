import { FormattedMessage, getIntl } from '@umijs/max'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Modal from '@/components/Admin/Modal'
import { message } from '@/utils/message'
import { GetProp, UploadProps } from 'antd'

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

  return (
    <Modal
      width={500}
      afterOpenChange={(open) => {
        // props.handleReset()
      }}
      title={<FormattedMessage id="mt.shangchuanpinzheng" />}
      footer={null}
      ref={modalRef}
    >
      <UploadIdcard setImgs={setImgs} imgs={imgs} />
      <Button size="large" type="primary" className="mt-5 w-full" onClick={handleSubmit}>
        <FormattedMessage id="common.tijiao" />
      </Button>
      {/* <Children>
        <div className='flex items-center justify-center'>

        </div>
      </Children> */}
    </Modal>
  )
}

export default forwardRef(UploadModal)
