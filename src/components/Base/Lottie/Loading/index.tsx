import './index.less'

import { useIntl } from '@umijs/max'
import Lottie from 'lottie-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

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

export const ModalLoading = forwardRef(
  ({ title, tips, open }: { title?: React.ReactNode; tips?: React.ReactNode; open?: boolean }, ref: any) => {
    const [isOpen, setIsOpen] = useState<any>(false)
    const intl = useIntl()

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => {
      return {
        show: () => {
          setIsOpen(true)
        },
        close: () => {
          setIsOpen(false)
        }
      }
    })

    useEffect(() => {
      setIsOpen(open)
    }, [open])

    return (
      <Modal
        open={isOpen}
        width={400}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        title={title}
        styles={{ content: { padding: 0 }, header: { paddingInline: 20, paddingTop: 20 } }}
      >
        <div className="relative -top-8">
          <Loading height={300} />
        </div>
        <div className="flex items-center justify-center text-secondary text-base relative -top-12 ">
          {tips}
          <span className="dot-ani" />
        </div>
      </Modal>
    )
  }
)
