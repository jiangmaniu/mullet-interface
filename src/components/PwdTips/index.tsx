import { FormattedMessage } from '@umijs/max'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { isPassword } from '@/utils'

const checkIcon = '/img/icons/check-icon.png'
const uncheckIcon = '/img/icons/uncheck-icon.png'

interface IProps {
  pwd: string
}

export default forwardRef(({ pwd }: IProps, ref: any) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pwd) {
      show()
    }
  }, [pwd, visible])

  const show = () => {
    if (!isPassword(pwd)) {
      setVisible(true)
    }
  }
  const hide = () => {
    setVisible(false)
  }

  useImperativeHandle(ref, () => ({
    show,
    hide
  }))

  const getCheckInfo = (key: string) => {
    const numReg = /(?=.*[0-9])/
    const usLetterReg = /(?=.*[A-Z])(?=.*[a-z])/
    const spcialLetterReg = /(?=.*[\W_])/
    if (
      (key === 'number' && numReg.test(pwd)) ||
      (key === 'usLetter' && usLetterReg.test(pwd)) ||
      (key === 'special' && spcialLetterReg.test(pwd)) ||
      (key === 'len' && pwd?.length >= 8 && pwd?.length <= 16)
    ) {
      if (isPassword(pwd)) {
        hide()
      }
      return { icon: checkIcon, checked: true }
    }
    return { icon: uncheckIcon, checked: false }
  }

  if (!visible) return null

  const numberInfo = getCheckInfo('number')
  const usLetterInfo = getCheckInfo('usLetter')
  const specialInfo = getCheckInfo('special')
  const lenInfo = getCheckInfo('len')

  return (
    <div style={{ backgroundColor: '#fff', marginTop: -10 }}>
      <div style={{ color: '#3B3B3B', fontSize: 14, paddingBottom: 10 }}>
        <FormattedMessage id="admin.table.account.YourPasswordMustContain" />
      </div>
      <div className="pb-2 flex items-center">
        <img src={numberInfo.icon} className="w-[16px] h-[16px] mr-1" />
        <span style={{ fontSize: 12, color: numberInfo.checked ? '#222' : '#9c9c9c' }}>
          <FormattedMessage id="admin.table.account.ContainsatLeastOneNumber" />
        </span>
      </div>
      <div className="pb-2 flex items-center">
        <img src={usLetterInfo.icon} className="w-[16px] h-[16px] mr-1" />
        <span style={{ fontSize: 12, color: usLetterInfo.checked ? '#222' : '#9c9c9c' }}>
          <FormattedMessage id="admin.table.account.ContainsuppercaseAndLowercaseCharacters" />
        </span>
      </div>
      <div className="pb-2 flex items-center">
        <img src={specialInfo.icon} className="w-[16px] h-[16px] mr-1" />
        <span style={{ fontSize: 12, color: specialInfo.checked ? '#222' : '#9c9c9c' }}>
          <FormattedMessage id="admin.table.account.ContainsAtLeastOneSpecialCharacter" />
        </span>
      </div>
      <div className="pb-2 flex items-center">
        <img src={lenInfo.icon} className="w-[16px] h-[16px] mr-1" />
        <span style={{ fontSize: 12, color: lenInfo.checked ? '#222' : '#9c9c9c' }}>
          <FormattedMessage id="admin.table.account.PasswordlengthIs8To16Characters" />
        </span>
      </div>
    </div>
  )
})
