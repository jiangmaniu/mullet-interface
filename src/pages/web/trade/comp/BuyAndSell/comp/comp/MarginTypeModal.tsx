import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import Modal from '@/components/Base/Modal'
import { useStores } from '@/context/mobxProvider'

type IProps = {
  trigger: JSX.Element
}

function MarginTypeModal({ trigger }: IProps) {
  const { trade } = useStores()
  const modalRef = useRef<any>()
  const [current, setCurrent] = useState<API.MarginType>('CROSS_MARGIN')
  const marginType = trade.marginType

  const marginOptions: Array<{ label: React.ReactNode; value: API.MarginType; desc: React.ReactNode }> = [
    {
      label: <FormattedMessage id="mt.quancang" />,
      value: 'CROSS_MARGIN',
      desc: <FormattedMessage id="mt.quancangdesc" />
    },
    {
      label: <FormattedMessage id="mt.zhucang" />,
      value: 'ISOLATED_MARGIN',
      desc: <FormattedMessage id="mt.zhucangdesc" />
    }
  ]

  useEffect(() => {
    setCurrent(marginType)
  }, [marginType])

  return (
    <Modal
      trigger={trigger}
      styles={{
        content: { padding: 0 }
      }}
      footer={null}
      width={410}
      centered
      ref={modalRef}
      maskClosable={false}
    >
      <img src="/img/mask2.png" className="absolute right-[67px] top-[22px] h-[252px] w-[294px] z-[3]" />
      <div className="absolute w-full top-0 z-[2] h-[242px] rounded-[10px]" style={{ background: 'var(--card-gradient-header-bg)' }}></div>
      <div className="px-[18px] pb-4 relative z-10">
        <div className="flex items-center justify-center">
          <img src={'/img/margintype.png'} width={121} height={121} alt="" />
        </div>
        <div className="relative -top-1 flex flex-col items-center justify-center px-4">
          <div className="text-base text-gray font-semibold">
            <FormattedMessage id="mt.baozhengjinmoshi" />
          </div>
          <div className="text-sm text-gray pt-[6px]">
            <FormattedMessage id="mt.baozhengjinmoshitips" />
          </div>
        </div>

        <div className="relative">
          <div className="p-4">
            {marginOptions.map((item, idx) => {
              const isActive = item.value === current
              return (
                <div
                  key={idx}
                  className={classNames(
                    'mb-[10px] p-3 rounded-[10px] border cursor-pointer',
                    isActive ? 'border-[rgba(24,62,252,0.12)]' : 'border-gray-130'
                  )}
                  style={{
                    background: isActive ? 'linear-gradient( 180deg, #E0EEFF 0%, #FFFFFF 100%)' : '#fff'
                  }}
                  onClick={() => {
                    setCurrent(item.value)
                  }}
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-gray font-semibold text-base">{item.label}</span>
                    {isActive && <img src="/img/check-icon.png" width={18} height={18} />}
                  </div>
                  <div className="text-xs text-gray-secondary">{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
        <Button
          type="primary"
          block
          onClick={() => {
            modalRef?.current?.close()
            trade.setMarginType(current)
          }}
        >
          <FormattedMessage id="common.queren" />
        </Button>
      </div>
    </Modal>
  )
}

export default observer(MarginTypeModal)
