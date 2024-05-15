import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Button, message, Modal } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'
import { flushSync } from 'react-dom'

import Popup from '@/components/Base/Popup'
import { useEnv } from '@/context/envProvider'
import { formatEmail, formatMobile } from '@/utils'
import { onLogout } from '@/utils/navigator'

export default function MenuExtra() {
  const { isMobileOrIpad, breakPoint } = useEnv()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const intl = useIntl()
  const { initialState, setInitialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const isSmallScreen = breakPoint === 'xs'

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    flushSync(() => {
      setInitialState((s) => ({ ...s, currentUser: undefined }))
    })
    message.success(intl.formatMessage({ id: 'pc.logout' }))
    onLogout()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const renderFooterBtn = (w?: number | string) => {
    const width = typeof w === 'number' ? (w || 200) + 'px' : w
    return (
      <>
        <Button onClick={() => setIsModalOpen(false)} style={{ width }}>
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button type="primary" onClick={handleOk} style={{ width }}>
          <FormattedMessage id="common.confirm" />
        </Button>
      </>
    )
  }

  return (
    <>
      <div className={'pb-[8px] mb-1 border-b border-main'}>
        {/* <p>
          <FormattedMessage id="admin.welcome" /> {currentUser?.name}
        </p> */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center flex-1">
            <div
              className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(270deg, rgb(224, 254, 255) 0%, rgb(206, 255, 183) 100%)' }}
            >
              <img src="/img/default-avatar.png" className="w-[20px] h-[20px] rounded-full" />
            </div>
            <div className="flex flex-col pl-2">
              <h2 className={classNames('truncate', { 'max-w-[170px]': !isMobileOrIpad })}>
                {currentUser?.name || formatMobile(currentUser?.phone) || formatEmail(currentUser?.email)}
              </h2>
              {/* <span>
                <span className="bg-[rgb(23,168,60)] w-[7px] h-[7px] rounded-[4px] inline-block" />
                <span className="pl-[3px]">online</span>
              </span> */}
            </div>
          </div>
          <Button size="small" onClick={showModal}>
            <FormattedMessage id="common.logout" />
          </Button>
        </div>
      </div>
      {!isSmallScreen && (
        <Modal
          title={<FormattedMessage id="common.tips" />}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={400}
          centered
          footer={<div className="flex justify-around items-center">{renderFooterBtn('40%')}</div>}
        >
          <img src="/img/logout@2x.png" />
          <p className="text-center">
            <FormattedMessage id="admin.logoutTips" />
          </p>
        </Modal>
      )}
      {isSmallScreen && (
        <Popup visible={isModalOpen} onMaskClick={handleCancel} onClose={handleCancel} height="45vh">
          <div className="pb-6">
            <img src="/img/logout@2x.png" />
            <p className="text-center">
              <FormattedMessage id="admin.logoutTips" />
            </p>
          </div>
          <div className="flex justify-around items-center">{renderFooterBtn('45%')}</div>
        </Popup>
      )}
    </>
  )
}
