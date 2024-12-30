import './index.less'

import { useIntl } from '@umijs/max'
import Lottie from 'lottie-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Modal from '../../Modal'
import lynfooData from './json/lynfoo.json'
import stelluxData from './json/stellux.json'

type IProps = {
  width?: number
  height?: number
}

export default function Loading({ width = 400, height = 400 }: IProps) {
  const animationData = process.env.PLATFORM === 'lynfoo' ? lynfooData : stelluxData
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

export type ModalLoadingRef = {
  show: (before?: () => void) => void
  close: (after?: () => void) => void
}

export const ModalLoading = forwardRef(
  (
    { title, tips, open, width }: { width?: number; title?: React.ReactNode; tips?: React.ReactNode; open?: boolean },
    ref: React.Ref<ModalLoadingRef>
  ) => {
    const [isOpen, setIsOpen] = useState<any>(false)
    const intl = useIntl()

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => {
      return {
        show: (before?: () => void) => {
          before?.()
          setIsOpen(true)
        },
        close: (after?: () => void) => {
          setIsOpen(false)
          after?.()
        }
      }
    })

    useEffect(() => {
      setIsOpen(open)
    }, [open])

    return (
      <Modal
        open={isOpen}
        width={width || 400}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        title={title}
        styles={{ content: { padding: 0 }, header: { paddingInline: 20, paddingTop: 20 } }}
      >
        <div className="relative -top-4">
          <Loading width={width} height={300} />
        </div>
        <div className="flex items-center justify-center text-secondary text-base relative -top-10 ">
          {tips}
          <span className="dot-ani" />
        </div>
      </Modal>
    )
  }
)
