import { FormattedMessage } from '@umijs/max'
import Lottie from 'lottie-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import Modal from '../../Modal'
import animationData from './loading.json'

type IProps = {
  width?: number
  height?: number
}

export default function Loading({ width = 400, height = 400 }: IProps) {
  return (
    <Lottie
      animationData={animationData}
      renderer="svg"
      autoplay={true}
      loop={true}
      assetsPath="/img/animation/"
      style={{ width, height }}
    />
  )
}

export const ModalLoading = forwardRef((props, ref: any) => {
  const [open, setOpen] = useState(false)

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => {
    return {
      show: () => {
        setOpen(true)
      },
      close: () => {
        setOpen(false)
      }
    }
  })

  return (
    <Modal
      open={open}
      width={400}
      closable={false}
      footer={null}
      centered
      title={<FormattedMessage id="mt.chuangjianzhanghu" />}
      styles={{ content: { padding: 0 }, header: { paddingInline: 20, paddingTop: 20 } }}
    >
      <div className="relative -top-8">
        <Loading height={300} />
      </div>
      <div className="flex items-center justify-center text-gray-secondary text-base relative -top-12">
        <FormattedMessage id="mt.chuangjianzhanghuzhong" />
      </div>
    </Modal>
  )
})
