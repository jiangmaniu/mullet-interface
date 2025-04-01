import { FormattedMessage } from '@umijs/max'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import Modal from '@/components/Admin/Modal'
import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'

type IProps = {
  trigger?: JSX.Element
  handleReset: () => void
}

function FailModal(props: IProps, ref: any) {
  const modalRef = useRef<any>()
  const { theme } = useTheme()

  useImperativeHandle(ref, () => {
    return modalRef.current
  })

  return (
    <Modal
      width={430}
      footer={null}
      ref={modalRef}
      closable={false}
      maskClosable={false}
      styles={{
        header: {
          backgroundColor: theme.colors.backgroundColor.secondary
        }
      }}
      contentStyle={{ padding: 18 }}
      renderTitle={() => (
        <div className="h-[100px] w-60 relative">
          <img src="/img/quxiaodingdan.png" className="absolute -top-2 right-0" width={102} height={102} />
        </div>
      )}
    >
      <div className="mb-5">
        <FormattedMessage id="mt.zhifushibai" />
      </div>
      <div className="flex items-center justify-between gap-x-3">
        <Button
          type="primary"
          className="w-full !bg-red"
          onClick={() => {
            props.handleReset()
            modalRef.current.close()
          }}
        >
          <FormattedMessage id="common.queren" />
        </Button>
      </div>
    </Modal>
  )
}

export default forwardRef(FailModal)
